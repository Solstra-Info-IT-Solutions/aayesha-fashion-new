"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  getCustomerOrder,
  type OrderDetails as OrderDetailsData,
} from "@/lib/api/orders";
import { useAuthStore } from "@/store/auth-store";
import "./OrderDetails.css";

interface OrderDetailsProps {
  orderNumber: string;
}

/* ==========================================================
   HELPERS
========================================================== */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const formatStatus = (status: string) =>
  status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Order Confirmed";
    case "processing":
      return "Being Prepared";
    case "packed":
      return "Packed & Ready";
    case "shipped":
      return "Shipped";
    case "in_transit":
      return "In Transit";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Order Cancelled";
    case "returned":
      return "Order Returned";
    case "exchanged":
      return "Order Exchanged";
    default:
      return formatStatus(status);
  }
};

const getStatusTone = (status: string) => {
  switch (status) {
    case "delivered":
      return "order-details__status--success";

    case "cancelled":
      return "order-details__status--danger";

    case "returned":
    case "exchanged":
      return "order-details__status--warning";

    default:
      return "order-details__status--progress";
  }
};

/* ==========================================================
   TRACKING
========================================================== */

const trackingStatuses = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const getTrackingIndex = (status: string) => {
  if (status === "in_transit") {
    return 3;
  }

  return trackingStatuses.indexOf(status);
};

/* ==========================================================
   LOADING UI
========================================================== */

