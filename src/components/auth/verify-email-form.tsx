"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   COMPONENT
========================================================= */

export function VerifyEmailForm() {
  const searchParams = useSearchParams();

  const emailFromUrl =
    searchParams.get("email") ?? "";

  const verifyEmail = useAuthStore(
    (state) => state.verifyEmail,
  );

  const resendVerification =
    useAuthStore(
      (state) => state.resendVerification,
    );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  const storeError = useAuthStore(
    (state) => state.error,
  );

  const clearError = useAuthStore(
    (state) => state.clearError,
  );

  const [email, setEmail] =
    useState(emailFromUrl);

  const [otp, setOtp] = useState("");

  const [localError, setLocalError] =
    useState("");

  const [
    resendAvailable,
    setResendAvailable,
  ] = useState(true);

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(0);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* =======================================================
     SYNC EMAIL FROM URL
  ======================================================= */

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  /* =======================================================
     RESEND TIMER
  ======================================================= */

  useEffect(() => {
    if (resendSeconds <= 0) {
      setResendAvailable(true);
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((current) =>
        Math.max(0, current - 1),
      );
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [resendSeconds]);

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!/^\d{6}$/.test(otp)) {
      return "Please enter the 6-digit verification code.";
    }

    return "";
  };

  /* =======================================================
     VERIFY
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearError();
    setLocalError("");
    setSuccessMessage("");

    const validationError = validate();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await verifyEmail(
        email.trim(),
        otp,
      );

      window.location.href =
        "/login?verified=1";
    } catch {
      /*
       * Auth store contains
       * the API error.
       */
    }
  };

  /* =======================================================
     RESEND
  ======================================================= */

  const handleResend = async () => {
    if (
      !resendAvailable ||
      !email.trim()
    ) {
      return;
    }

    clearError();
    setLocalError("");
    setSuccessMessage("");

    try {
      await resendVerification(
        email.trim(),
      );

      setSuccessMessage(
        "A new verification code has been sent.",
      );

      setResendAvailable(false);
      setResendSeconds(60);
      setOtp("");
    } catch {
      /*
       * Store contains API error.
       */
    }
  };

  const errorMessage =
    localError || storeError;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="verify-email-form">
      {/* ===================================================
          INTRO
      =================================================== */}

      <div className="verify-email-form__intro">
        <div className="verify-email-form__intro-icon">
          <ShieldCheck
            aria-hidden="true"
            className="verify-email-form__intro-icon-svg"
          />
        </div>

        <div className="verify-email-form__intro-copy">
          <span className="verify-email-form__intro-label">
            Secure verification
          </span>

          <p className="verify-email-form__intro-text">
            Enter the 6-digit code sent to your
            email address to verify your Aayesha
            Fashion account.
          </p>
        </div>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="verify-email-form__fields"
      >
        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="verify-email-form__field">
          <label
            htmlFor="verify-email-address"
            className="verify-email-form__label"
          >
            Email address
          </label>

          <div className="verify-email-form__input-wrap">
            <Mail
              aria-hidden="true"
              className="verify-email-form__input-icon"
            />

            <input
              id="verify-email-address"
              type="email"
              value={email}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => {
                setEmail(event.target.value);
                setLocalError("");
                clearError();
              }}
              className="verify-email-form__input verify-email-form__input--with-icon"
            />
          </div>
        </div>

        {/* =================================================
            OTP
        ================================================= */}

        <div className="verify-email-form__field">
          <label
            htmlFor="verify-email-otp"
            className="verify-email-form__label"
          >
            Verification code
          </label>

          <input
            id="verify-email-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            placeholder="000000"
            onChange={(event) => {
              const value =
                event.target.value.replace(
                  /\D/g,
                  "",
                );

              setOtp(value.slice(0, 6));
              setLocalError("");
              clearError();
            }}
            className="verify-email-form__otp"
            aria-describedby="verify-email-otp-help"
          />

          <p
            id="verify-email-otp-help"
            className="verify-email-form__hint"
          >
            Enter the 6-digit code from your
            email.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage ? (
          <div
            role="alert"
            className="verify-email-form__error"
          >
            <span className="verify-email-form__message-icon">
              !
            </span>

            <p>{errorMessage}</p>
          </div>
        ) : null}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {successMessage ? (
          <div
            role="status"
            className="verify-email-form__success"
          >
            <CheckCircle2
              aria-hidden="true"
              className="verify-email-form__success-icon"
            />

            <p>{successMessage}</p>
          </div>
        ) : null}

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          disabled={
            isLoading ||
            otp.length !== 6
          }
          className="verify-email-form__submit"
        >
          <span>
            {isLoading
              ? "Verifying"
              : "Verify email"}
          </span>

          {isLoading ? (
            <Loader2
              aria-hidden="true"
              className="verify-email-form__submit-icon verify-email-form__submit-icon--loading"
            />
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="verify-email-form__submit-icon"
            />
          )}
        </button>
      </form>

      {/* ===================================================
          RESEND
      =================================================== */}

      <div className="verify-email-form__resend">
        <p className="verify-email-form__resend-text">
          Didn&apos;t receive the code?
        </p>

        <button
          type="button"
          disabled={
            !resendAvailable ||
            isLoading
          }
          onClick={handleResend}
          className="verify-email-form__resend-button"
        >
          <RefreshCw
            aria-hidden="true"
            className="verify-email-form__resend-icon"
          />

          <span>
            {resendAvailable
              ? "Resend code"
              : `Resend in ${resendSeconds}s`}
          </span>
        </button>
      </div>

      {/* ===================================================
          CHANGE EMAIL
      =================================================== */}

      <p className="verify-email-form__change-email">
        Entered the wrong email?{" "}
        <Link
          href="/register"
          className="verify-email-form__register-link"
        >
          Create your account again
        </Link>
      </p>
    </div>
  );
}