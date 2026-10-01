"use client";

import { Truck } from "lucide-react";

import { FREE_SHIPPING_THRESHOLD } from "@/components/product/product-sales";

import "./CommerceSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * Free-shipping progress. Uses the same rule as checkout:
 * standard delivery is free from ₹2,999.
 */
export function FreeShippingMeter({
  subtotal,
  savings = 0,
}: {
  subtotal: number;
  /** Total saved versus MRP (shown as encouragement). */
  savings?: number;
}) {
  if (subtotal <= 0) {
    return null;
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const unlocked = remaining <= 0;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={
        unlocked
          ? "commerce-meter commerce-meter--unlocked"
          : "commerce-meter"
      }
    >
      <Truck size={16} strokeWidth={1.5} aria-hidden="true" />

      <div className="commerce-meter__body">
        <p>
          {unlocked ? (
            <>
              <strong>You have unlocked free shipping.</strong>
              {savings > 0 ? ` You are saving ${money(savings)} on this order.` : ""}
            </>
          ) : (
            <>
              Add <strong>{money(remaining)}</strong> more to get{" "}
              <strong>free shipping</strong>
            </>
          )}
        </p>

        <span
          className="commerce-meter__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Progress towards free shipping"
        >
          <span style={{ width: `${progress}%` }} />
        </span>
      </div>
    </div>
  );
}
