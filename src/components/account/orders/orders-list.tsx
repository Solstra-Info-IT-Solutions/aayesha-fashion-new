"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  getCustomerOrders,
  type OrderDetails,
} from "@/lib/api/orders";
import { useAuthStore } from "@/store/auth-store";

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
    month: "short",
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

const getStatusTone = (status: string) => {
  switch (status) {
    case "delivered":
      return "orders-list__status--success";

    case "cancelled":
      return "orders-list__status--danger";

    case "returned":
    case "exchanged":
      return "orders-list__status--warning";

    default:
      return "orders-list__status--progress";
  }
};

/* ==========================================================
   LOADING
========================================================== */

function OrdersListLoading() {
  return (
    <section className="orders-list orders-list--loading">
      <div className="orders-list__loading">
        <div className="orders-list__loading-header">
          <div className="orders-list__skeleton orders-list__skeleton--eyebrow" />

          <div className="orders-list__skeleton orders-list__skeleton--title" />

          <div className="orders-list__skeleton orders-list__skeleton--description" />
        </div>

        <div className="orders-list__loading-card">
          <div className="orders-list__skeleton orders-list__skeleton--section-title" />

          <div className="orders-list__loading-items">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="orders-list__skeleton orders-list__skeleton--order"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   EMPTY / AUTH STATE
========================================================== */

function OrdersEmptyState({
  authenticated,
}: {
  authenticated: boolean;
}) {
  return (
    <section className="orders-list orders-list--state">
      <div className="orders-list__state-card">
        <div className="orders-list__state-icon">
          <ShoppingBag
            size={25}
            strokeWidth={1.3}
          />
        </div>

        <div className="orders-list__eyebrow-row">
          <span className="orders-list__eyebrow-line" />

          <p className="orders-list__eyebrow">
            {authenticated
              ? "Your Wardrobe"
              : "Aayesha Fashion"}
          </p>
        </div>

        <h1 className="orders-list__state-title">
          {authenticated
            ? "No orders yet"
            : "Sign in to view your orders"}
        </h1>

        <p className="orders-list__state-description">
          {authenticated
            ? "Your Aayesha Fashion purchases will appear here once you place your first order."
            : "Your orders, delivery updates and purchase history are available in your account."}
        </p>

        <Link
          href={
            authenticated
              ? "/shop"
              : "/login"
          }
          className="orders-list__button orders-list__button--primary"
        >
          <span>
            {authenticated
              ? "Explore Collection"
              : "Sign In"}
          </span>

          <ArrowRight
            size={15}
            strokeWidth={1.6}
          />
        </Link>
      </div>
    </section>
  );
}

/* ==========================================================
   ERROR
========================================================== */

function OrdersError({
  error,
}: {
  error: string;
}) {
  return (
    <section className="orders-list orders-list--state">
      <div className="orders-list__state-card">
        <div className="orders-list__state-icon">
          <Package
            size={25}
            strokeWidth={1.3}
          />
        </div>

        <div className="orders-list__eyebrow-row">
          <span className="orders-list__eyebrow-line" />

          <p className="orders-list__eyebrow">
            My Orders
          </p>
        </div>

        <h1 className="orders-list__state-title">
          Unable to load orders
        </h1>

        <p className="orders-list__state-description">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="orders-list__button orders-list__button--primary"
        >
          <span>Try Again</span>

          <ArrowRight
            size={15}
            strokeWidth={1.6}
          />
        </button>
      </div>
    </section>
  );
}

/* ==========================================================
   ORDERS LIST
========================================================== */

export function OrdersList() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAuthStore();

  const [orders, setOrders] =
    useState<OrderDetails[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD ORDERS
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
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getCustomerOrders(
            accessToken,
          );

        setOrders(response.orders);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your orders.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
  ]);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (!isInitialized || isLoading) {
    return <OrdersListLoading />;
  }

  /* ==========================================================
     AUTH
  ========================================================== */

  if (!isAuthenticated) {
    return (
      <OrdersEmptyState
        authenticated={false}
      />
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <OrdersError
        error={error}
      />
    );
  }

  /* ==========================================================
     EMPTY
  ========================================================== */

  if (orders.length === 0) {
    return (
      <OrdersEmptyState
        authenticated
      />
    );
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <section className="orders-list">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="orders-list__header">
        <div className="orders-list__heading">
          <div className="orders-list__eyebrow-row">
            <span className="orders-list__eyebrow-line" />

            <p className="orders-list__eyebrow">
              My Account
            </p>
          </div>

          <h1 className="orders-list__title">
            My Orders
          </h1>

          <p className="orders-list__description">
            View your purchases, delivery
            status and complete order details.
          </p>
        </div>

        <Link
          href="/shop"
          className="orders-list__button orders-list__button--secondary"
        >
          <span>Continue Shopping</span>

          <ChevronRight
            size={15}
            strokeWidth={1.5}
          />
        </Link>
      </header>

      {/* =====================================================
          ORDER COUNT
      ===================================================== */}

      <div className="orders-list__count-row">
        <div className="orders-list__count-line" />

        <span className="orders-list__count">
          {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </span>

        <div className="orders-list__count-line" />
      </div>

      {/* =====================================================
          ORDERS
      ===================================================== */}

      <div className="orders-list__items">
        {orders.map((order) => {
          const firstItem =
            order.items[0];

          const totalItems =
            order.items.reduce(
              (total, item) =>
                total + item.quantity,
              0,
            );

          return (
            <article
              key={order.id}
              className="order-list-card"
            >
              <div className="order-list-card__inner">
                {/* ============================================
                    ORDER META
                ============================================ */}

                <div className="order-list-card__meta">
                  <div className="order-list-card__meta-left">
                    <div>
                      <p className="order-list-card__meta-label">
                        Order
                      </p>

                      <p className="order-list-card__number">
                        #{order.orderNumber}
                      </p>
                    </div>

                    <span className="order-list-card__meta-divider" />

                    <div className="order-list-card__date">
                      <CalendarDays
                        size={14}
                        strokeWidth={1.4}
                      />

                      <span>
                        {formatDate(
                          order.createdAt,
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`order-list-card__status ${getStatusTone(
                      order.status,
                    )}`}
                  >
                    {formatStatus(
                      order.status,
                    )}
                  </span>
                </div>

                {/* ============================================
                    ORDER CONTENT
                ============================================ */}

                <div className="order-list-card__content">
                  {/* Product */}

                  <div className="order-list-card__product">
                    <div className="order-list-card__image">
                      {firstItem?.image ? (
                        <img
                          src={
                            firstItem.image
                          }
                          alt={
                            firstItem.name
                          }
                        />
                      ) : (
                        <Package
                          size={23}
                          strokeWidth={1.3}
                        />
                      )}

                      <span className="order-list-card__quantity">
                        {totalItems}
                      </span>
                    </div>

                    <div className="order-list-card__product-info">
                      <p className="order-list-card__brand">
                        Aayesha Fashion
                      </p>

                      <h2 className="order-list-card__product-name">
                        {firstItem?.name ||
                          "Order Items"}
                      </h2>

                      {firstItem &&
                        order.items.length >
                          1 && (
                          <p className="order-list-card__more">
                            +{" "}
                            {order.items
                              .length -
                              1}{" "}
                            more{" "}
                            {order.items
                              .length -
                              1 === 1
                              ? "item"
                              : "items"}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Total */}

                  <div className="order-list-card__summary">
                    <div className="order-list-card__total">
                      <p>
                        Order Total
                      </p>

                      <strong>
                        {formatCurrency(
                          order.total,
                        )}
                      </strong>
                    </div>

                    <Link
                      href={`/account/orders/${encodeURIComponent(
                        order.orderNumber,
                      )}`}
                      className="order-list-card__view"
                    >
                      <span>
                        View Order
                      </span>

                      <ArrowRight
                        size={14}
                        strokeWidth={1.6}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}