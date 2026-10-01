"use client";

import {
  couponOffer,
  useAvailableCoupons,
} from "@/components/commerce/use-available-coupons";
import "@/components/commerce/CommerceSales.css";
import { getCheckoutCart } from "@/services/checkout-cart.service";
import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  CirclePercent,
  Tag,
  X,
} from "lucide-react";

import {
  useSearchParams,
} from "next/navigation";

import toast from "react-hot-toast";

import {
} from "@/services/cart.service";

import {
  validateCustomerCoupon,
} from "@/services/coupon.service";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

import "./CheckoutCoupon.css";

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutCoupon() {
  const searchParams = useSearchParams();

  /* =======================================================
     CHECKOUT STORE
  ======================================================= */

  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.couponShippingDiscount,
    );

  const contactEmail = useCheckoutStore(
    (state) => state.contact.email,
  );

  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const setCouponCode = useCheckoutStore(
    (state) => state.setCouponCode,
  );

  const setCouponDiscount = useCheckoutStore(
    (state) => state.setCouponDiscount,
  );

  const setCouponShippingDiscount =
    useCheckoutStore(
      (state) =>
        state.setCouponShippingDiscount,
    );

  const setCouponDiscountType =
    useCheckoutStore(
      (state) =>
        state.setCouponDiscountType,
    );

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [input, setInput] = useState(
    couponCode,
  );

  const [loadingCart, setLoadingCart] =
    useState(true);

  const [cartItemCount, setCartItemCount] =
    useState(0);

  const [cartItems, setCartItems] =
    useState<
      Array<{
        productId: string;
        quantity: number;
      }>
    >([]);

  const [subtotal, setSubtotal] =
    useState(0);

  const [applying, setApplying] =
    useState(false);

  /* =======================================================
     KEEP INPUT IN SYNC
  ======================================================= */

  const [previousCouponCode, setPreviousCouponCode] =
    useState(couponCode);

  if (couponCode !== previousCouponCode) {
    setPreviousCouponCode(couponCode);
    setInput(couponCode);
  }

  /* =======================================================
     READ COUPON FROM URL
  ======================================================= */

  useEffect(() => {
    const queryCoupon =
      searchParams.get("coupon");

    if (!queryCoupon?.trim()) {
      return;
    }

    const normalizedCoupon =
      queryCoupon
        .trim()
        .toUpperCase()
        .slice(0, 40);

    if (!normalizedCoupon) {
      return;
    }

    /*
     * The input follows the stored coupon code (see "KEEP INPUT IN
     * SYNC" above), so only the store needs updating here.
     */
    setCouponCode(
      normalizedCoupon,
    );
  }, [
    searchParams,
    setCouponCode,
  ]);

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoadingCart(true);

      try {
        const cart = await getCheckoutCart();

        if (cancelled) {
          return;
        }

        const items = cart.items.map(
          (item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }),
        );

        let calculatedSubtotal = 0;

        for (const item of cart.items) {
          calculatedSubtotal +=
            Number(
              item.product.pricing
                .sellingPrice,
            ) * item.quantity;
        }

        setCartItems(items);

        setCartItemCount(
          cart.items.reduce(
            (total, item) =>
              total + item.quantity,
            0,
          ),
        );

        setSubtotal(
          calculatedSubtotal,
        );
      } catch (error) {
        console.error(
          "CHECKOUT COUPON CART ERROR:",
          error,
        );

        if (!cancelled) {
          setCartItems([]);
          setCartItemCount(0);
          setSubtotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoadingCart(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     CLEAR COUPON
  ======================================================= */

  const clearCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponShippingDiscount(0);
    setCouponDiscountType(null);
    setInput("");
  };

  /* =======================================================
     APPLY COUPON
  ======================================================= */

  const applyCoupon = async (override?: string) => {
    const code = (override ?? input)
      .trim()
      .toUpperCase();

    if (!code) {
      toast.error(
        "Enter a coupon code.",
      );
      return;
    }

    if (!cartItemCount) {
      toast.error(
        "Your bag is empty.",
      );
      return;
    }

    if (loadingCart) {
      toast.error(
        "Please wait while your bag is loading.",
      );
      return;
    }

    if (!cartItems.length) {
      toast.error(
        "Unable to validate your cart items.",
      );
      return;
    }

    if (subtotal <= 0) {
      toast.error(
        "Your order subtotal must be greater than zero.",
      );
      return;
    }

    setApplying(true);

    try {
      const result =
        await validateCustomerCoupon({
          code,
          subtotal,
          customerEmail:
            contactEmail
              .trim()
              .toLowerCase() ||
            undefined,
          deliveryMethod:
            delivery,
          items: cartItems,
        });

      setCouponCode(
        result.couponCode,
      );

      setCouponDiscount(
        result.discountAmount,
      );

      setCouponShippingDiscount(
        result.shippingDiscount,
      );

      setCouponDiscountType(
        result.discountType,
      );

      setInput(
        result.couponCode,
      );

      toast.success(
        result.message ||
          "Coupon applied.",
      );
    } catch (error) {
      setCouponCode("");
      setCouponDiscount(0);
      setCouponShippingDiscount(0);
      setCouponDiscountType(null);
      setInput("");

      const message =
        error instanceof Error &&
        error.message
          ? error.message
          : "This coupon is not valid.";

      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  /* =======================================================
     APPLIED STATE
  ======================================================= */

  const hasDiscount =
    couponDiscount > 0 ||
    couponShippingDiscount > 0;

  const hasCoupon =
    Boolean(couponCode);

  const availableCoupons =
    useAvailableCoupons();

  const suggestedCoupons =
    availableCoupons
      .filter(
        (coupon) =>
          coupon.minimumOrderValue <=
            subtotal &&
          (coupon.applicableProductIds
            .length === 0 ||
            coupon.applicableProductIds.some(
              (id) =>
                cartItems.some(
                  (item) =>
                    item.productId ===
                    id,
                ),
            )),
      )
      .slice(0, 3);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="checkout-coupon"
      aria-labelledby="checkout-coupon-title"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="checkout-coupon__header">
        <div className="checkout-coupon__step">
          <span>05</span>
        </div>

        <div className="checkout-coupon__heading-content">
          <div className="checkout-coupon__eyebrow-row">
            <span
              className="checkout-coupon__eyebrow-dot"
              aria-hidden="true"
            />

            <p className="checkout-coupon__eyebrow">
              Offers & Savings
            </p>
          </div>

          <h2
            id="checkout-coupon-title"
            className="checkout-coupon__title"
          >
            Have a coupon?
          </h2>

          <p className="checkout-coupon__description">
            Apply an available offer to unlock
            savings on your order.
          </p>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="checkout-coupon__content">
        {/* =================================================
            COUPON INPUT CARD
        ================================================= */}

        <div
          className={[
            "checkout-coupon__input-card",
            hasCoupon
              ? "checkout-coupon__input-card--applied"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="checkout-coupon__input-icon">
            <Tag
              size={18}
              strokeWidth={1.5}
            />
          </div>

          <div className="checkout-coupon__input-content">
            <label
              htmlFor="checkout-coupon-code"
              className="checkout-coupon__label"
            >
              Coupon code
            </label>

            <input
              id="checkout-coupon-code"
              value={input}
              onChange={(event) =>
                setInput(
                  event.target.value
                    .toUpperCase()
                    .slice(0, 40),
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void applyCoupon();
                }
              }}
              disabled={
                applying ||
                loadingCart
              }
              placeholder="ENTER CODE"
              aria-label="Coupon code"
              autoComplete="off"
              className="checkout-coupon__input"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              void applyCoupon()
            }
            disabled={
              applying ||
              loadingCart ||
              !input.trim()
            }
            className="checkout-coupon__apply"
          >
            {applying
              ? "Applying..."
              : "Apply"}
          </button>
        </div>

        {!hasCoupon &&
        suggestedCoupons.length > 0 ? (
          <div className="commerce-chips">
            <p className="commerce-chips__label">
              Offers you can use now
            </p>

            <div className="commerce-chips__row">
              {suggestedCoupons.map(
                (coupon) => (
                  <button
                    key={coupon.code}
                    type="button"
                    disabled={
                      applying ||
                      loadingCart
                    }
                    onClick={() => {
                      setInput(
                        coupon.code,
                      );
                      void applyCoupon(
                        coupon.code,
                      );
                    }}
                  >
                    <strong>
                      {coupon.code}
                    </strong>
                    {couponOffer(
                      coupon,
                    )}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}

        {/* =================================================
            APPLIED COUPON
        ================================================= */}

        {hasCoupon &&
        hasDiscount ? (
          <div
            className="checkout-coupon__applied"
            role="status"
            aria-live="polite"
          >
            <div className="checkout-coupon__applied-left">
              <div className="checkout-coupon__success-icon">
                <Check
                  size={16}
                  strokeWidth={2}
                />
              </div>

              <div className="checkout-coupon__applied-copy">
                <span className="checkout-coupon__applied-label">
                  Coupon applied
                </span>

                <strong>
                  {couponCode}
                </strong>
              </div>
            </div>

            <div className="checkout-coupon__applied-right">
              {couponDiscount > 0 ? (
                <span className="checkout-coupon__benefit">
                  Save ₹
                  {couponDiscount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              ) : null}

              {couponShippingDiscount >
              0 ? (
                <span className="checkout-coupon__benefit">
                  Free shipping
                </span>
              ) : null}

              <button
                type="button"
                onClick={clearCoupon}
                disabled={applying}
                className="checkout-coupon__remove"
                aria-label="Remove coupon"
              >
                <X
                  size={15}
                  strokeWidth={1.6}
                />
              </button>
            </div>
          </div>
        ) : null}

        {/* =================================================
            SUPPORTING INFORMATION
        ================================================= */}

        {!hasCoupon ? (
          <div className="checkout-coupon__note">
            <div
              className="checkout-coupon__note-icon"
              aria-hidden="true"
            >
              <CirclePercent
                size={15}
                strokeWidth={1.5}
              />
            </div>

            <p>
              Coupon eligibility is checked
              against your current bag,
              delivery method and account
              details.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}