"use client";

import { siteConfig } from "@/config/site";
import { useEffect, useRef, type ReactNode } from "react";

import {
  Banknote,
  Check,
  CreditCard,
  ShieldCheck,
  Smartphone,
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


  const paymentWhatsapp = useCheckoutStore(
    (state) => state.paymentWhatsapp,
  );

  const contactPhone = useCheckoutStore(
    (state) => state.contact.phone,
  );

  const setPaymentWhatsapp = useCheckoutStore(
    (state) => state.setPaymentWhatsapp,
  );

  const prefilled = useRef(false);

  // A remembered choice is not valid while that method is switched off.
  useEffect(() => {
    if (
      (!siteConfig.features.onlinePayment && selected === "online") ||
      (!siteConfig.features.cashOnDelivery && selected === "cod")
    ) {
      setPayment("bank_upi");
    }

    // The bill goes to the contact number unless the customer changes it
    // (prefilled once, so clearing the field to retype is not overridden).
    if (
      selected === "bank_upi" &&
      !paymentWhatsapp &&
      contactPhone &&
      !prefilled.current
    ) {
      prefilled.current = true;
      setPaymentWhatsapp(contactPhone);
    }
  }, [
    selected,
    setPayment,
    paymentWhatsapp,
    contactPhone,
    setPaymentWhatsapp,
  ]);

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
          {siteConfig.features.cashOnDelivery ? (
          <PaymentOption
            id="cod"
            label="Cash on Delivery"
            description="Pay when your order arrives"
            meta="Available on delivery"
            icon={<Banknote />}
            active={selected === "cod"}
            onClick={() => setPayment("cod")}
          />
          ) : null}

          {siteConfig.features.onlinePayment ? (
          <PaymentOption
            id="online"
            label="Online Payment"
            description="Pay securely with Razorpay: cards, UPI, netbanking and wallets"
            meta="Secure online checkout"
            icon={<CreditCard />}
            active={selected === "online"}
            onClick={() => setPayment("online")}
          />
          ) : null}

          <PaymentOption
            id="bank_upi"
            label="Pay via WhatsApp (UPI / Bank Transfer)"
            description="We send your bill with a UPI QR code on WhatsApp. Pay within 30 minutes or the order is cancelled automatically."
            meta="Bill sent on WhatsApp"
            icon={<Smartphone />}
            active={selected === "bank_upi"}
            onClick={() => {
              setPayment("bank_upi");

              // The bill goes to the contact number unless changed.
              if (!paymentWhatsapp && contactPhone) {
                setPaymentWhatsapp(contactPhone);
              }
            }}
          />
        </div>

        {selected === "bank_upi" ? (
          <div className="checkout-payment__whatsapp">
            <label
              htmlFor="payment-whatsapp"
              className="checkout-payment__whatsapp-label"
            >
              WhatsApp number for the bill
            </label>

            <input
              id="payment-whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={paymentWhatsapp}
              onChange={(event) =>
                setPaymentWhatsapp(event.target.value)
              }
              placeholder="e.g. 9876543210"
              className="checkout-payment__whatsapp-input"
            />

            <p className="checkout-payment__whatsapp-note">
              We will send your bill with the UPI QR
              code to this WhatsApp number. Pay within
              30 minutes: your order is confirmed once
              the payment is received, otherwise it is
              cancelled automatically.
            </p>
          </div>
        ) : null}


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
              Online payments are processed by
              Razorpay. Card and bank details never
              reach our servers.
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