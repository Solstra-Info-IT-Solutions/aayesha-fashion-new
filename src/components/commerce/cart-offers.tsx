"use client";

import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import toast from "react-hot-toast";

import { couponOffer, useAvailableCoupons } from "./use-available-coupons";

import "./CommerceSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * Offers box for the bag: shows live coupons, whether the bag
 * qualifies, and how much more to add to unlock the rest.
 */
export function CartOffers({
  subtotal,
  productIds,
}: {
  subtotal: number;
  productIds: string[];
}) {
  const coupons = useAvailableCoupons();
  const [copied, setCopied] = useState("");

  const usable = coupons
    .filter(
      (coupon) =>
        coupon.applicableProductIds.length === 0 ||
        coupon.applicableProductIds.some((id) => productIds.includes(id)),
    )
    .slice(0, 3);

  if (usable.length === 0) {
    return null;
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast.success(`Code ${code} copied. Apply it at checkout.`);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      toast.error("Unable to copy the code.");
    }
  }

  return (
    <section className="commerce-offers" aria-label="Offers">
      <p className="commerce-offers__title">
        <Tag size={14} strokeWidth={1.6} /> Offers for your bag
      </p>

      <ul>
        {usable.map((coupon) => {
          const gap = coupon.minimumOrderValue - subtotal;
          const locked = gap > 0;

          return (
            <li key={coupon.code}>
              <div>
                <p className="commerce-offers__text">{couponOffer(coupon)}</p>

                <p className="commerce-offers__sub">
                  {locked
                    ? `Add ${money(gap)} more to unlock`
                    : coupon.description || "Apply at checkout"}
                </p>
              </div>

              <button
                type="button"
                disabled={locked}
                onClick={() => void copy(coupon.code)}
                aria-label={`Copy coupon code ${coupon.code}`}
              >
                {coupon.code}
                {copied === coupon.code ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
