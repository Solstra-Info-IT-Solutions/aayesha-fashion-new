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
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import "./ResetPasswordForm.css";

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  value,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="reset-password-form__field">
      <label className="reset-password-form__label">
        {label}
      </label>

      <div className="reset-password-form__input-wrap">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="reset-password-form__input reset-password-form__input--password"
        />

        <button
          type="button"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          aria-pressed={visible}
          onClick={() =>
            setVisible((current) => !current)
          }
          className="reset-password-form__password-toggle"
        >
          {visible ? (
            <EyeOff
              aria-hidden="true"
              className="reset-password-form__password-icon"
            />
          ) : (
            <Eye
              aria-hidden="true"
              className="reset-password-form__password-icon"
            />
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PASSWORD RULES
========================================================= */

function PasswordRules({
  password,
}: {
  password: string;
}) {
  const rules = [
    {
      label: "8–72 characters",
      valid:
        password.length >= 8 &&
        password.length <= 72,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="reset-password-form__rules">
      <span className="reset-password-form__rules-title">
        Password requirements
      </span>

      <div className="reset-password-form__rules-grid">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`reset-password-form__rule ${
              rule.valid
                ? "reset-password-form__rule--valid"
                : ""
            }`}
          >
            <span className="reset-password-form__rule-icon">
              {rule.valid ? "✓" : ""}
            </span>

            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const emailFromUrl =
    searchParams.get("email") ?? "";

  const resetPassword = useAuthStore(
    (state) => state.resetPassword,
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

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [localError, setLocalError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* =======================================================
     SYNC EMAIL
  ======================================================= */

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

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
      return "Please enter the 6-digit reset code.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (password.length > 72) {
      return "Password cannot exceed 72 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  /* =======================================================
     SUBMIT
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
      await resetPassword(
        email.trim(),
        otp,
        password,
        confirmPassword,
      );

      setSuccessMessage(
        "Password reset successfully. Redirecting to sign in...",
      );

      window.setTimeout(() => {
        window.location.href = "/login";
      }, 900);
    } catch {
      /*
       * Auth store already contains
       * the API error.
       */
    }
  };

  const errorMessage =
    localError || storeError;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="reset-password-form"
    >
      {/* ===================================================
          INTRO
      =================================================== */}

      <div className="reset-password-form__intro">
        <div className="reset-password-form__intro-icon">
          <ShieldCheck
            aria-hidden="true"
            className="reset-password-form__intro-icon-svg"
          />
        </div>

        <div className="reset-password-form__intro-copy">
          <span className="reset-password-form__intro-label">
            Secure password reset
          </span>

          <p className="reset-password-form__intro-text">
            Enter the reset code sent to your
            email, then create a new secure
            password for your account.
          </p>
        </div>
      </div>

      {/* ===================================================
          EMAIL
      =================================================== */}

      <div className="reset-password-form__field">
        <label
          htmlFor="reset-password-email"
          className="reset-password-form__label"
        >
          Email address
        </label>

        <div className="reset-password-form__input-wrap">
          <Mail
            aria-hidden="true"
            className="reset-password-form__input-icon"
          />

          <input
            id="reset-password-email"
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
            className="reset-password-form__input reset-password-form__input--with-icon"
          />
        </div>
      </div>

      {/* ===================================================
          OTP
      =================================================== */}

      <div className="reset-password-form__field">
        <label
          htmlFor="reset-password-otp"
          className="reset-password-form__label"
        >
          Reset code
        </label>

        <input
          id="reset-password-otp"
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
          className="reset-password-form__otp"
          aria-describedby="reset-password-otp-help"
        />

        <p
          id="reset-password-otp-help"
          className="reset-password-form__field-hint"
        >
          Enter the 6-digit code sent to your
          email address.
        </p>
      </div>

      {/* ===================================================
          NEW PASSWORD
      =================================================== */}

      <div className="reset-password-form__password-section">
        <PasswordField
          label="New password"
          value={password}
          placeholder="Create a new password"
          autoComplete="new-password"
          onChange={(value) => {
            setPassword(value);
            setLocalError("");
            clearError();
          }}
        />

        <PasswordRules password={password} />
      </div>

      {/* ===================================================
          CONFIRM PASSWORD
      =================================================== */}

      <PasswordField
        label="Confirm new password"
        value={confirmPassword}
        placeholder="Re-enter your new password"
        autoComplete="new-password"
        onChange={(value) => {
          setConfirmPassword(value);
          setLocalError("");
          clearError();
        }}
      />

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="reset-password-form__error"
        >
          <span className="reset-password-form__error-mark">
            !
          </span>

          <p>{errorMessage}</p>
        </div>
      ) : null}

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {successMessage ? (
        <div
          role="status"
          className="reset-password-form__success"
        >
          <span className="reset-password-form__success-mark">
            ✓
          </span>

          <p>{successMessage}</p>
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={
          isLoading ||
          otp.length !== 6
        }
        className="reset-password-form__submit"
      >
        <span>
          {isLoading
            ? "Resetting password"
            : "Reset password"}
        </span>

        {isLoading ? (
          <Loader2
            aria-hidden="true"
            className="reset-password-form__submit-icon reset-password-form__submit-icon--loading"
          />
        ) : (
          <ArrowRight
            aria-hidden="true"
            className="reset-password-form__submit-icon"
          />
        )}
      </button>

      {/* ===================================================
          BACK TO LOGIN
      =================================================== */}

      <div className="reset-password-form__login">
        <p className="reset-password-form__login-text">
          Remember your password?
        </p>

        <Link
          href="/login"
          className="reset-password-form__login-link"
        >
          Sign in
          <ArrowRight
            aria-hidden="true"
            className="reset-password-form__login-icon"
          />
        </Link>
      </div>
    </form>
  );
}