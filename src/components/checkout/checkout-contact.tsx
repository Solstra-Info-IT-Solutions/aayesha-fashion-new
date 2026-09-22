"use client";

import type { ChangeEvent } from "react";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutContact.css";

export function CheckoutContact() {
  const contact = useCheckoutStore(
    (state) => state.contact,
  );

  const setContact = useCheckoutStore(
    (state) => state.setContact,
  );

  const update =
    (field: "email" | "phone") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setContact({
        [field]: event.target.value,
      });
    };

  return (
    <section className="checkout-contact">
      <header className="checkout-contact__header">
        <div className="checkout-contact__step">
          01
        </div>

        <div className="checkout-contact__header-content">
          <p className="checkout-contact__eyebrow">
            Contact
          </p>

          <h2 className="checkout-contact__title">
            Your details
          </h2>

          <p className="checkout-contact__description">
            We&apos;ll use these details to confirm your order
            and keep you updated on its delivery.
          </p>
        </div>
      </header>

      <div className="checkout-contact__content">
        <div className="checkout-contact__fields">
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={contact.email}
            onChange={update("email")}
          />

          <Field
            label="Phone number"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={contact.phone}
            onChange={(event) =>
              setContact({
                phone: event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10),
              })
            }
          />
        </div>

        <div className="checkout-contact__privacy">
          <span className="checkout-contact__privacy-line" />

          <p>
            Your contact information is kept secure and is
            used only for order confirmation and delivery
            communication.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <label className="checkout-contact__field">
      <span className="checkout-contact__field-label">
        {label}
      </span>

      <span className="checkout-contact__field-control">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />

        <span className="checkout-contact__field-focus" />
      </span>
    </label>
  );
}