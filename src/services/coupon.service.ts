import { apiFetch } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

export type CustomerCouponDiscountType =
  | "percentage"
  | "fixed"
  | "free_shipping";

export interface CustomerCouponItem {
  productId: string;
  quantity: number;
}

export interface ValidateCustomerCouponInput {
  code: string;
  subtotal: number;
  customerEmail?: string;
  deliveryMethod:
    | "standard"
    | "express";
  items: CustomerCouponItem[];
}

export interface ValidateCustomerCouponResponse {
  couponCode: string;

  description: string;

  discountType:
    | "percentage"
    | "fixed"
    | "free_shipping";

  discountValue: number;

  maxDiscountAmount:
    | number
    | null;

  discountAmount: number;

  shippingDiscount: number;

  deliveryMethod:
    | "standard"
    | "express";

  message: string;
}

export interface AvailableCustomerCoupon {
  code: string;

  description: string;

  discountType:
    | "percentage"
    | "fixed"
    | "free_shipping";

  discountValue: number;

  maxDiscountAmount:
    | number
    | null;

  minimumOrderValue: number;

  startsAt: string;

  endsAt: string | null;

  firstOrderOnly: boolean;

  applicableProductIds: string[];
}

/* =========================================================
   GET AVAILABLE CUSTOMER COUPONS
========================================================= */

export const getAvailableCustomerCoupons =
  async (): Promise<
    AvailableCustomerCoupon[]
  > => {
    /*
     * apiFetch already unwraps the { success, data } envelope
     * and throws on failure, so the result is the coupon list.
     */
    return apiFetch<AvailableCustomerCoupon[]>(
      "/coupons/available",
      {
        method: "GET",
      },
    );
  };

/* =========================================================
   VALIDATE CUSTOMER COUPON
========================================================= */

export const validateCustomerCoupon =
  async (
    input: ValidateCustomerCouponInput,
  ): Promise<ValidateCustomerCouponResponse> => {
    return apiFetch<ValidateCustomerCouponResponse>(
        "/coupons/validate",
        {
          method: "POST",

          body: JSON.stringify({
            code:
              input.code
                .trim()
                .toUpperCase(),

            subtotal:
              input.subtotal,

            ...(input.customerEmail
              ? {
                  customerEmail:
                    input.customerEmail
                      .trim()
                      .toLowerCase(),
                }
              : {}),

            deliveryMethod:
              input.deliveryMethod,

            items:
              input.items,
          }),
        },
      );

  };