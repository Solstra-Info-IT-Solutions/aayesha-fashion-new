"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

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

  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="quantity-selector__button"
      >
        <Minus
          size={17}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <span
        aria-live="polite"
        className="quantity-selector__value"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="quantity-selector__button"
      >
        <Plus
          size={17}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}