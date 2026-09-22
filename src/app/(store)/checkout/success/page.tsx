"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

import { getOrder } from "@/lib/api/orders";
import type { OrderDetails } from "@/lib/api/orders";

import { useAuthStore } from "@/store/auth-store";

import "./CheckoutSuccessPage.css";

/* ==========================================================
   HELPERS
========================================================== */

const getOrderAccessTokenKey = (
  orderNumber: string,
) => `aayesha-order-access-token:${orderNumber}`;

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

/* ==========================================================
   LOADING UI
========================================================== */

function CheckoutSuccessLoading() {
  return (
    <main className="checkout-success checkout-success--loading">
      <div className="checkout-success__loading-wrap">
        <div className="checkout-success__loading-card">
          <div className="checkout-success__loading-icon">
            <ShoppingBag
              size={24}
              strokeWidth={1.3}
            />
          </div>

          <p className="checkout-success__loading-title">
            Confirming your order
          </p>

          <p className="checkout-success__loading-description">
            We&apos;re securely retrieving your order
            details. Please wait a moment.
          </p>

          <div className="checkout-success__loading-line" />
        </div>
      </div>
    </main>
  );
}

/* ==========================================================
   ERROR / EMPTY STATE
========================================================== */

function CheckoutSuccessError({
  error,
}: {
  error: string | null;
}) {
  return (
    <main className="checkout-success checkout-success--error">
      <div className="checkout-success__error-wrap">
        <div className="checkout-success__error-card">
          <div className="checkout-success__error-icon">
            <Clock3
              size={24}
              strokeWidth={1.3}
            />
          </div>

          <p className="checkout-success__eyebrow">
            Order Verification
          </p>

          <h1 className="checkout-success__error-title">
            We&apos;re checking your order
          </h1>

          <p className="checkout-success__error-description">
            {error ||
              "Your order may still be processing. Please check your orders shortly."}
          </p>

          <div className="checkout-success__error-actions">
            <Link
              href="/account/orders"
              className="checkout-success__button checkout-success__button--primary"
            >
              <span>View My Orders</span>

              <ArrowRight
                size={15}
                strokeWidth={1.6}
              />
            </Link>

            <Link
              href="/shop"
              className="checkout-success__button checkout-success__button--secondary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ==========================================================
   MAIN CONTENT
========================================================== */

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [orderNumber, setOrderNumber] =
    useState("");

  const [order, setOrder] =
    useState<OrderDetails | null>(null);

  const [publicAccessToken, setPublicAccessToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
     READ ORDER NUMBER FROM URL
  ========================================================== */

  useEffect(() => {
    const normalizedOrderNumber =
      searchParams
        .get("orderNumber")
        ?.trim()
        .toUpperCase();

    if (!normalizedOrderNumber) {
      setOrderNumber("");
      setError(
        "We could not find an order number for this confirmation page.",
      );
      setLoading(false);
      return;
    }

    setOrderNumber(normalizedOrderNumber);
    setError(null);
  }, [searchParams]);

  /* ==========================================================
     LOAD ORDER
  ========================================================== */

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const storageKey =
          getOrderAccessTokenKey(orderNumber);

        const storedToken =
          sessionStorage.getItem(storageKey);

        if (!storedToken) {
          if (!cancelled) {
            setOrder(null);

            setError(
              "Your secure order access information is unavailable. Please check your orders shortly.",
            );

            setLoading(false);
          }

          return;
        }

        const response = await getOrder(
          orderNumber,
          storedToken,
        );

        if (cancelled) {
          return;
        }

        setOrder(response.order);
        setPublicAccessToken(storedToken);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Checkout success order load error:",
          requestError,
        );

        setOrder(null);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "We could not load your order details.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (loading) {
    return <CheckoutSuccessLoading />;
  }

  if (error || !order) {
    return (
      <CheckoutSuccessError
        error={error}
      />
    );
  }

  const isCod =
    order.paymentMethod === "cod";

  const fullAddress = [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.landmark,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.postalCode,
    order.shippingAddress.country,
  ].filter(Boolean);

  const viewOrderHref =
    isInitialized && isAuthenticated
      ? `/account/orders/${encodeURIComponent(
          order.orderNumber,
        )}`
      : `/orders/${encodeURIComponent(
          order.orderNumber,
        )}`;

  return (
    <main className="checkout-success">
      {/* =====================================================
          CONFIRMATION HERO
      ===================================================== */}

      <section className="checkout-success__hero">
        <div className="checkout-success__container checkout-success__hero-container">
          <div className="checkout-success__hero-content">
            <div className="checkout-success__confirmation-mark">
              <div>
                <Check
                  size={21}
                  strokeWidth={1.7}
                />
              </div>
            </div>

            <p className="checkout-success__eyebrow">
              Order Confirmed
            </p>

            <h1 className="checkout-success__hero-title">
              Thank you for your order.
            </h1>

            <p className="checkout-success__hero-description">
              Your order has been received and is
              now being prepared with care.
            </p>

            <div className="checkout-success__order-meta">
              <span className="checkout-success__order-meta-label">
                Order Number
              </span>

              <span className="checkout-success__order-number">
                {order.orderNumber}
              </span>

              <span className="checkout-success__order-divider" />

              <span className="checkout-success__order-date">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORDER DETAILS
      ===================================================== */}

      <section className="checkout-success__details">
        <div className="checkout-success__container checkout-success__details-layout">
          {/* LEFT COLUMN */}

          <div className="checkout-success__main-column">
            {/* PAYMENT */}

            <div className="checkout-success__card checkout-success__payment-card">
              <div className="checkout-success__card-icon">
                <CheckCircle2
                  size={19}
                  strokeWidth={1.4}
                />
              </div>

              <div>
                <p className="checkout-success__card-eyebrow">
                  Payment
                </p>

                <h2 className="checkout-success__card-title">
                  {isCod
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </h2>

                <p className="checkout-success__card-description">
                  {isCod
                    ? "Please keep the payable amount ready when your order is delivered."
                    : "Your payment has been recorded successfully."}
                </p>
              </div>
            </div>

            {/* ORDER ITEMS */}

            <div className="checkout-success__card checkout-success__items-card">
              <div className="checkout-success__section-header">
                <div>
                  <p className="checkout-success__card-eyebrow">
                    Your Selection
                  </p>

                  <h2 className="checkout-success__section-title">
                    Order Items
                  </h2>
                </div>

                <span className="checkout-success__item-count">
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "Item"
                    : "Items"}
                </span>
              </div>

              <div className="checkout-success__items-list">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="checkout-success__item"
                  >
                    <div className="checkout-success__item-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="checkout-success__item-image-element"
                        />
                      ) : (
                        <div className="checkout-success__item-image-empty">
                          <ShoppingBag
                            size={18}
                            strokeWidth={1.3}
                          />
                        </div>
                      )}
                    </div>

                    <div className="checkout-success__item-details">
                      <div className="checkout-success__item-main">
                        <div className="checkout-success__item-info">
                          <p className="checkout-success__item-name">
                            {item.name}
                          </p>

                          <p className="checkout-success__item-quantity">
                            Quantity{" "}
                            <span>
                              {item.quantity}
                            </span>
                          </p>
                        </div>

                        <div className="checkout-success__item-price">
                          <p>
                            {formatCurrency(
                              item.lineTotal,
                            )}
                          </p>

                          {item.mrp >
                            item.sellingPrice && (
                            <span>
                              {formatCurrency(
                                item.mrp *
                                  item.quantity,
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERY ADDRESS */}

            <div className="checkout-success__card checkout-success__address-card">
              <div className="checkout-success__card-icon">
                <MapPin
                  size={18}
                  strokeWidth={1.4}
                />
              </div>

              <div className="checkout-success__address-content">
                <p className="checkout-success__card-eyebrow">
                  Delivery Address
                </p>

                <h2 className="checkout-success__card-title">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </h2>

                <div className="checkout-success__address-lines">
                  {fullAddress.map(
                    (line, index) => (
                      <p
                        key={`${line}-${index}`}
                      >
                        {line}
                      </p>
                    ),
                  )}
                </div>

                <div className="checkout-success__contact">
                  <p>
                    {order.customerPhone}
                  </p>

                  <p>
                    {order.customerEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <aside className="checkout-success__sidebar">
            {/* ORDER SUMMARY */}

            <div className="checkout-success__summary">
              <div className="checkout-success__summary-header">
                <PackageCheck
                  size={19}
                  strokeWidth={1.4}
                />

                <div>
                  <p className="checkout-success__card-eyebrow">
                    Your Purchase
                  </p>

                  <h2 className="checkout-success__summary-title">
                    Order Summary
                  </h2>
                </div>
              </div>

              <div className="checkout-success__summary-rows">
                <SummaryRow
                  label="MRP Total"
                  value={formatCurrency(
                    order.mrpTotal,
                  )}
                />

                {order.productDiscount > 0 && (
                  <SummaryRow
                    label="Product Savings"
                    value={`-${formatCurrency(
                      order.productDiscount,
                    )}`}
                    valueClassName="checkout-success__summary-value--success"
                  />
                )}

                {order.couponDiscount > 0 && (
                  <SummaryRow
                    label={
                      order.couponCode ||
                      "Coupon"
                    }
                    value={`-${formatCurrency(
                      order.couponDiscount,
                    )}`}
                    valueClassName="checkout-success__summary-value--success"
                  />
                )}

                <SummaryRow
                  label={
                    order.deliveryMethod ===
                    "express"
                      ? "Express Delivery"
                      : "Standard Delivery"
                  }
                  value={
                    order.shippingAmount === 0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingAmount,
                        )
                  }
                />
              </div>

              <div className="checkout-success__summary-total">
                <div>
                  <p>Total</p>

                  <span>
                    {isCod
                      ? "Payable on delivery"
                      : "Paid securely"}
                  </span>
                </div>

                <strong>
                  {formatCurrency(
                    order.total,
                  )}
                </strong>
              </div>
            </div>

            {/* STATUS */}

            <div className="checkout-success__status">
              <p className="checkout-success__status-eyebrow">
                Current Status
              </p>

              <div className="checkout-success__status-content">
                <div className="checkout-success__status-icon">
                  <Check
                    size={16}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p className="checkout-success__status-title">
                    {order.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>

                  <p className="checkout-success__status-description">
                    We&apos;ll keep you updated as
                    your order progresses.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="checkout-success__actions">
              {publicAccessToken ? (
                <Link
                  href={viewOrderHref}
                  className="checkout-success__action checkout-success__action--primary"
                >
                  <span>View Order</span>

                  <ArrowRight
                    size={15}
                    strokeWidth={1.6}
                  />
                </Link>
              ) : null}

              <Link
                href="/shop"
                className="checkout-success__action checkout-success__action--secondary"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          CLOSING NOTE
      ===================================================== */}

      <section className="checkout-success__closing">
        <div className="checkout-success__container">
          <div className="checkout-success__closing-inner">
            <div className="checkout-success__closing-icon">
              <CheckCircle2
                size={16}
                strokeWidth={1.4}
              />
            </div>

            <p>
              Thank you for choosing Aayesha Fashion.
              Your order has been successfully recorded
              and our team will begin processing it shortly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==========================================================
   SUMMARY ROW
========================================================== */

function SummaryRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="checkout-success__summary-row">
      <span>{label}</span>

      <strong className={valueClassName}>
        {value}
      </strong>
    </div>
  );
}

/* ==========================================================
   PAGE
========================================================== */

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}