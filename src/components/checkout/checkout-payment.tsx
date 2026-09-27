"use client";

import type { ReactNode } from "react";

import {
  Banknote,
  Check,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutPayment.css";

export function CheckoutPayment() {
  const selected = useCheckoutStore(
    (state) => state.payment,
  );

  const setPayment = useCheckoutStore(
    (state) => state.setPayment,
  );

  return (
    <section className="checkout-payment">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="checkout-payment__header">
        <div className="checkout-payment__step">
          04
        </div>

        <div className="checkout-payment__heading-content">
          <div className="checkout-payment__eyebrow-row">
            <span className="checkout-payment__eyebrow-line" />

            <p className="checkout-payment__eyebrow">
              Payment
            </p>
          </div>

          <h2 className="checkout-payment__title">
            Choose payment method
          </h2>

          <p className="checkout-payment__description">
            Select your preferred way to complete
            the purchase.
          </p>
        </div>
      </header>

      {/* =================================================
          PAYMENT OPTIONS
      ================================================= */}

      <div className="checkout-payment__content">
        <div
          className="checkout-payment__options"
          role="group"
          aria-label="Payment methods"
        >
          <PaymentOption
            id="cod"
            label="Cash on Delivery"
            description="Pay when your order arrives"
            meta="Available on delivery"
            icon={<Banknote />}
            active={selected === "cod"}
            onClick={() => setPayment("cod")}
          />

          <PaymentOption
            id="online"
            label="Online Payment"
            description="Cards, UPI and supported payment methods"
            meta="Secure online checkout"
            icon={<CreditCard />}
            active={selected === "online"}
            onClick={() => setPayment("online")}
          />
        </div>

        {/* =================================================
            SECURITY NOTE
        ================================================= */}

        <div className="checkout-payment__security">
          <div
            className="checkout-payment__security-icon"
            aria-hidden="true"
          >
            <ShieldCheck
              size={16}
              strokeWidth={1.35}
            />
          </div>

          <div className="checkout-payment__security-content">
            <p className="checkout-payment__security-title">
              Secure checkout
            </p>

            <p className="checkout-payment__security-description">
              Your selected payment method will be
              securely processed when the order is
              placed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
  id,
  label,
  description,
  meta,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  description: string;
  meta: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Select ${label}`}
      data-payment-method={id}
      className={[
        "checkout-payment__option",
        active
          ? "checkout-payment__option--active"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ICON */}

      <span
        className={[
          "checkout-payment__icon",
          active
            ? "checkout-payment__icon--active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* CONTENT */}

      <span className="checkout-payment__option-copy">
        <span className="checkout-payment__option-title">
          {label}
        </span>

        <span className="checkout-payment__option-description">
          {description}
        </span>

        <span className="checkout-payment__option-meta">
          {meta}
        </span>
      </span>

      {/* CHECK */}

      <span
        className={[
          "checkout-payment__indicator",
          active
            ? "checkout-payment__indicator--active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {active && (
          <Check
            size={13}
            strokeWidth={1.8}
          />
        )}
      </span>
    </button>
  );
}