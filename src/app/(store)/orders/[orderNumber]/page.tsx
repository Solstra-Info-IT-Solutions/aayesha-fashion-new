"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  getOrder,
  type OrderDetails,
} from "@/lib/api/orders";

import "./PublicOrderPage.css";

interface PublicOrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

const getOrderAccessTokenKey = (
  orderNumber: string,
) => `aayesha-order-access-token:${orderNumber}`;

const formatCurrency = (
  value: number,
) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (
  date: string,
) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const formatStatus = (
  status: string,
) =>
  status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");

const trackingStatuses = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const getTrackingIndex = (
  status: string,
) => {
  if (status === "in_transit") {
    return 3;
  }

  return trackingStatuses.indexOf(status);
};

const getStatusTone = (
  status: string,
) => {
  switch (status) {
    case "delivered":
      return "public-order-page__status--delivered";

    case "cancelled":
      return "public-order-page__status--cancelled";

    case "returned":
      return "public-order-page__status--returned";

    case "exchanged":
      return "public-order-page__status--exchanged";

    default:
      return "public-order-page__status--default";
  }
};

export default function PublicOrderPage({
  params,
}: PublicOrderPageProps) {
  const [orderNumber, setOrderNumber] =
    useState("");

  const [order, setOrder] =
    useState<OrderDetails | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const resolvedParams =
          await params;

        const normalizedOrderNumber =
          resolvedParams.orderNumber
            ?.trim()
            .toUpperCase();

        if (!normalizedOrderNumber) {
          throw new Error(
            "Order number is required.",
          );
        }

        const storageKey =
          getOrderAccessTokenKey(
            normalizedOrderNumber,
          );

        const accessToken =
          sessionStorage.getItem(
            storageKey,
          );

        if (!accessToken) {
          throw new Error(
            "Secure order access has expired or is unavailable. Please check your orders from your account.",
          );
        }

        const response =
          await getOrder(
            normalizedOrderNumber,
            accessToken,
          );

        if (cancelled) {
          return;
        }

        setOrderNumber(
          normalizedOrderNumber,
        );

        setOrder(
          response.order,
        );
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof
            Error
            ? requestError.message
            : "Unable to load order details.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="public-order-page public-order-page--state">
        <div className="public-order-page__state-wrapper">
          <div className="public-order-page__state-card">
            <div className="public-order-page__state-icon public-order-page__state-icon--loading">
              <ShoppingBag
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <p className="public-order-page__state-eyebrow">
              Aayesha Fashion
            </p>

            <h1 className="public-order-page__state-title">
              Loading your order
            </h1>

            <p className="public-order-page__state-description">
              We&apos;re securely retrieving
              your order details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !order) {
    return (
      <main className="public-order-page public-order-page--state">
        <div className="public-order-page__state-wrapper">
          <div className="public-order-page__state-card">
            <div className="public-order-page__state-icon public-order-page__state-icon--error">
              <Package
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <p className="public-order-page__state-eyebrow">
              Aayesha Fashion
            </p>

            <h1 className="public-order-page__state-title">
              Order unavailable
            </h1>

            <p className="public-order-page__state-description">
              {error}
            </p>

            <div className="public-order-page__state-actions">
              <Link
                href="/shop"
                className="public-order-page__state-button public-order-page__state-button--primary"
              >
                Continue Shopping

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.4}
                />
              </Link>

              <Link
                href="/"
                className="public-order-page__state-button public-order-page__state-button--secondary"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const trackingIndex =
    getTrackingIndex(
      order.status,
    );

  const showTracking =
    ![
      "cancelled",
      "returned",
      "exchanged",
    ].includes(order.status);

  return (
    <main className="public-order-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="public-order-page__hero">
        <div className="public-order-page__container">
          <Link
            href={`/checkout/success?orderNumber=${encodeURIComponent(
              orderNumber,
            )}`}
            className="public-order-page__back"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.4}
            />

            <span>
              Order Confirmation
            </span>
          </Link>

          <div className="public-order-page__hero-content">
            <div className="public-order-page__hero-copy">
              <p className="public-order-page__eyebrow">
                Aayesha Fashion
              </p>

              <h1 className="public-order-page__title">
                Order #{order.orderNumber}
              </h1>

              <div className="public-order-page__meta">
                <span>
                  <CalendarDays
                    size={14}
                    strokeWidth={1.4}
                  />

                  {formatDate(
                    order.createdAt,
                  )}
                </span>

                <span>
                  <ShoppingBag
                    size={14}
                    strokeWidth={1.4}
                  />

                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}{" "}
                  items
                </span>
              </div>
            </div>

            <span
              className={`public-order-page__status ${getStatusTone(
                order.status,
              )}`}
            >
              {formatStatus(
                order.status,
              )}
            </span>
          </div>

          {/* =================================================
              TRACKING
          ================================================= */}

          {showTracking && (
            <div className="public-order-page__tracking-wrapper">
              <div className="public-order-page__tracking">
                {trackingStatuses.map(
                  (
                    status,
                    index,
                  ) => {
                    const completed =
                      trackingIndex >=
                      index;

                    return (
                      <div
                        key={status}
                        className="public-order-page__tracking-step"
                      >
                        {index <
                          trackingStatuses.length -
                            1 && (
                          <div
                            className={`public-order-page__tracking-line ${
                              trackingIndex >
                              index
                                ? "public-order-page__tracking-line--active"
                                : ""
                            }`}
                          />
                        )}

                        <div className="public-order-page__tracking-content">
                          <div
                            className={`public-order-page__tracking-dot ${
                              completed
                                ? "public-order-page__tracking-dot--active"
                                : ""
                            }`}
                          >
                            {completed ? (
                              <Check
                                size={11}
                                strokeWidth={2}
                              />
                            ) : (
                              <Circle
                                size={7}
                                fill="currentColor"
                                strokeWidth={0}
                              />
                            )}
                          </div>

                          <p>
                            {status ===
                            "out_for_delivery"
                              ? "Out for Delivery"
                              : status ===
                                  "in_transit"
                                ? "In Transit"
                                : status ===
                                    "processing"
                                  ? "Processing"
                                  : formatStatus(
                                      status,
                                    )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="public-order-page__content">
        <div className="public-order-page__container">
          <div className="public-order-page__layout">
            {/* =================================================
                MAIN
            ================================================= */}

            <div className="public-order-page__main">
              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <div className="public-order-page__card">
                <div className="public-order-page__card-header">
                  <p className="public-order-page__card-eyebrow">
                    Your Selection
                  </p>

                  <h2 className="public-order-page__card-title">
                    Order Items
                  </h2>
                </div>

                <div className="public-order-page__items">
                  {order.items.map(
                    (item) => (
                      <div
                        key={item.productId}
                        className="public-order-page__item"
                      >
                        <div className="public-order-page__item-image">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />
                          ) : (
                            <Package
                              size={22}
                              strokeWidth={
                                1.3
                              }
                            />
                          )}
                        </div>

                        <div className="public-order-page__item-content">
                          <div className="public-order-page__item-main">
                            <div className="public-order-page__item-info">
                              <p className="public-order-page__item-name">
                                {item.name}
                              </p>

                              <p className="public-order-page__item-quantity">
                                Qty:{" "}
                                {
                                  item.quantity
                                }
                              </p>
                            </div>

                            <div className="public-order-page__item-price">
                              <p>
                                {formatCurrency(
                                  item.lineTotal,
                                )}
                              </p>

                              <span>
                                {formatCurrency(
                                  item.sellingPrice,
                                )}{" "}
                                each
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* =================================================
                  ADDRESS + PAYMENT
              ================================================= */}

              <div className="public-order-page__details-grid">
                {/* ADDRESS */}

                <div className="public-order-page__info-card">
                  <div className="public-order-page__info-icon">
                    <MapPin
                      size={17}
                      strokeWidth={1.4}
                    />
                  </div>

                  <div className="public-order-page__info-content">
                    <p className="public-order-page__info-eyebrow">
                      Delivery Address
                    </p>

                    <p className="public-order-page__info-name">
                      {
                        order
                          .shippingAddress
                          .firstName
                      }{" "}
                      {
                        order
                          .shippingAddress
                          .lastName
                      }
                    </p>

                    <div className="public-order-page__info-copy">
                      <p>
                        {
                          order
                            .shippingAddress
                            .addressLine1
                        }
                      </p>

                      {order
                        .shippingAddress
                        .addressLine2 && (
                        <p>
                          {
                            order
                              .shippingAddress
                              .addressLine2
                          }
                        </p>
                      )}

                      {order
                        .shippingAddress
                        .landmark && (
                        <p>
                          Landmark:{" "}
                          {
                            order
                              .shippingAddress
                              .landmark
                          }
                        </p>
                      )}

                      <p>
                        {
                          order
                            .shippingAddress
                            .city
                        }
                        ,{" "}
                        {
                          order
                            .shippingAddress
                            .state
                        }{" "}
                        {
                          order
                            .shippingAddress
                            .postalCode
                        }
                      </p>

                      <p>
                        {
                          order
                            .shippingAddress
                            .country
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT */}

                <div className="public-order-page__info-card">
                  <div className="public-order-page__info-icon">
                    <CreditCard
                      size={17}
                      strokeWidth={1.4}
                    />
                  </div>

                  <div className="public-order-page__info-content">
                    <p className="public-order-page__info-eyebrow">
                      Payment
                    </p>

                    <p className="public-order-page__info-name">
                      {order.paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>

                    <div className="public-order-page__info-copy">
                      <p>
                        Payment:{" "}
                        {formatStatus(
                          order.paymentStatus,
                        )}
                      </p>

                      <p>
                        Delivery:{" "}
                        {formatStatus(
                          order.deliveryMethod,
                        )}
                      </p>
                    </div>

                    {order.shippingInfo
                      ?.trackingNumber && (
                      <div className="public-order-page__tracking-info">
                        <div className="public-order-page__tracking-heading">
                          <Truck
                            size={14}
                            strokeWidth={1.4}
                          />

                          <span>
                            Tracking
                          </span>
                        </div>

                        <p className="public-order-page__tracking-number">
                          {
                            order
                              .shippingInfo
                              .trackingNumber
                          }
                        </p>

                        {order
                          .shippingInfo
                          .trackingUrl && (
                          <a
                            href={
                              order
                                .shippingInfo
                                .trackingUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="public-order-page__track-link"
                          >
                            Track Shipment

                            <ArrowUpRight
                              size={12}
                              strokeWidth={
                                1.4
                              }
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside className="public-order-page__summary">
              <div className="public-order-page__summary-inner">
                <p className="public-order-page__summary-eyebrow">
                  Price Details
                </p>

                <h2 className="public-order-page__summary-title">
                  Order Summary
                </h2>

                <div className="public-order-page__summary-rows">
                  <div className="public-order-page__summary-row">
                    <span>
                      MRP Total
                    </span>

                    <strong>
                      {formatCurrency(
                        order.mrpTotal,
                      )}
                    </strong>
                  </div>

                  {order.productDiscount >
                    0 && (
                    <div className="public-order-page__summary-row">
                      <span>
                        Product Discount
                      </span>

                      <strong className="public-order-page__discount">
                        -
                        {formatCurrency(
                          order.productDiscount,
                        )}
                      </strong>
                    </div>
                  )}

                  {order.couponDiscount >
                    0 && (
                    <div className="public-order-page__summary-row">
                      <span>
                        Coupon
                      </span>

                      <strong className="public-order-page__discount">
                        -
                        {formatCurrency(
                          order.couponDiscount,
                        )}
                      </strong>
                    </div>
                  )}

                  <div className="public-order-page__summary-row">
                    <span>
                      Shipping
                    </span>

                    <strong>
                      {order.shippingAmount ===
                      0
                        ? "FREE"
                        : formatCurrency(
                            order.shippingAmount,
                          )}
                    </strong>
                  </div>
                </div>

                <div className="public-order-page__summary-total">
                  <div>
                    <p>Total</p>

                    <span>
                      {order.paymentMethod ===
                      "cod"
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

                <Link
                  href="/shop"
                  className="public-order-page__continue"
                >
                  Continue Shopping

                  <ChevronRight
                    size={15}
                    strokeWidth={1.4}
                  />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}