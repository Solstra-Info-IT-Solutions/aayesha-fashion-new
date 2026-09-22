"use client";

import { Check, Truck } from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutDelivery.css";

const options = [
  {
    id: "standard" as const,
    label: "Standard Delivery",
    description: "Reliable delivery across India",
    price: 0,
    estimatedDays: "3–7 business days",
  },
  {
    id: "express" as const,
    label: "Express Delivery",
    description: "Priority handling and faster delivery",
    price: 199,
    estimatedDays: "1–3 business days",
  },
];

export function CheckoutDelivery() {
  const selected = useCheckoutStore(
    (state) => state.delivery,
  );

  const setDelivery = useCheckoutStore(
    (state) => state.setDelivery,
  );

  return (
    <section className="checkout-delivery">
      {/* HEADER */}

      <header className="checkout-delivery__header">
        <div className="checkout-delivery__heading">
          <div className="checkout-delivery__step">
            03
          </div>

          <div className="checkout-delivery__heading-content">
            <p className="checkout-delivery__eyebrow">
              Delivery
            </p>

            <h2 className="checkout-delivery__title">
              Choose delivery
            </h2>

            <p className="checkout-delivery__description">
              Select the delivery option that works
              best for you.
            </p>
          </div>
        </div>
      </header>

      {/* OPTIONS */}

      <div className="checkout-delivery__content">
        <div className="checkout-delivery__options">
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
                {/* LEFT */}

                <div className="checkout-delivery__option-main">
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
                    <Truck />
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
                      {option.estimatedDays}
                    </span>
                  </span>
                </div>

                {/* RIGHT */}

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
                    <Check />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* DELIVERY NOTE */}

        <div className="checkout-delivery__note">
          <span className="checkout-delivery__note-line" />

          <p>
            Delivery timelines are estimated business
            days and may vary slightly depending on
            your location.
          </p>
        </div>
      </div>
    </section>
  );
}