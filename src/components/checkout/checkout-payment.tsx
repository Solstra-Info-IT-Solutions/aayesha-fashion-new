"use client";

import type { ReactNode } from "react";

import {
  Banknote,
  Check,
  CreditCard,
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
      {/* HEADER */}

      <header className="checkout-payment__header">
        <div className="checkout-payment__heading">
          <div className="checkout-payment__step">
            04
          </div>

          <div className="checkout-payment__heading-content">
            <p className="checkout-payment__eyebrow">
              Payment
            </p>

            <h2 className="checkout-payment__title">
              Choose payment method
            </h2>

            <p className="checkout-payment__description">
              Select your preferred way to complete
              the purchase.
            </p>
          </div>
        </div>
      </header>

      {/* OPTIONS */}

      <div className="checkout-payment__content">
        <div className="checkout-payment__options">
          <PaymentOption
            id="cod"
            label="Cash on Delivery"
            description="Pay when your order arrives"
            icon={<Banknote />}
            active={selected === "cod"}
            onClick={() =>
              setPayment("cod")
            }
          />

          <PaymentOption
            id="online"
            label="Online Payment"
            description="Cards, UPI and supported payment methods"
            icon={<CreditCard />}
            active={selected === "online"}
            onClick={() =>
              setPayment("online")
            }
          />
        </div>

        {/* SECURITY NOTE */}

        <div className="checkout-payment__security">
          <span className="checkout-payment__security-line" />

          <div className="checkout-payment__security-content">
            <div className="checkout-payment__security-title">
              Secure checkout
            </div>

            <p>
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

function PaymentOption({
  id,
  label,
  description,
  icon,
  active,
  onClick,
}: {
  id: string;
  label: string;
  description: string;
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
      {/* LEFT */}

      <span className="checkout-payment__option-main">
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

        <span className="checkout-payment__option-copy">
          <span className="checkout-payment__option-title">
            {label}
          </span>

          <span className="checkout-payment__option-description">
            {description}
          </span>
        </span>
      </span>

      {/* SELECT INDICATOR */}

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
        <Check />
      </span>
    </button>
  );
}