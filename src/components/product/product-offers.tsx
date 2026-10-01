"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import toast from "react-hot-toast";

import {
  getAvailableCustomerCoupons,
  type AvailableCustomerCoupon,
} from "@/services/coupon.service";

import "./ProductOffers.css";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function describe(coupon: AvailableCustomerCoupon): string {
  const base =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% off`
      : coupon.discountType === "fixed"
        ? `${money(coupon.discountValue)} off`
        : "Free shipping";

  return coupon.minimumOrderValue > 0
    ? `${base} on orders above ${money(coupon.minimumOrderValue)}`
    : base;
}

export function ProductOffers({ productId }: { productId: string }) {
  const [coupons, setCoupons] = useState<AvailableCustomerCoupon[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAvailableCustomerCoupons()
      .then((items) => {
        if (cancelled) return;

        setCoupons(
          items
            .filter(
              (coupon) =>
                coupon.applicableProductIds.length === 0 ||
                coupon.applicableProductIds.includes(productId),
            )
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (!cancelled) setCoupons([]);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (coupons.length === 0) {
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
    <section className="product-offers" aria-label="Offers">
      <p className="product-offers__title">
        <Tag size={14} strokeWidth={1.6} /> Offers for you
      </p>

      <ul className="product-offers__list">
        {coupons.map((coupon) => (
          <li key={coupon.code} className="product-offers__item">
            <div>
              <p className="product-offers__text">{describe(coupon)}</p>
              {coupon.description ? (
                <p className="product-offers__sub">{coupon.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => void copy(coupon.code)}
              className="product-offers__code"
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
        ))}
      </ul>
    </section>
  );
}
