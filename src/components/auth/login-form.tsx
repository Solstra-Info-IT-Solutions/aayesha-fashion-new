"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";

import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

import "./LoginForm.css";

/* =========================================================
   COMPONENT
========================================================= */

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const verified = searchParams.get("verified");

  /* =======================================================
     AUTH STORE
  ======================================================= */

  const login = useAuthStore(
    (state) => state.login,
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

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =======================================================
     VERIFIED MESSAGE
  ======================================================= */

  useEffect(() => {
    if (verified === "1") {
      setSuccessMessage(
        "Your email has been verified successfully. Please sign in.",
      );
    }
  }, [verified]);

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

    if (!password) {
      return "Please enter your password.";
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

    const validationError = validate();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await login(
        email.trim(),
        password,
        rememberMe,
      );

      router.replace("/");

      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "EMAIL_NOT_VERIFIED"
      ) {
        router.replace(
          `/verify-email?email=${encodeURIComponent(
            email.trim(),
          )}`,
        );

        return;
      }
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
      className="login-form"
    >
      {/* ===================================================
          SUCCESS
      =================================================== */}

      {successMessage ? (
        <div
          role="status"
          className="login-form__success"
        >
          <span className="login-form__success-mark">
            ✓
          </span>

          <p>{successMessage}</p>
        </div>
      ) : null}

      {/* ===================================================
          EMAIL
      =================================================== */}

      <div className="login-form__field">
        <label
          htmlFor="login-email"
          className="login-form__label"
        >
          Email address
        </label>

        <div className="login-form__input-wrap">
          <Mail
            aria-hidden="true"
            className="login-form__input-icon"
          />

          <input
            id="login-email"
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            onChange={(event) => {
              setEmail(event.target.value);

              if (localError) {
                setLocalError("");
              }

              clearError();
            }}
            className="login-form__input"
          />
        </div>
      </div>

      {/* ===================================================
          PASSWORD
      =================================================== */}

      <div className="login-form__field">
        <div className="login-form__field-header">
          <label
            htmlFor="login-password"
            className="login-form__label"
          >
            Password
          </label>

          <Link
            href="/forgot-password"
            className="login-form__forgot-link"
          >
            Forgot password?
          </Link>
        </div>

        <div className="login-form__input-wrap">
          <input
            id="login-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            placeholder="Enter your password"
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);

              if (localError) {
                setLocalError("");
              }

              clearError();
            }}
            className="login-form__input login-form__input--password"
          />

          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            aria-pressed={showPassword}
            onClick={() =>
              setShowPassword(
                (current) => !current,
              )
            }
            className="login-form__password-toggle"
          >
            {showPassword ? (
              <EyeOff
                aria-hidden="true"
                className="login-form__password-icon"
              />
            ) : (
              <Eye
                aria-hidden="true"
                className="login-form__password-icon"
              />
            )}
          </button>
        </div>
      </div>

      {/* ===================================================
          REMEMBER ME
      =================================================== */}

      <label className="login-form__remember">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) =>
            setRememberMe(
              event.target.checked,
            )
          }
          className="login-form__checkbox"
        />

        <span className="login-form__remember-text">
          Keep me signed in
        </span>
      </label>

      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="login-form__error"
        >
          <span className="login-form__error-mark">
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
        className="login-form__submit"
      >
        <span className="login-form__submit-label">
          {isLoading
            ? "Signing in"
            : "Sign in"}
        </span>

        {isLoading ? (
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
      </button>

      {/* ===================================================
          REGISTER
      =================================================== */}

      <div className="login-form__register">
        <p className="login-form__register-text">
          New to Aayesha Fashion?
        </p>

        <Link
          href="/register"
          className="login-form__register-link"
        >
          Create an account
          <ArrowRight
            aria-hidden="true"
            className="login-form__register-icon"
          />
        </Link>
      </div>
    </form>
  );
}