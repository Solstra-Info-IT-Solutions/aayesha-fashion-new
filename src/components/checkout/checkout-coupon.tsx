"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getCart,
} from "@/services/cart.service";

import {
  validateCustomerCoupon,
} from "@/services/coupon.service";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutCoupon() {
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

  /* =========================================================
     KEEP INPUT IN SYNC WITH STORE
  ========================================================= */

  useEffect(() => {
    setInput(couponCode);
  }, [couponCode]);

  /* =========================================================
     LOAD CART FROM BACKEND
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoadingCart(true);

      try {
        const cart = await getCart();

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
              item.product.pricing.sellingPrice,
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

  /* =========================================================
     CLEAR COUPON
  ========================================================= */

  const clearCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponShippingDiscount(0);
    setCouponDiscountType(null);
    setInput("");
  };

  /* =========================================================
     APPLY COUPON
  ========================================================= */

  const applyCoupon = async () => {
    const code = input
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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="checkout-coupon">
      {/* HEADER */}

      <header className="checkout-coupon__header">
        <div className="checkout-coupon__heading">
          <div className="checkout-coupon__step">
            04
          </div>

          <div className="checkout-coupon__heading-content">
            <p className="checkout-coupon__eyebrow">
              Offers
            </p>

            <h2 className="checkout-coupon__title">
              Have a coupon?
            </h2>

            <p className="checkout-coupon__description">
              Apply an available offer to your
              order.
            </p>
          </div>
        </div>

        {couponCode ? (
          <button
            type="button"
            onClick={clearCoupon}
            disabled={applying}
            className="checkout-coupon__remove"
          >
            Remove
          </button>
        ) : null}
      </header>

      {/* COUPON FORM */}

      <div className="checkout-coupon__content">
        <div className="checkout-coupon__form">
          <div className="checkout-coupon__input-wrap">
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
              placeholder="Enter code"
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
              loadingCart
            }
            className="checkout-coupon__apply"
          >
            <span>
              {applying
                ? "Applying..."
                : "Apply"}
            </span>
          </button>
        </div>

        {/* APPLIED COUPON */}

        {couponCode ? (
          <div
            className="checkout-coupon__applied"
            role="status"
            aria-live="polite"
          >
            <div className="checkout-coupon__applied-main">
              <span className="checkout-coupon__success-icon">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 10.5L8.2 13.5L15 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <div className="checkout-coupon__applied-copy">
                <span className="checkout-coupon__applied-label">
                  Coupon applied
                </span>

                <strong>
                  {couponCode}
                </strong>
              </div>
            </div>

            <div className="checkout-coupon__benefits">
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
            </div>
          </div>
        ) : null}

        {/* SUPPORTING NOTE */}

        {!couponCode ? (
          <p className="checkout-coupon__note">
            Coupon eligibility is checked against
            your current bag, delivery method and
            account details.
          </p>
        ) : null}
      </div>
    </section>
  );
}