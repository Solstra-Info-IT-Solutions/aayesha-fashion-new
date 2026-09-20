"use client";

import { useState } from "react";
import { Check, MapPin } from "lucide-react";

export function ProductDeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setChecked(false);
      return;
    }

    setChecked(true);
  };

  return (
    <section
      aria-labelledby="delivery-check-title"
      className="product-delivery-checker"
    >
      {/* Header */}
      <div className="product-delivery-checker__header">
        <span
          className="product-delivery-checker__icon"
          aria-hidden="true"
        >
          <MapPin
            className="product-delivery-checker__icon-svg"
            strokeWidth={1.4}
          />
        </span>

        <div className="product-delivery-checker__intro">
          <p
            id="delivery-check-title"
            className="product-delivery-checker__title"
          >
            Check Delivery
          </p>

          <p className="product-delivery-checker__description">
            Enter your pincode to check delivery availability.
          </p>
        </div>
      </div>

      {/* Pincode Input */}
      <div className="product-delivery-checker__form">
        <label
          htmlFor="delivery-pincode"
          className="sr-only"
        >
          Enter delivery pincode
        </label>

        <input
          id="delivery-pincode"
          value={pincode}
          onChange={(event) => {
            setPincode(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6),
            );
            setChecked(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              checkDelivery();
            }
          }}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter pincode"
          aria-describedby="delivery-pincode-hint"
          className="product-delivery-checker__input"
        />

        <button
          type="button"
          onClick={checkDelivery}
          className="product-delivery-checker__button"
        >
          Check
        </button>
      </div>

      <p
        id="delivery-pincode-hint"
        className="product-delivery-checker__hint"
      >
        Enter a 6-digit Indian pincode
      </p>

      {/* Delivery Result */}
      {checked && (
        <div
          className="product-delivery-checker__result"
          role="status"
          aria-live="polite"
        >
          <span
            className="product-delivery-checker__result-icon"
            aria-hidden="true"
          >
            <Check
              className="product-delivery-checker__result-icon-svg"
              strokeWidth={1.5}
            />
          </span>

          <div className="product-delivery-checker__result-content">
            <p className="product-delivery-checker__result-title">
              Delivery available
            </p>

            <p className="product-delivery-checker__result-description">
              Estimated delivery within 3–7 business days.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}