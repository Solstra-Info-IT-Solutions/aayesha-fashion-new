"use client";

import {
  Check,
  Clock3,
  Truck,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutDelivery.css";

/* =========================================================
   DELIVERY OPTIONS
========================================================= */

const options = [
  {
    id: "standard" as const,
    label: "Standard Delivery",
    description:
      "Reliable delivery across India",
    price: 0,
    estimatedDays: "3–7 business days",
  },
  {
    id: "express" as const,
    label: "Express Delivery",
    description:
      "Priority handling and faster delivery",
    price: 199,
    estimatedDays: "1–3 business days",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutDelivery() {
  const selected = useCheckoutStore(
    (state) => state.delivery,
  );

  const setDelivery = useCheckoutStore(
    (state) => state.setDelivery,
  );

  return (
    <section
      className="checkout-delivery"
      aria-labelledby="checkout-delivery-title"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="checkout-delivery__header">
        <div className="checkout-delivery__step">
          <span>03</span>
        </div>

        <div className="checkout-delivery__heading-content">
          <div className="checkout-delivery__eyebrow-row">
            <span
              className="checkout-delivery__eyebrow-dot"
              aria-hidden="true"
            />

            <p className="checkout-delivery__eyebrow">
              Delivery
            </p>
          </div>

          <h2
            id="checkout-delivery-title"
            className="checkout-delivery__title"
          >
            Choose delivery
          </h2>

          <p className="checkout-delivery__description">
            Select the delivery option that works
            best for you.
          </p>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="checkout-delivery__content">
        <div
          className="checkout-delivery__options"
          role="group"
          aria-label="Delivery options"
        >
          {options.map((option) => {
            const active =
              selected === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setDelivery(option.id)
                }
                aria-pressed={active}
                className={[
                  "checkout-delivery__option",
                  active
                    ? "checkout-delivery__option--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* =================================================
                    OPTION MAIN
                ================================================= */}

                <span className="checkout-delivery__option-main">
                  <span
                    className={[
                      "checkout-delivery__icon",
                      active
                        ? "checkout-delivery__icon--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  >
                    <Truck
                      size={18}
                      strokeWidth={1.45}
                    />
                  </span>

                  <span className="checkout-delivery__option-copy">
                    <span className="checkout-delivery__option-title-row">
                      <span className="checkout-delivery__option-title">
                        {option.label}
                      </span>

                      {option.id ===
                      "express" ? (
                        <span className="checkout-delivery__priority">
                          Priority
                        </span>
                      ) : null}
                    </span>

                    <span className="checkout-delivery__option-description">
                      {option.description}
                    </span>

                    <span className="checkout-delivery__estimate">
                      <Clock3
                        size={12}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />

                      <span>
                        {option.estimatedDays}
                      </span>
                    </span>
                  </span>
                </span>

                {/* =================================================
                    OPTION SIDE
                ================================================= */}

                <span className="checkout-delivery__option-side">
                  <span className="checkout-delivery__price">
                    {option.price === 0
                      ? "Free"
                      : `₹${option.price}`}
                  </span>

                  <span
                    className={[
                      "checkout-delivery__indicator",
                      active
                        ? "checkout-delivery__indicator--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  >
                    {active ? (
                      <Check
                        size={13}
                        strokeWidth={2}
                      />
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* =================================================
            DELIVERY NOTE
        ================================================= */}

        <div className="checkout-delivery__note">
          <span
            className="checkout-delivery__note-icon"
            aria-hidden="true"
          >
            <Truck
              size={14}
              strokeWidth={1.4}
            />
          </span>

          <p>
            Delivery timelines are estimated
            business days and may vary slightly
            depending on your location.
          </p>
        </div>
      </div>
    </section>
  );
}