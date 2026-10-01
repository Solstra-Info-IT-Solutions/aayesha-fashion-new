"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import toast from "react-hot-toast";

import type { OrderDetails } from "@/lib/api/orders";
import { sendMyInvoice } from "@/lib/api/payments";

import "./OrdersSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const pad = (value: number) => String(value).padStart(2, "0");

export type OrderTab = "all" | "active" | "awaiting" | "delivered" | "cancelled";

const ACTIVE_STATUSES = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
];

export const isAwaitingPayment = (order: OrderDetails) =>
  order.paymentMethod === "bank_upi" &&
  order.paymentStatus === "pending" &&
  order.status !== "cancelled";

export function orderMatchesTab(order: OrderDetails, tab: OrderTab) {
  switch (tab) {
    case "awaiting":
      return isAwaitingPayment(order);
    case "active":
      return ACTIVE_STATUSES.includes(order.status) && !isAwaitingPayment(order);
    case "delivered":
      return order.status === "delivered";
    case "cancelled":
      return order.status === "cancelled";
    default:
      return true;
  }
}

/** Orders that really count towards spend/savings. */
const counted = (order: OrderDetails) =>
  order.status !== "cancelled" && !isAwaitingPayment(order);

export function OrdersSummary({ orders }: { orders: OrderDetails[] }) {
  const real = orders.filter(counted);

  const spent = real.reduce((sum, order) => sum + order.total, 0);

  const saved = real.reduce(
    (sum, order) =>
      sum + (order.productDiscount ?? 0) + (order.couponDiscount ?? 0),
    0,
  );

  if (real.length === 0) {
    return null;
  }

  return (
    <ul className="orders-summary">
      <li>
        <span>Orders</span>
        <strong>{real.length}</strong>
      </li>

      <li>
        <span>Total spent</span>
        <strong>{money(spent)}</strong>
      </li>

      {saved > 0 ? (
        <li>
          <span>Saved with us</span>
          <strong className="orders-summary__save">{money(saved)}</strong>
        </li>
      ) : null}
    </ul>
  );
}

/** Live countdown for an unpaid WhatsApp-bill order. */
export function UnpaidOrderAlert({ orders }: { orders: OrderDetails[] }) {
  const [now, setNow] = useState(() => Date.now());

  const unpaid = orders.find(
    (order) =>
      isAwaitingPayment(order) &&
      order.paymentExpiresAt &&
      new Date(order.paymentExpiresAt).getTime() > now,
  );

  useEffect(() => {
    if (!unpaid) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(timer);
  }, [unpaid]);

  if (!unpaid) {
    return null;
  }

  const left = Math.max(
    0,
    Math.floor((new Date(unpaid.paymentExpiresAt as string).getTime() - now) / 1000),
  );

  return (
    <div className="orders-unpaid" role="alert">
      <Clock3 size={20} strokeWidth={1.5} aria-hidden="true" />

      <div>
        <p>Complete your payment for #{unpaid.orderNumber}</p>

        <span>
          {unpaid.paymentClaimedAt
            ? "We are verifying the payment you reported."
            : `Pay the WhatsApp bill within ${pad(Math.floor(left / 60))}:${pad(left % 60)} or the order is cancelled automatically.`}
        </span>
      </div>

      <Link href={`/account/orders/${encodeURIComponent(unpaid.orderNumber)}`}>
        {unpaid.paymentClaimedAt ? "View order" : "Pay now"} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

const TABS: Array<{ id: OrderTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "awaiting", label: "Awaiting payment" },
  { id: "active", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export function OrderTabs({
  orders,
  value,
  onChange,
}: {
  orders: OrderDetails[];
  value: OrderTab;
  onChange: (tab: OrderTab) => void;
}) {
  return (
    <div className="orders-tabs" role="tablist" aria-label="Filter orders">
      {TABS.map((tab) => {
        const count = orders.filter((order) => orderMatchesTab(order, tab.id)).length;

        // Hide empty groups (except All and the active one).
        if (count === 0 && tab.id !== "all" && tab.id !== value) {
          return null;
        }

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={value === tab.id}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

const saleOf = (order: OrderDetails) =>
  (order.productDiscount ?? 0) + (order.couponDiscount ?? 0);

/** Savings recap, invoice-on-WhatsApp, share and cancelled-unpaid explainer. */
export function OrderSalesExtras({
  order,
  authToken,
}: {
  order: OrderDetails;
  authToken: string | null;
}) {
  const [sending, setSending] = useState(false);

  const saved = saleOf(order);
  const paid = order.paymentStatus === "paid";
  const cancelled = order.status === "cancelled";
  const canInvoice = !cancelled && (paid || order.paymentMethod === "cod");

  const shareText = encodeURIComponent(
    `I just ordered from AAYESHA FASHION! ${
      typeof window !== "undefined" ? window.location.origin : ""
    }`,
  );

  async function handleInvoice() {
    if (!authToken || sending) return;

    setSending(true);

    try {
      await sendMyInvoice(order.orderNumber, authToken);
      toast.success("Invoice sent to your WhatsApp.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send the invoice.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {saved > 0 && !cancelled ? (
        <p className="order-note">
          You saved <strong>{money(saved)}</strong> on this order.
        </p>
      ) : null}

      {cancelled && order.paymentStatus !== "paid" ? (
        <p className="order-note">
          This order was cancelled because payment was not received in time.
          Your items are not lost — use Buy again to place it afresh.
        </p>
      ) : null}

      {canInvoice || !cancelled ? (
        <div className="order-extras">
          {canInvoice ? (
            <button type="button" onClick={handleInvoice} disabled={sending}>
              {sending ? "Sending…" : "Get invoice on WhatsApp"}
            </button>
          ) : null}

          {!cancelled ? (
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
            >
              Tell a friend
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
