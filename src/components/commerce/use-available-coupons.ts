"use client";

import { useEffect, useState } from "react";

import {
  getAvailableCustomerCoupons,
  type AvailableCustomerCoupon,
} from "@/services/coupon.service";

/** Active public coupons (empty list if none or on error). */
export function useAvailableCoupons(): AvailableCustomerCoupon[] {
  const [coupons, setCoupons] = useState<AvailableCustomerCoupon[]>([]);

  useEffect(() => {
    let cancelled = false;

    getAvailableCustomerCoupons()
      .then((items) => {
        if (!cancelled) setCoupons(items);
      })
      .catch(() => {
        if (!cancelled) setCoupons([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return coupons;
}

export const couponOffer = (coupon: AvailableCustomerCoupon) =>
  coupon.discountType === "percentage"
    ? `${coupon.discountValue}% off`
    : coupon.discountType === "fixed"
      ? `₹${coupon.discountValue.toLocaleString("en-IN")} off`
      : "Free shipping";
