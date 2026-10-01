"use client";

import { Gift, Truck } from "lucide-react";

import {
  couponOffer,
  useAvailableCoupons,
} from "@/components/commerce/use-available-coupons";
import { FREE_SHIPPING_THRESHOLD } from "@/components/product/product-sales";

import "./ListingSales.css";

/** One-line value reminder above a product listing. */
export function ListingSalesBar() {
  const coupons = useAvailableCoupons();
  const coupon = coupons[0];

  return (
    <div className="listing-bar" role="note">
      <p>
        <Truck size={15} strokeWidth={1.5} aria-hidden="true" />
        Free shipping on orders above ₹
        {FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}
      </p>

      {coupon ? (
        <p>
          <Gift size={15} strokeWidth={1.5} aria-hidden="true" />
          {couponOffer(coupon)}
          {coupon.minimumOrderValue > 0
            ? ` on orders above ₹${coupon.minimumOrderValue.toLocaleString("en-IN")}`
            : ""}{" "}
          with code <strong>{coupon.code}</strong>
        </p>
      ) : null}
    </div>
  );
}
