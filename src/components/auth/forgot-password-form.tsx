"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

import "./ForgotPasswordForm.css";

/* =========================================================
   COMPONENT
========================================================= */

export function ForgotPasswordForm() {
  const forgotPassword = useAuthStore(
    (state) => state.forgotPassword,
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

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    clearError();
    setLocalError("");

    const normalizedEmail = email.trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail,
      )
    ) {
      setLocalError(
        "Please enter a valid email address.",
      );

      return;
    }

    try {
      await forgotPassword(normalizedEmail);

      window.location.href =
        `/reset-password?email=${encodeURIComponent(
          normalizedEmail,
        )}`;
    } catch {
      /*
       * Auth store already handles
       * the API error.
       */
    }
  };

  const errorMessage = localError || storeError;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="forgot-password-form"
    >
      {/* ===================================================
          INTRODUCTION
      =================================================== */}

      <div className="forgot-password-form__intro">
        <div className="forgot-password-form__intro-icon">
          <Mail
            aria-hidden="true"
            className="forgot-password-form__intro-icon-svg"
          />
        </div>

        <div className="forgot-password-form__intro-copy">
          <span className="forgot-password-form__intro-label">
            Password recovery
          </span>

          <p className="forgot-password-form__intro-text">
            Enter the email address associated with your
            account. We&apos;ll send you a secure password
            reset code.
          </p>
        </div>
      </div>

      {/* ===================================================
          EMAIL
      =================================================== */}

      <div className="forgot-password-form__field">
        <label
          htmlFor="forgot-password-email"
          className="forgot-password-form__label"
        >
          Email address
        </label>

        <div className="forgot-password-form__input-wrap">
          <Mail
            aria-hidden="true"
            className="forgot-password-form__input-icon"
          />

          <input
            id="forgot-password-email"
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
            className="forgot-password-form__input"
          />
        </div>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="forgot-password-form__error"
        >
          <span className="forgot-password-form__error-mark">
            !
          </span>

          <p>{errorMessage}</p>
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={isLoading}
        className="forgot-password-form__submit"
      >
        <span className="forgot-password-form__submit-label">
          {isLoading ? "Sending code" : "Send reset code"}
        </span>

        {isLoading ? (
          <Loader2
            aria-hidden="true"
            className="forgot-password-form__submit-icon forgot-password-form__submit-icon--loading"
          />
        ) : (
          <ArrowRight
            aria-hidden="true"
            className="forgot-password-form__submit-icon"
          />
        )}
      </button>

      {/* ===================================================
          BACK TO LOGIN
      =================================================== */}

      <div className="forgot-password-form__login">
        <p className="forgot-password-form__login-text">
          Remember your password?
        </p>

        <Link
          href="/login"
          className="forgot-password-form__login-link"
        >
          Sign in
          <ArrowRight
            aria-hidden="true"
            className="forgot-password-form__login-icon"
          />
        </Link>
      </div>
    </form>
  );
}