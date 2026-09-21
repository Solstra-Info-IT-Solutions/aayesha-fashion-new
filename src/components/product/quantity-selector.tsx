"use client";

import { Minus, Plus } from "lucide-react";

import "./QuantitySelector.css";

/* =========================================================
   TYPES
========================================================= */

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

/* =========================================================
   COMPONENT
========================================================= */

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const decreaseDisabled = quantity <= min;
  const increaseDisabled = quantity >= max;

  return (
    <div
      className="quantity-selector"
      aria-label="Product quantity"
    >
      {/* ===================================================
          DECREASE
      =================================================== */}

      <button
        type="button"
        onClick={decrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
        className="quantity-selector__button"
      >
        <Minus
          size={14}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </button>

      {/* ===================================================
          VALUE
      =================================================== */}

      <span
        aria-live="polite"
        aria-atomic="true"
        className="quantity-selector__value"
      >
        {quantity}
      </span>

      {/* ===================================================
          INCREASE
      =================================================== */}

      <button
        type="button"
        onClick={increase}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className="quantity-selector__button"
      >
        <Plus
          size={14}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}