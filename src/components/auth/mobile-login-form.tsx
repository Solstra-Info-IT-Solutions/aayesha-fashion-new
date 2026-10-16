"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ArrowRight, Loader2 } from "lucide-react";

import {
  confirmFirebaseCode,
  describeFirebaseError,
  isFirebaseConfigured,
  sendFirebaseCode,
} from "@/lib/firebase-phone";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import "./LoginForm.css";
import "./OtpLoginForm.css";
import "./MobileLoginForm.css";

const RECAPTCHA_ID = "mobile-login-recaptcha";
const RESEND_SECONDS = 30;
const TEST_OTP_HINT = "123456";

type Mode = "loading" | "test" | "whatsapp" | "firebase" | "unavailable";

const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

/**
 * The only way to sign in: mobile number + OTP. The first login creates the account;
 * the rest of the details are filled in later from Edit profile.
 */
export function MobileLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginWithMobile = useAuthStore((state) => state.loginWithMobile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [mode, setMode] = useState<Mode>("loading");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const confirmation = useRef<Awaited<ReturnType<typeof sendFirebaseCode>> | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ mode: Exclude<Mode, "loading"> }>("/auth/mobile/config")
      .then((config) => {
        if (active) setMode(config.mode);
      })
      .catch(() => {
        if (active) setMode("unavailable");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const digits = phone.replace(/\D/g, "");

  async function sendOtp(event?: FormEvent) {
    event?.preventDefault();

    if (sending || cooldown > 0) return;

    clearError();
    setError("");

    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError("Enter a valid 10-digit mobile number.");

      return;
    }

    // Test mode (nothing is sent) and WhatsApp: the backend issues the OTP.
    if (mode === "test" || mode === "whatsapp") {
      try {
        setSending(true);

        const result = await apiFetch<{ resendAfterSeconds: number }>(
          "/auth/mobile/otp/request",
          { method: "POST", body: JSON.stringify({ phone: digits }) },
        );

        setSent(true);
        setOtp("");
        setCooldown(result.resendAfterSeconds || RESEND_SECONDS);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "We could not send the OTP. Please try again.",
        );
      } finally {
        setSending(false);
      }

      return;
    }

    if (mode !== "firebase" || !isFirebaseConfigured) {
      setError("Mobile login is not set up yet. Please try again later.");

      return;
    }

    try {
      setSending(true);

      confirmation.current = await sendFirebaseCode(digits, RECAPTCHA_ID);

      setSent(true);
      setOtp("");
      setCooldown(RESEND_SECONDS);
    } catch (cause) {
      setError(describeFirebaseError(cause));
    } finally {
      setSending(false);
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault();

    clearError();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");

      return;
    }

    try {
      let result: { isNewUser: boolean };

      if (mode === "test" || mode === "whatsapp") {
        result = await loginWithMobile({ phone: digits, otp });
      } else {
        if (!confirmation.current) {
          setError("Please request a new OTP.");

          return;
        }

        let idToken: string;

        try {
          idToken = await confirmFirebaseCode(confirmation.current, otp);
        } catch (cause) {
          setError(describeFirebaseError(cause));

          return;
        }

        result = await loginWithMobile({ idToken });
      }

      router.replace(
        result.isNewUser
          ? "/account/edit?welcome=1"
          : safeRedirect(
              searchParams.get("redirect") ?? searchParams.get("callbackUrl"),
            ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to verify the OTP.",
      );
    }
  }

  if (mode === "unavailable") {
    return (
      <div role="alert" className="login-form__error">
        <span className="login-form__error-mark" aria-hidden="true">
          !
        </span>

        <p>
          We could not reach the login service. Please check your connection and
          try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={sent ? verify : sendOtp}
      noValidate
      className="login-form"
    >
      <div className="login-form__field">
        <label htmlFor="mobile-number" className="login-form__label">
          Mobile number
        </label>

        <div className="login-form__input-wrap mobile-login__phone">
          <span className="mobile-login__prefix" aria-hidden="true">
            +91
          </span>

          <input
            id="mobile-number"
            value={phone}
            disabled={sent || mode === "loading"}
            placeholder="98765 43210"
            autoComplete="tel-national"
            inputMode="numeric"
            maxLength={14}
            onChange={(event) => setPhone(event.target.value)}
            className="login-form__input"
          />
        </div>

        {sent ? (
          <button
            type="button"
            className="otp-login__link"
            onClick={() => {
              setSent(false);
              setOtp("");
              setError("");
              setCooldown(0);
            }}
          >
            Change number
          </button>
        ) : null}
      </div>

      {sent ? (
        <div className="login-form__field">
          <label htmlFor="mobile-otp" className="login-form__label">
            One-time password
          </label>

          <div className="login-form__input-wrap">
            <input
              id="mobile-otp"
              value={otp}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit OTP"
              autoFocus
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="login-form__input otp-login__code"
            />
          </div>

          {mode === "test" ? (
            <p role="status" className="otp-login__info">
              Test mode: nothing is sent. Enter {TEST_OTP_HINT}.
            </p>
          ) : mode === "whatsapp" ? (
            <p role="status" className="otp-login__info">
              We have sent a 6-digit OTP to your WhatsApp on +91 {digits}.
            </p>
          ) : (
            <p role="status" className="otp-login__info">
              We have sent a 6-digit OTP to +91 {digits}.
            </p>
          )}

          <button
            type="button"
            className="otp-login__link"
            disabled={sending || cooldown > 0}
            onClick={() => void sendOtp()}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="login-form__error">
          <span className="login-form__error-mark" aria-hidden="true">
            !
          </span>

          <p>{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading || sending || mode === "loading"}
        className="login-form__submit"
      >
        <span className="login-form__submit-label">
          {sent
            ? isLoading
              ? "Verifying"
              : "Verify & log in"
            : sending
              ? "Sending OTP"
              : "Send OTP"}
        </span>

        <span className="login-form__submit-icon-wrap">
          {isLoading || sending ? (
            <Loader2
              aria-hidden="true"
              className="login-form__submit-icon login-form__submit-icon--loading"
            />
          ) : (
            <ArrowRight aria-hidden="true" className="login-form__submit-icon" />
          )}
        </span>
      </button>

      <p className="otp-login__hint">
        New here? Just enter your mobile number. We will set up your account when
        you verify the OTP, and you can add the rest of your details in your
        profile.
      </p>

      <div id={RECAPTCHA_ID} />
    </form>
  );
}
