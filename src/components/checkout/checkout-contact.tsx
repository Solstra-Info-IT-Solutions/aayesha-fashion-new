"use client";

import type { ChangeEvent } from "react";

import {
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutContact.css";

/* =========================================================
   TYPES
========================================================= */

type ContactField = "email" | "phone";

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutContact() {
  const contact = useCheckoutStore(
    (state) => state.contact,
  );

  const setContact = useCheckoutStore(
    (state) => state.setContact,
  );

  const update =
    (field: ContactField) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setContact({
        [field]: event.target.value,
      });
    };

  const updatePhone = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setContact({
      phone: event.target.value
        .replace(/\D/g, "")
        .slice(0, 10),
    });
  };

  return (
    <section
      className="checkout-contact"
      aria-labelledby="checkout-contact-title"
    >
      {/* =====================================================
          CARD HEADER
      ===================================================== */}

      <header className="checkout-contact__header">
        <div className="checkout-contact__step">
          <span>01</span>
        </div>

        <div className="checkout-contact__header-content">
          <div className="checkout-contact__eyebrow-row">
            <span
              className="checkout-contact__eyebrow-dot"
              aria-hidden="true"
            />

            <p className="checkout-contact__eyebrow">
              Contact Information
            </p>
          </div>

          <h2
            id="checkout-contact-title"
            className="checkout-contact__title"
          >
            Your details
          </h2>

          <p className="checkout-contact__description">
            Enter your contact details so we can
            confirm your order and keep you updated
            throughout delivery.
          </p>
        </div>
      </header>

      {/* =====================================================
          FORM CONTENT
      ===================================================== */}

      <div className="checkout-contact__content">
        <div className="checkout-contact__fields">
          {/* EMAIL */}

          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={contact.email}
            onChange={update("email")}
            icon={<Mail size={17} strokeWidth={1.5} />}
            autoComplete="email"
          />

          {/* PHONE */}

          <Field
            label="Phone number"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={contact.phone}
            onChange={updatePhone}
            icon={<Phone size={17} strokeWidth={1.5} />}
            autoComplete="tel"
            maxLength={10}
          />
        </div>

        {/* ===================================================
            PRIVACY NOTE
        =================================================== */}

        <div className="checkout-contact__privacy">
          <div
            className="checkout-contact__privacy-icon"
            aria-hidden="true"
          >
            <ShieldCheck
              size={16}
              strokeWidth={1.5}
            />
          </div>

          <div className="checkout-contact__privacy-content">
            <p className="checkout-contact__privacy-title">
              Your information is secure
            </p>

            <p className="checkout-contact__privacy-text">
              Your contact information is used only
              for order confirmation, delivery
              communication and essential updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  inputMode,
  icon,
  autoComplete,
  maxLength,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  inputMode?: "text" | "numeric" | "tel" | "email";
  icon: React.ReactNode;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className="checkout-contact__field">
      <span className="checkout-contact__field-label">
        {label}
      </span>

      <span className="checkout-contact__field-control">
        <span
          className="checkout-contact__field-icon"
          aria-hidden="true"
        >
          {icon}
        </span>

        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
        />

        <span
          className="checkout-contact__field-focus"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}