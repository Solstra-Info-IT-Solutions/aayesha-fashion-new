"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Phone,
  Check,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/auth-store";

import "./RegisterForm.css";

/* =========================================================
   INPUT FIELD
========================================================= */

type InputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  icon?: "user" | "mail" | "phone";
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  icon,
  onChange,
}: InputFieldProps) {
  const Icon =
    icon === "user"
      ? UserRound
      : icon === "mail"
        ? Mail
        : icon === "phone"
          ? Phone
          : null;

  const inputId =
    label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="register-form__field">
      <label
        htmlFor={inputId}
        className="register-form__label"
      >
        {label}
      </label>

      <div className="register-form__input-wrap">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="register-form__input-icon"
          />
        ) : null}

        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`register-form__input ${
            Icon
              ? "register-form__input--with-icon"
              : ""
          }`}
        />
      </div>
    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

type PasswordFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function PasswordField({
  label,
  value,
  placeholder,
  autoComplete,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const inputId =
    label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="register-form__field">
      <label
        htmlFor={inputId}
        className="register-form__label"
      >
        {label}
      </label>

      <div className="register-form__input-wrap">
        <input
          id={inputId}
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="register-form__input register-form__input--password"
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
          className="register-form__password-toggle"
        >
          {showPassword ? (
            <EyeOff
              aria-hidden="true"
              className="register-form__password-icon"
            />
          ) : (
            <Eye
              aria-hidden="true"
              className="register-form__password-icon"
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
      valid: /[^A-Za-z0-9]/.test(
        password,
      ),
    },
  ];

  return (
    <div
      className="register-form__rules"
      aria-label="Password requirements"
    >
      <div className="register-form__rules-header">
        <span className="register-form__rules-title">
          Password requirements
        </span>

        <span className="register-form__rules-count">
          {
            rules.filter(
              (rule) => rule.valid,
            ).length
          }
          /{rules.length}
        </span>
      </div>

      <div className="register-form__rules-grid">
        {rules.map((rule) => (
          <div
            key={rule.label}
            className={`register-form__rule ${
              rule.valid
                ? "register-form__rule--valid"
                : ""
            }`}
          >
            <span
              className="register-form__rule-icon"
              aria-hidden="true"
            >
              {rule.valid ? (
                <Check
                  className="register-form__rule-check"
                />
              ) : null}
            </span>

            <span className="register-form__rule-label">
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* =========================================================
   REGISTER FORM
========================================================= */

export function RegisterForm() {
  const register = useAuthStore(
    (state) => state.register,
  );

  const storeError = useAuthStore(
    (state) => state.error,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  const clearError = useAuthStore(
    (state) => state.clearError,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [localError, setLocalError] =
    useState("");

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    if (name.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !/^(?:\+91|91)?[6-9]\d{9}$/.test(
        phone.trim(),
      )
    ) {
      return "Please enter a valid Indian mobile number.";
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

    if (
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return "Password must contain at least one special character.";
    }

    if (
      password !== confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };


  /* =======================================================
     FIELD CHANGE
  ======================================================= */

  const handleFieldChange = (
    setter: (value: string) => void,
    value: string,
  ) => {
    setter(value);

    if (localError) {
      setLocalError("");
    }

    clearError();
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

    const validationError =
      validate();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await register(
        name.trim(),
        email.trim(),
        phone.trim(),
        password,
        confirmPassword,
      );

      window.location.href =
        `/verify-email?email=${encodeURIComponent(
          email.trim(),
        )}`;
    } catch {
      /*
       * Auth store already stores
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
      className="register-form"
    >

      {/* ===================================================
          FORM INTRO
      =================================================== */}

      <div className="register-form__intro">
        <div className="register-form__intro-line" />

        <span className="register-form__intro-label">
          Create your account
        </span>
      </div>


      {/* ===================================================
          PERSONAL INFORMATION
      =================================================== */}

      <section className="register-form__section">

        <div className="register-form__section-heading">

          <div className="register-form__section-copy">

            <span className="register-form__section-eyebrow">
              Your details
            </span>

            <h2 className="register-form__section-title">
              Personal information
            </h2>

            <p className="register-form__section-description">
              Tell us a little about yourself
              to get started.
            </p>

          </div>

        </div>


        <div className="register-form__fields">

          <InputField
            label="Full name"
            value={name}
            placeholder="Your full name"
            autoComplete="name"
            icon="user"
            onChange={(value) =>
              handleFieldChange(
                setName,
                value,
              )
            }
          />

          <InputField
            label="Email address"
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            icon="mail"
            onChange={(value) =>
              handleFieldChange(
                setEmail,
                value,
              )
            }
          />

          <InputField
            label="Mobile number"
            type="tel"
            value={phone}
            placeholder="9876543210"
            autoComplete="tel"
            inputMode="tel"
            icon="phone"
            onChange={(value) =>
              handleFieldChange(
                setPhone,
                value,
              )
            }
          />

        </div>
      </section>


      {/* ===================================================
          SECURITY
      =================================================== */}

      <section className="register-form__section register-form__section--security">

        <div className="register-form__section-heading">

          <div className="register-form__section-copy">

            <span className="register-form__section-eyebrow">
              Account security
            </span>

            <h2 className="register-form__section-title">
              Create your password
            </h2>

            <p className="register-form__section-description">
              Choose a secure password for
              your Aayesha Fashion account.
            </p>

          </div>

        </div>


        <div className="register-form__fields">

          <div className="register-form__password-group">

            <PasswordField
              label="Password"
              value={password}
              placeholder="Create a secure password"
              autoComplete="new-password"
              onChange={(value) =>
                handleFieldChange(
                  setPassword,
                  value,
                )
              }
            />

            <PasswordRules
              password={password}
            />

          </div>


          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            onChange={(value) =>
              handleFieldChange(
                setConfirmPassword,
                value,
              )
            }
          />

        </div>
      </section>


      {/* ===================================================
          ERROR
      =================================================== */}

      {errorMessage ? (
        <div
          role="alert"
          className="register-form__error"
        >
          <span
            className="register-form__error-mark"
            aria-hidden="true"
          >
            !
          </span>

          <div className="register-form__error-content">
            <span className="register-form__error-title">
              Unable to create account
            </span>

            <p>{errorMessage}</p>
          </div>
        </div>
      ) : null}


      {/* ===================================================
          TERMS
      =================================================== */}

      <p className="register-form__terms">
        By creating an account, you agree to
        our terms and acknowledge our privacy
        practices.
      </p>


      {/* ===================================================
          SUBMIT
      =================================================== */}

      <button
        type="submit"
        disabled={isLoading}
        className="register-form__submit"
      >
        <span className="register-form__submit-label">
          {isLoading
            ? "Creating account..."
            : "Create account"}
        </span>

        <span
          className="register-form__submit-arrow"
          aria-hidden="true"
        >
          →
        </span>
      </button>

    </form>
  );
}