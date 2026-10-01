"use client";

import { useEffect, useState, type FormEvent } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ArrowRight, Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

import "./LoginForm.css";
import "./OtpLoginForm.css";

const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export function OtpLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestLoginOtp = useAuthStore((s) => s.requestLoginOtp);
  const verifyLoginOtp = useAuthStore((s) => s.verifyLoginOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearError = useAuthStore((s) => s.clearError);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function sendOtp(event?: FormEvent) {
    event?.preventDefault();

    if (sending || cooldown > 0) return;

    clearError();
    setError("");
    setInfo("");

    if (!identifier.trim()) {
      setError("Enter your email address or mobile number.");
      return;
    }

    try {
      setSending(true);

      const result = await requestLoginOtp(identifier.trim());

      setSent(true);
      setOtp("");
      setCooldown(result.resendAfterSeconds);
      setInfo(
        result.channel === "email"
          ? "We have emailed a 6-digit OTP to you."
          : "If this number is registered, a 6-digit OTP has been sent by SMS.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send the OTP. Please try again.",
      );
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
      await verifyLoginOtp(identifier.trim(), otp);

      router.replace(safeRedirect(searchParams.get("redirect")));
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Unable to verify the OTP.",
      );
    }
  }

  return (
    <form
      onSubmit={sent ? verify : sendOtp}
      noValidate
      className="login-form"
    >
      <div className="login-form__field">
        <label htmlFor="otp-identifier" className="login-form__label">
          Email address or mobile number
        </label>

        <div className="login-form__input-wrap">
          <input
            id="otp-identifier"
            value={identifier}
            disabled={sent}
            placeholder="you@example.com or 9876543210"
            autoComplete="username"
            inputMode="email"
            onChange={(event) => setIdentifier(event.target.value)}
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
              setInfo("");
              setError("");
            }}
          >
            Change
          </button>
        ) : null}
      </div>

      {sent ? (
        <div className="login-form__field">
          <label htmlFor="otp-code" className="login-form__label">
            One-time password
          </label>

          <div className="login-form__input-wrap">
            <input
              id="otp-code"
              value={otp}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit OTP"
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="login-form__input otp-login__code"
            />
          </div>

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

      {info ? (
        <p role="status" className="otp-login__info">
          {info}
        </p>
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
        disabled={isLoading || sending}
        className="login-form__submit"
      >
        <span className="login-form__submit-label">
          {sent
            ? isLoading
              ? "Verifying"
              : "Verify & sign in"
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
            <ArrowRight
              aria-hidden="true"
              className="login-form__submit-icon"
            />
          )}
        </span>
      </button>

      <p className="otp-login__hint">
        New here? Enter your email and we will create your account when you
        verify the OTP.
      </p>
    </form>
  );
}
