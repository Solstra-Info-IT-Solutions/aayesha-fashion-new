"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Clock3, MessageCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { siteConfig } from "@/config/site";
import {
  claimBankUpiPayment,
  resendBankUpiBill,
} from "@/lib/api/payments";

import "./OrdersSales.css";

interface PendingPaymentPanelProps {
  orderNumber: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  paymentExpiresAt?: string | null;
  paymentClaimedAt?: string | null;
  paymentWhatsapp?: string;
  /** Access token of the order (guest / just checked out). */
  publicAccessToken?: string | null;
  /** Signed-in customer's token. */
  authToken?: string | null;
  /** Reload the order after a change or when time runs out. */
  onChanged: () => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));

  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/**
 * Shown while a Bank / UPI order waits for payment: live countdown to
 * the automatic cancellation, resend-bill, and "I have paid" with the
 * UTR so the store can verify quickly.
 */
export function PendingPaymentPanel({
  orderNumber,
  paymentMethod,
  paymentStatus,
  status,
  paymentExpiresAt,
  paymentClaimedAt,
  paymentWhatsapp,
  publicAccessToken,
  authToken,
  onChanged,
}: PendingPaymentPanelProps) {
  const awaiting =
    paymentMethod === "bank_upi" &&
    paymentStatus === "pending" &&
    status !== "cancelled" &&
    Boolean(paymentExpiresAt);

  const expiresAt = paymentExpiresAt ? new Date(paymentExpiresAt).getTime() : 0;

  const [remaining, setRemaining] = useState(() =>
    Math.max(0, expiresAt - Date.now()),
  );
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState<"" | "claim" | "resend">("");

  useEffect(() => {
    if (!awaiting) return;

    const tick = () => setRemaining(Math.max(0, expiresAt - Date.now()));
    const timer = window.setInterval(tick, 1000);

    return () => window.clearInterval(timer);
  }, [awaiting, expiresAt]);

  if (!awaiting) {
    return null;
  }

  const expired = remaining <= 0;
  const urgent = !expired && remaining < 5 * 60_000;

  async function claim(event: FormEvent) {
    event.preventDefault();

    if (busy) return;

    if (reference.trim().length < 6) {
      toast.error("Enter the UTR / transaction reference from your payment.");
      return;
    }

    try {
      setBusy("claim");

      await claimBankUpiPayment({
        orderNumber,
        reference: reference.trim(),
        publicAccessToken,
        authToken,
      });

      toast.success("Thank you! We will verify your payment shortly.");
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your payment.",
      );
    } finally {
      setBusy("");
    }
  }

  async function resend() {
    if (busy) return;

    try {
      setBusy("resend");

      await resendBankUpiBill({ orderNumber, publicAccessToken, authToken });

      toast.success("We have sent the bill to your WhatsApp again.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to resend the bill.",
      );
    } finally {
      setBusy("");
    }
  }

  const help = `https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(
    `Hi Aayesha Fashion, I need help with the payment for order ${orderNumber}.`,
  )}`;

  return (
    <section
      className={
        urgent
          ? "pay-panel pay-panel--urgent"
          : paymentClaimedAt
            ? "pay-panel pay-panel--claimed"
            : "pay-panel"
      }
      aria-live="polite"
    >
      <div className="pay-panel__head">
        <Clock3 size={18} strokeWidth={1.5} aria-hidden="true" />

        <div>
          <p className="pay-panel__title">
            {paymentClaimedAt
              ? "We are verifying your payment"
              : expired
                ? "Payment time is over"
                : "Complete your payment"}
          </p>

          <p className="pay-panel__text">
            {paymentClaimedAt
              ? "Thanks for sending your payment details. We will confirm your order as soon as we see the payment."
              : expired
                ? "This order is being cancelled because the payment was not received in time. You can place a new order any time."
                : `Your bill with the UPI QR code was sent on WhatsApp${paymentWhatsapp ? ` to ${paymentWhatsapp}` : ""}. Pay before the timer ends or the order is cancelled automatically.`}
          </p>
        </div>

        {!paymentClaimedAt && !expired ? (
          <p className="pay-panel__timer" aria-label="Time left to pay">
            {formatRemaining(remaining)}
          </p>
        ) : null}
      </div>

      {!paymentClaimedAt && !expired ? (
        <form className="pay-panel__form" onSubmit={claim}>
          <label htmlFor={`utr-${orderNumber}`}>Already paid? Enter your UTR</label>

          <div>
            <input
              id={`utr-${orderNumber}`}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="UTR / transaction ID"
              maxLength={80}
              autoComplete="off"
            />

            <button type="submit" disabled={busy !== ""}>
              {busy === "claim" ? "Saving…" : "I have paid"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="pay-panel__actions">
        {!paymentClaimedAt && !expired ? (
          <button type="button" onClick={() => void resend()} disabled={busy !== ""}>
            <MessageCircle size={14} />
            {busy === "resend" ? "Sending…" : "Resend bill on WhatsApp"}
          </button>
        ) : null}

        <a href={help} target="_blank" rel="noreferrer">
          Need help? Chat with us
        </a>

        {expired ? (
          <button type="button" onClick={onChanged}>
            <RefreshCw size={14} /> Refresh status
          </button>
        ) : null}
      </div>
    </section>
  );
}
