"use client";

import Link from "next/link";
import { PackageCheck, Share2, Sparkles, Star, Truck } from "lucide-react";

import type { OrderDetails } from "@/lib/api/orders";

import { ProductStrip } from "./product-strip";
import { ReorderButton } from "./reorder-button";

import "./OrdersSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * Post-purchase sales block for the checkout success page. Uses only
 * real order data: actual savings, the real fulfilment steps and the
 * store's best sellers.
 */
export function SuccessSales({
  order,
  isAuthenticated,
}: {
  order: OrderDetails;
  isAuthenticated: boolean;
}) {
  const cancelled = order.status === "cancelled";
  const awaitingPayment =
    order.paymentMethod === "bank_upi" &&
    order.paymentStatus === "pending" &&
    !cancelled;

  const saved = (order.productDiscount ?? 0) + (order.couponDiscount ?? 0);

  const items = order.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    name: item.name,
  }));

  const shareText = encodeURIComponent(
    `I just ordered from AAYESHA FASHION! ${
      typeof window !== "undefined" ? window.location.origin : ""
    }`,
  );

  if (cancelled) {
    return (
      <section className="success-sales">
        <div className="success-sales__inner">
          <p className="success-sales__lead">
            Your items are still available — place the order again in a tap.
          </p>

          <ReorderButton items={items} />
        </div>
      </section>
    );
  }

  return (
    <section className="success-sales">
      <div className="success-sales__inner">
        {saved > 0 && !awaitingPayment ? (
          <p className="success-sales__saved">
            <Sparkles size={16} strokeWidth={1.5} aria-hidden="true" />
            You saved <strong>{money(saved)}</strong> on this order.
          </p>
        ) : null}

        <ol className="success-sales__steps">
          <li>
            <PackageCheck size={20} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <strong>We pack your order</strong>
              Every piece is checked before it leaves us.
            </span>
          </li>

          <li>
            <Truck size={20} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <strong>Tracking details</strong>
              You are notified as soon as it ships.
            </span>
          </li>

          <li>
            <Star size={20} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <strong>Share your review</strong>
              After delivery, tell others how it looks.
            </span>
          </li>
        </ol>

        <div className="order-extras">
          {!awaitingPayment ? (
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 size={14} aria-hidden="true" /> &nbsp;Tell a friend
            </a>
          ) : null}

          {!isAuthenticated ? (
            <Link href="/register">Create an account to track orders</Link>
          ) : null}
        </div>
      </div>

      <ProductStrip
        title="Complete the look"
        eyebrow="Best sellers"
        excludeIds={order.items.map((item) => item.productId)}
        limit={4}
      />
    </section>
  );
}