function OrderDetailsLoading() {
  return (
    <section className="order-details order-details--loading">
      <div className="order-details__loading">
        <div className="order-details__loading-header">
          <div className="order-details__skeleton order-details__skeleton--back" />

          <div className="order-details__skeleton order-details__skeleton--eyebrow" />

          <div className="order-details__skeleton order-details__skeleton--title" />

          <div className="order-details__skeleton order-details__skeleton--description" />
        </div>

        <div className="order-details__loading-grid">
          <div className="order-details__skeleton order-details__skeleton--large" />
          <div className="order-details__skeleton order-details__skeleton--large" />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   ERROR UI
========================================================== */

function OrderDetailsError({
  error,
}: {
  error: string;
}) {
  return (
    <section className="order-details order-details--error">
      <div className="order-details__error-card">
        <div className="order-details__state-icon">
          <Package
            size={25}
            strokeWidth={1.4}
          />
        </div>

        <p className="order-details__eyebrow">
          My Orders
        </p>

        <h1 className="order-details__state-title">
          Order not found
        </h1>

        <p className="order-details__state-description">
          {error ||
            "We could not find the order you are looking for."}
        </p>

        <Link
          href="/account/orders"
          className="order-details__button order-details__button--primary"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.6}
          />

          <span>Back to My Orders</span>
        </Link>
      </div>
    </section>
  );
}

/* ==========================================================
   COMPONENT
========================================================== */

export function OrderDetails({
  orderNumber,
}: OrderDetailsProps) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const [order, setOrder] =
    useState<OrderDetailsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD ORDER
  ========================================================== */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (
      !isAuthenticated ||
      !accessToken
    ) {
      setIsLoading(false);
      setError(
        "Please login to view this order.",
      );
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getCustomerOrder(
            accessToken,
            orderNumber,
          );

        setOrder(response.order);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load order details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
    orderNumber,
  ]);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const itemCount = useMemo(() => {
    if (!order) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [order]);

  const currentTrackingIndex = order
    ? getTrackingIndex(order.status)
    : -1;

  const showTracking =
    order &&
    ![
      "cancelled",
      "returned",
      "exchanged",
    ].includes(order.status);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!isInitialized || isLoading) {
    return <OrderDetailsLoading />;
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error || !order) {
    return (
      <OrderDetailsError
        error={error}
      />
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <section className="order-details">
      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        href="/account/orders"
        className="order-details__back"
      >
        <ArrowLeft
          size={15}
          strokeWidth={1.5}
        />

        <span>My Orders</span>
      </Link>

      {/* =====================================================
          ORDER HERO
      ===================================================== */}

      <header className="order-details__hero">
        <div className="order-details__hero-accent" />

        <div className="order-details__hero-content">
          <div className="order-details__hero-main">
            <div className="order-details__eyebrow-row">
              <span className="order-details__eyebrow-line" />

              <p className="order-details__eyebrow">
                Aayesha Fashion
              </p>
            </div>

            <div className="order-details__title-row">
              <h1 className="order-details__title">
                Order #{order.orderNumber}
              </h1>

              <span
                className={`order-details__status ${getStatusTone(
                  order.status,
                )}`}
              >
                {getStatusLabel(
                  order.status,
                )}
              </span>
            </div>

            <div className="order-details__meta">
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

                {itemCount}{" "}
                {itemCount === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>
          </div>

          <div className="order-details__total">
            <p>Order Total</p>

            <strong>
              {formatCurrency(
                order.total,
              )}
            </strong>
          </div>
        </div>

        {/* ===================================================
            ORDER PROGRESS
        =================================================== */}

        {showTracking && (
          <div className="order-details__tracking">
            <div className="order-details__tracking-scroll">
              <div className="order-details__tracking-list">
                {trackingStatuses.map(
                  (status, index) => {
                    const isCompleted =
                      currentTrackingIndex >=
                      index;

                    const isCurrent =
                      currentTrackingIndex ===
                      index;

                    return (
                      <div
                        key={status}
                        className="order-details__tracking-step"
                      >
                        {index <
                          trackingStatuses.length -
                            1 && (
                          <div
                            className={`order-details__tracking-line ${
                              currentTrackingIndex >
                              index
                                ? "order-details__tracking-line--active"
                                : ""
                            }`}
                          />
                        )}

                        <div
                          className={`order-details__tracking-icon ${
                            isCompleted
                              ? "order-details__tracking-icon--complete"
                              : ""
                          }`}
                        >
                          {isCompleted ? (
                            <Check
                              size={12}
                              strokeWidth={1.8}
                            />
                          ) : (
                            <Circle
                              size={7}
                              fill="currentColor"
                              strokeWidth={0}
                            />
                          )}
                        </div>

                        <p
                          className={
                            isCurrent
                              ? "order-details__tracking-label order-details__tracking-label--current"
                              : "order-details__tracking-label"
                          }
                        >
                          {status ===
                          "out_for_delivery"
                            ? "Out for Delivery"
                            : status ===
                                "processing"
                              ? "Processing"
                              : status ===
                                  "in_transit"
                                ? "In Transit"
                                : formatStatus(
                                    status,
                                  )}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <p className="order-details__tracking-hint">
              Swipe to view progress
            </p>
          </div>
        )}

        {/* ===================================================
            INACTIVE ORDER
        =================================================== */}

        {[
          "cancelled",
          "returned",
          "exchanged",
        ].includes(order.status) && (
          <div className="order-details__inactive">
            <span className="order-details__inactive-marker" />

            <p>
              <strong>
                {getStatusLabel(
                  order.status,
                )}
              </strong>{" "}
              — this order is no longer
              active.
            </p>
          </div>
        )}
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="order-details__layout">
        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="order-details__main-column">
          {/* =================================================
              ORDERED ITEMS
          ================================================= */}

          <section className="order-details__panel">
            <div className="order-details__panel-header">
              <div>
                <p className="order-details__panel-eyebrow">
                  Your Selection
                </p>

                <h2 className="order-details__panel-title">
                  Ordered Items
                </h2>
              </div>

              <span className="order-details__panel-count">
                {itemCount}{" "}
                {itemCount === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>

            <div className="order-details__items">
              {order.items.map(
                (item) => (
                  <article
                    key={item.productId}
                    className="order-details__item"
                  >
                    <div className="order-details__product-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <Package
                          size={22}
                          strokeWidth={1.3}
                        />
                      )}

                      <span>
                        {item.quantity}
                      </span>
                    </div>

                    <div className="order-details__product-content">
                      <div className="order-details__product-heading">
                        <div>
                          <p className="order-details__product-brand">
                            Aayesha Fashion
                          </p>

                          <h3 className="order-details__product-name">
                            {item.name}
                          </h3>

                          {item.sku && (
                            <p className="order-details__product-sku">
                              SKU {item.sku}
                            </p>
                          )}
                        </div>

                        <p className="order-details__product-total">
                          {formatCurrency(
                            item.lineTotal,
                          )}
                        </p>
                      </div>

                      <div className="order-details__product-meta">
                        {item.mrp >
                          item.sellingPrice && (
                          <span className="order-details__product-mrp">
                            {formatCurrency(
                              item.mrp,
                            )}
                          </span>
                        )}

                        <span>
                          {formatCurrency(
                            item.sellingPrice,
                          )}{" "}
                          each
                        </span>

                        {item.mrp >
                          item.sellingPrice && (
                          <span className="order-details__saving">
                            Save{" "}
                            {formatCurrency(
                              item.mrp -
                                item.sellingPrice,
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          {/* =================================================
              ADDRESS + PAYMENT
          ================================================= */}

          <div className="order-details__info-grid">
            {/* ADDRESS */}

            <section className="order-details__info-card">
              <div className="order-details__info-header">
                <div>
                  <p className="order-details__panel-eyebrow">
                    Shipping
                  </p>

                  <h2 className="order-details__info-title">
                    Delivery Address
                  </h2>
                </div>

                <div className="order-details__info-icon">
                  <MapPin
                    size={17}
                    strokeWidth={1.4}
                  />
                </div>
              </div>

              <address className="order-details__address">
                <strong>
                  {
                    order.shippingAddress
                      .firstName
                  }{" "}
                  {
                    order.shippingAddress
                      .lastName
                  }
                </strong>

                <span>
                  {
                    order.shippingAddress
                      .addressLine1
                  }
                </span>

                {order.shippingAddress
                  .addressLine2 && (
                  <span>
                    {
                      order.shippingAddress
                        .addressLine2
                    }
                  </span>
                )}

                {order.shippingAddress
                  .landmark && (
                  <span>
                    Landmark:{" "}
                    {
                      order.shippingAddress
                        .landmark
                    }
                  </span>
                )}

                <span>
                  {
                    order.shippingAddress
                      .city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      .state
                  }{" "}
                  {
                    order.shippingAddress
                      .postalCode
                  }
                </span>

                <span>
                  {
                    order.shippingAddress
                      .country
                  }
                </span>
              </address>
            </section>

            {/* PAYMENT */}

            <section className="order-details__info-card">
              <div className="order-details__info-header">
                <div>
                  <p className="order-details__panel-eyebrow">
                    Payment
                  </p>

                  <h2 className="order-details__info-title">
                    Payment Details
                  </h2>
                </div>

                <div className="order-details__info-icon">
                  <CreditCard
                    size={17}
                    strokeWidth={1.4}
                  />
                </div>
              </div>

              <div className="order-details__payment">
                <div>
                  <span>Method</span>

                  <strong>
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    {order.paymentStatus ===
                      "paid" && (
                      <CheckCircle2
                        size={14}
                        strokeWidth={1.5}
                        className="order-details__paid-icon"
                      />
                    )}

                    {formatStatus(
                      order.paymentStatus,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>

                  <strong>
                    {formatStatus(
                      order.deliveryMethod,
                    )}
                  </strong>
                </div>
              </div>

              {/* TRACKING */}

              {order.shippingInfo
                ?.trackingNumber && (
                <div className="order-details__shipment">
                  <div className="order-details__shipment-heading">
                    <Truck
                      size={15}
                      strokeWidth={1.4}
                    />

                    <span>
                      Tracking
                    </span>
                  </div>

                  {order.shippingInfo
                    .courierName && (
                    <p className="order-details__courier">
                      {
                        order.shippingInfo
                          .courierName
                      }
                    </p>
                  )}

                  <p className="order-details__tracking-number">
                    {
                      order.shippingInfo
                        .trackingNumber
                    }
                  </p>

                  {order.shippingInfo
                    .trackingUrl && (
                    <a
                      href={
                        order.shippingInfo
                          .trackingUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="order-details__track-button"
                    >
                      <span>
                        Track Shipment
                      </span>

                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                      />
                    </a>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ===================================================
            RIGHT SUMMARY
        =================================================== */}

        <aside className="order-details__sidebar">
          <div className="order-details__summary">
            <div className="order-details__summary-accent" />

            <div className="order-details__summary-content">
              <p className="order-details__panel-eyebrow">
                Price Details
              </p>

              <h2 className="order-details__summary-title">
                Order Summary
              </h2>

              <div className="order-details__summary-lines">
                <div>
                  <span>MRP Total</span>

                  <strong>
                    {formatCurrency(
                      order.mrpTotal,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Product Discount
                  </span>

                  <strong className="order-details__discount">
                    -{" "}
                    {formatCurrency(
                      order.productDiscount,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Subtotal</span>

                  <strong>
                    {formatCurrency(
                      order.subtotal,
                    )}
                  </strong>
                </div>

                {order.couponDiscount >
                  0 && (
                  <div className="order-details__coupon">
                    <div>
                      <strong>
                        Coupon Discount
                      </strong>

                      {order.couponCode && (
                        <span>
                          {
                            order.couponCode
                          }
                        </span>
                      )}
                    </div>

                    <strong className="order-details__discount">
                      -{" "}
                      {formatCurrency(
                        order.couponDiscount,
                      )}
                    </strong>
                  </div>
                )}

                <div>
                  <span>Shipping</span>

                  <strong>
                    {order.shippingAmount ===
                    0
                      ? "Free"
                      : formatCurrency(
                          order.shippingAmount,
                        )}
                  </strong>
                </div>
              </div>

              <div className="order-details__summary-divider" />

              <div className="order-details__grand-total">
                <div>
                  <span>Total Amount</span>

                  <strong>
                    {formatCurrency(
                      order.total,
                    )}
                  </strong>
                </div>

                <small>
                  {order.currency}
                </small>
              </div>

              <div className="order-details__secure-note">
                <CheckCircle2
                  size={16}
                  strokeWidth={1.4}
                />

                <p>
                  Your order details are
                  securely saved in your
                  Aayesha Fashion account.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="order-details__continue"
          >
            <span>
              Continue Shopping
            </span>

            <ChevronRight
              size={15}
              strokeWidth={1.5}
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}