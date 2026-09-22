"use client";

import type { ReactNode } from "react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import { getCart } from "@/services/cart.service";

import {
  createOrder,
  type CreateOrderPayload,
} from "@/lib/api/orders";

import {
  createCustomerAddress,
  getCustomerAddresses,
} from "@/lib/customer-api";

import { useAuthStore } from "@/store/auth-store";

import {
  useCheckoutStore,
} from "@/store/checkout-store";

import "./CheckoutPlaceOrder.css";

/* ==========================================================
   TYPES
========================================================== */

type CheckoutCartItem = {
  productId: string;
  quantity: number;
};

/* ==========================================================
   ORDER ACCESS TOKEN STORAGE
========================================================== */

const getOrderAccessTokenKey = (
  orderNumber: string,
) =>
  `aayesha-order-access-token:${orderNumber}`;

/* ==========================================================
   COMPONENT
========================================================== */

export function CheckoutPlaceOrder() {
  const router = useRouter();

  /* ========================================================
     AUTH
  ======================================================== */

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  /* ========================================================
     CHECKOUT
  ======================================================== */

  const contact = useCheckoutStore(
    (state) => state.contact,
  );

  const address = useCheckoutStore(
    (state) => state.address,
  );

  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const payment = useCheckoutStore(
    (state) => state.payment,
  );

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

  /* ========================================================
     LOCAL STATE
  ======================================================== */

  const [items, setItems] = useState<
    CheckoutCartItem[]
  >([]);

  const [subtotal, setSubtotal] =
    useState(0);

  const [loadingCart, setLoadingCart] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  /*
   * Keep the same idempotency key during one
   * order attempt / retry sequence.
   */
  const idempotencyKeyRef =
    useRef<string | null>(null);

  /* ==========================================================
     LOAD CART FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoadingCart(true);

      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        const nextItems =
          cart.items.map(
            (item) => ({
              productId:
                item.productId,
              quantity:
                item.quantity,
            }),
          );

        let calculatedSubtotal = 0;

        for (const item of cart.items) {
          calculatedSubtotal +=
            Number(
              item.product.pricing
                .sellingPrice,
            ) *
            item.quantity;
        }

        setItems(nextItems);
        setSubtotal(
          calculatedSubtotal,
        );
      } catch (error) {
        console.error(
          "CHECKOUT CART ERROR:",
          error,
        );

        if (!cancelled) {
          setItems([]);
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

  /* ==========================================================
     CLIENT-SIDE DISPLAY TOTAL
  ========================================================== */

  const baseShipping =
    delivery === "express"
      ? 199
      : subtotal >= 2999
        ? 0
        : 99;

  const shipping = Math.max(
    0,
    baseShipping -
      couponShippingDiscount,
  );

  const total = Math.max(
    0,
    subtotal +
      shipping -
      couponDiscount,
  );

  /* ==========================================================
     HELPERS
  ========================================================== */

  const getCustomerName = () => {
    return [
      address.firstName.trim(),
      address.lastName.trim(),
    ]
      .filter(Boolean)
      .join(" ");
  };

  const createIdempotencyKey = () => {
    if (
      !idempotencyKeyRef.current
    ) {
      idempotencyKeyRef.current =
        crypto.randomUUID();
    }

    return idempotencyKeyRef.current;
  };

  /* ==========================================================
     SAVE ADDRESS FOR FUTURE ORDERS
  ========================================================== */

  const saveAddressForFutureOrders =
    async () => {
      if (
        !isAuthenticated ||
        !accessToken ||
        !address.isDefault
      ) {
        return;
      }

      const customerName =
        getCustomerName();

      if (!customerName) {
        return;
      }

      const existingAddresses =
        await getCustomerAddresses(
          accessToken,
        );

      const alreadySaved =
        existingAddresses.some(
          (savedAddress) =>
            savedAddress.name
              .trim()
              .toLowerCase() ===
              customerName
                .trim()
                .toLowerCase() &&
            savedAddress.addressLine
              .trim()
              .toLowerCase() ===
              address.addressLine1
                .trim()
                .toLowerCase() &&
            savedAddress.city
              .trim()
              .toLowerCase() ===
              address.city
                .trim()
                .toLowerCase() &&
            savedAddress.state
              .trim()
              .toLowerCase() ===
              address.state
                .trim()
                .toLowerCase() &&
            savedAddress.pincode
              .trim() ===
              address.postalCode
                .trim(),
        );

      if (alreadySaved) {
        return;
      }

      await createCustomerAddress(
        accessToken,
        {
          name: customerName,

          phone:
            contact.phone.trim(),

          addressLine:
            address.addressLine1.trim(),

          city:
            address.city.trim(),

          state:
            address.state.trim(),

          pincode:
            address.postalCode.trim(),

          landmark:
            address.landmark?.trim() ||
            "",

          isDefault: true,
        },
      );
    };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateCheckout = () => {
    if (!isAuthenticated) {
      toast.error(
        "Please login before placing your order.",
      );

      return false;
    }

    if (!accessToken) {
      toast.error(
        "Your login session has expired. Please login again.",
      );

      return false;
    }

    if (!contact.email.trim()) {
      toast.error(
        "Please enter your email address.",
      );

      return false;
    }

    if (
      !/^\d{10}$/.test(
        contact.phone.trim(),
      )
    ) {
      toast.error(
        "Please enter a valid 10-digit phone number.",
      );

      return false;
    }

    if (
      !address.firstName.trim() ||
      !address.lastName.trim()
    ) {
      toast.error(
        "Please enter your full name.",
      );

      return false;
    }

    if (
      !address.addressLine1.trim()
    ) {
      toast.error(
        "Please enter your delivery address.",
      );

      return false;
    }

    if (
      !address.city.trim() ||
      !address.state.trim()
    ) {
      toast.error(
        "Please enter your city and state.",
      );

      return false;
    }

    if (
      !/^\d{6}$/.test(
        address.postalCode.trim(),
      )
    ) {
      toast.error(
        "Please enter a valid 6-digit PIN code.",
      );

      return false;
    }

    if (!items.length) {
      toast.error(
        "Your bag is empty.",
      );

      return false;
    }

    const hasInvalidProductId =
      items.some(
        (item) =>
          !item.productId ||
          !/^[a-fA-F0-9]{24}$/.test(
            item.productId,
          ),
      );

    if (hasInvalidProductId) {
      toast.error(
        "One or more products in your cart are invalid. Please refresh your cart.",
      );

      return false;
    }

    /*
     * Current backend supports COD only.
     */
    if (payment !== "cod") {
      toast.error(
        "Online payment is not available yet. Please select Cash on Delivery.",
      );

      return false;
    }

    return true;
  };

  /* ==========================================================
     PLACE ORDER
  ========================================================== */

  const handlePlaceOrder =
    async () => {
      if (
        placingOrder ||
        loadingCart
      ) {
        return;
      }

      if (!validateCheckout()) {
        return;
      }

      setPlacingOrder(true);

      try {
        /* ----------------------------------------------------
           SAVE ADDRESS
        ---------------------------------------------------- */

        try {
          await saveAddressForFutureOrders();
        } catch (error) {
          /*
           * Address saving should never block an order.
           */
          console.error(
            "Save checkout address error:",
            error,
          );
        }

        /* ----------------------------------------------------
           ORDER PAYLOAD
        ---------------------------------------------------- */

        const normalizedCoupon =
          couponCode
            .trim()
            .toUpperCase();

        const orderPayload: CreateOrderPayload =
          {
            customerName:
              getCustomerName(),

            customerEmail:
              contact.email.trim(),

            customerPhone:
              contact.phone.trim(),

            shippingAddress: {
              firstName:
                address.firstName.trim(),

              lastName:
                address.lastName.trim(),

              addressLine1:
                address.addressLine1.trim(),

              addressLine2:
                address.addressLine2?.trim() ||
                "",

              landmark:
                address.landmark?.trim() ||
                "",

              city:
                address.city.trim(),

              state:
                address.state.trim(),

              postalCode:
                address.postalCode.trim(),

              country:
                address.country?.trim() ||
                "India",
            },

            deliveryMethod:
              delivery ===
              "express"
                ? "express"
                : "standard",

            paymentMethod:
              "cod",

            couponCode:
              normalizedCoupon ||
              undefined,

            items: items.map(
              (item) => ({
                productId:
                  item.productId,

                quantity:
                  item.quantity,
              }),
            ),
          };

        /* ----------------------------------------------------
           IDEMPOTENCY
        ---------------------------------------------------- */

        const idempotencyKey =
          createIdempotencyKey();

        /* ----------------------------------------------------
           CREATE ORDER
        ---------------------------------------------------- */

        const response =
          await createOrder(
            orderPayload,
            idempotencyKey,
            accessToken,
          );

        const order =
          response.order;

        const publicAccessToken =
          response.publicAccessToken;

        /* ----------------------------------------------------
           VERIFY PUBLIC ORDER ACCESS TOKEN
        ---------------------------------------------------- */

        if (
          !publicAccessToken ||
          typeof publicAccessToken !==
            "string"
        ) {
          throw new Error(
            "Order was created, but secure order access information was not returned.",
          );
        }

        /* ----------------------------------------------------
           SAVE PUBLIC ACCESS TOKEN
        ---------------------------------------------------- */

        const storageKey =
          getOrderAccessTokenKey(
            order.orderNumber,
          );

        try {
          sessionStorage.setItem(
            storageKey,
            publicAccessToken,
          );
        } catch (storageError) {
          console.error(
            "Unable to store order access token:",
            storageError,
          );

          throw new Error(
            "Your order was created, but we could not securely prepare the confirmation page. Please check your order shortly.",
          );
        }

        /* ----------------------------------------------------
           CLEAR BACKEND CART
        ---------------------------------------------------- */

        try {
          const { clearCart } =
            await import(
              "@/services/cart.service"
            );

          await clearCart();
        } catch (cartError) {
          /*
           * Order is already created. Do not show
           * the customer an order failure because
           * cart cleanup failed.
           */
          console.error(
            "Clear backend cart error:",
            cartError,
          );
        }

        idempotencyKeyRef.current =
          null;

        /* ----------------------------------------------------
           SUCCESS MESSAGE
        ---------------------------------------------------- */

        toast.success(
          "Your order has been placed successfully.",
        );

        /* ----------------------------------------------------
           REDIRECT
        ---------------------------------------------------- */

        router.replace(
          `/checkout/success?orderNumber=${encodeURIComponent(
            order.orderNumber,
          )}`,
        );
      } catch (error) {
        console.error(
          "Place order error:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to place your order. Please try again.",
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  /* ==========================================================
     DISPLAY
  ========================================================== */

  const isOrderDisabled =
    placingOrder ||
    loadingCart ||
    !items.length ||
    payment !== "cod";

  const paymentLabel =
    payment === "cod"
      ? "Cash on Delivery"
      : "Online Payment";

  const deliveryLabel =
    delivery === "express"
      ? "Express Delivery"
      : "Standard Delivery";

  return (
    <section className="checkout-place-order">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="checkout-place-order__header">
        <div className="checkout-place-order__heading">
          <div className="checkout-place-order__step">
            05
          </div>

          <div className="checkout-place-order__heading-content">
            <p className="checkout-place-order__eyebrow">
              Complete Order
            </p>

            <h2 className="checkout-place-order__title">
              Review &amp; place order
            </h2>

            <p className="checkout-place-order__description">
              Review your selections before completing
              your purchase.
            </p>
          </div>
        </div>
      </header>

      <div className="checkout-place-order__content">
        {/* ====================================================
            SECURITY PANEL
        ==================================================== */}

        <div className="checkout-place-order__security">
          <div className="checkout-place-order__security-icon">
            <LockKeyhole />
          </div>

          <div className="checkout-place-order__security-copy">
            <p className="checkout-place-order__security-title">
              Secure order placement
            </p>

            <p>
              Your order information is handled securely
              and the final amount is verified by our
              server.
            </p>
          </div>

          <CheckCircle2 className="checkout-place-order__security-check" />
        </div>

        {/* ====================================================
            ORDER METHOD SNAPSHOT
        ==================================================== */}

        <div className="checkout-place-order__details">
          <ReviewRow
            label="Payment method"
            value={paymentLabel}
            icon={
              <CheckCircle2 />
            }
            success
          />

          <ReviewRow
            label="Delivery"
            value={deliveryLabel}
            meta={
              shipping === 0
                ? "Free"
                : `₹${shipping}`
            }
          />
        </div>

        {/* ====================================================
            COUPON
        ==================================================== */}

        {couponCode ? (
          <div className="checkout-place-order__coupon">
            <div className="checkout-place-order__coupon-main">
              <span className="checkout-place-order__coupon-icon">
                <Check />
              </span>

              <div>
                <p className="checkout-place-order__coupon-label">
                  Coupon applied
                </p>

                <p className="checkout-place-order__coupon-code">
                  {couponCode}
                </p>
              </div>
            </div>

            <div className="checkout-place-order__coupon-savings">
              {couponDiscount > 0 ? (
                <span>
                  − ₹
                  {couponDiscount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              ) : null}

              {couponShippingDiscount >
              0 ? (
                <span>
                  Free shipping
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* ====================================================
            TOTAL
        ==================================================== */}

        <div className="checkout-place-order__total">
          <div className="checkout-place-order__total-copy">
            <p className="checkout-place-order__total-eyebrow">
              Payable total
            </p>

            <p className="checkout-place-order__total-note">
              Final amount verified securely by the server.
            </p>
          </div>

          <p className="checkout-place-order__total-value">
            ₹
            {total.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>

        {/* ====================================================
            PRIMARY CTA
        ==================================================== */}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isOrderDisabled}
          className="checkout-place-order__button"
        >
          <span className="checkout-place-order__button-icon">
            <ShoppingBag />
          </span>

          <span className="checkout-place-order__button-copy">
            <span className="checkout-place-order__button-label">
              {loadingCart
                ? "Preparing order..."
                : placingOrder
                  ? "Placing order..."
                  : payment === "cod"
                    ? "Place COD order"
                    : "Online payment unavailable"}
            </span>

            {!loadingCart &&
            !placingOrder &&
            payment === "cod" ? (
              <span className="checkout-place-order__button-total">
                ₹
                {total.toLocaleString(
                  "en-IN",
                )}
              </span>
            ) : null}
          </span>

          {!loadingCart &&
          !placingOrder &&
          payment === "cod" ? (
            <ChevronRight className="checkout-place-order__button-arrow" />
          ) : null}
        </button>

        {/* ====================================================
            TRUST LINE
        ==================================================== */}

        <div className="checkout-place-order__trust">
          <LockKeyhole />

          <p>
            Your order is protected by secure server-side
            validation and idempotent order processing.
          </p>
        </div>

        {/* ====================================================
            TERMS
        ==================================================== */}

        <p className="checkout-place-order__terms">
          By placing your order, you agree to Aayesha
          Fashion&apos;s applicable terms, shipping and
          return policies.
        </p>
      </div>
    </section>
  );
}

/* ==========================================================
   REVIEW ROW
========================================================== */

function ReviewRow({
  label,
  value,
  meta,
  icon,
  success = false,
}: {
  label: string;
  value: string;
  meta?: string;
  icon?: ReactNode;
  success?: boolean;
}) {
  return (
    <div className="checkout-place-order__review-row">
      <div className="checkout-place-order__review-left">
        <p className="checkout-place-order__review-label">
          {label}
        </p>

        <p className="checkout-place-order__review-value">
          {value}
        </p>
      </div>

      <div className="checkout-place-order__review-right">
        {meta ? (
          <span className="checkout-place-order__review-meta">
            {meta}
          </span>
        ) : null}

        {icon ? (
          <span
            className={[
              "checkout-place-order__review-icon",
              success
                ? "checkout-place-order__review-icon--success"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}