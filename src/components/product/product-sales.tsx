"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  BellRing,
  MessageCircle,
  ShieldCheck,
  Truck,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import { Stars } from "@/components/product/product-reviews";
import { siteConfig } from "@/config/site";
import { getProductReviews } from "@/lib/api/reviews";
import {
  getProductSocialProof,
  subscribeStockAlert,
} from "@/lib/api/product-sales";
import { useAuthStore } from "@/store/auth-store";

import "./ProductSales.css";

/** Standard delivery is free from this order value (same rule as checkout). */
export const FREE_SHIPPING_THRESHOLD = 2999;

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/* =========================================================
   RATING SUMMARY (under the title)
========================================================= */

export function ProductRatingSummary({ productId }: { productId: string }) {
  const [summary, setSummary] = useState<{
    average: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProductReviews(productId)
      .then((result) => {
        if (!cancelled) setSummary(result.summary);
      })
      .catch(() => {
        /* no rating shown */
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (!summary || summary.total === 0) {
    return null;
  }

  return (
    <a href="#reviews" className="product-sales__rating">
      <Stars value={summary.average} size={15} />

      <span>
        {summary.average.toFixed(1)} · {summary.total} review
        {summary.total === 1 ? "" : "s"}
      </span>
    </a>
  );
}

/* =========================================================
   SOCIAL PROOF — real purchases only
========================================================= */

export function ProductSocialProof({ productId }: { productId: string }) {
  const [sold, setSold] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getProductSocialProof(productId)
      .then((result) => {
        if (!cancelled) setSold(result.soldLast7Days);
      })
      .catch(() => {
        /* nothing shown */
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Only show once the number is meaningful.
  if (sold < 3) {
    return null;
  }

  return (
    <p className="product-sales__proof">
      <TrendingUp size={15} strokeWidth={1.6} />
      <span>
        <strong>{sold}</strong> bought in the last 7 days
      </span>
    </p>
  );
}

/* =========================================================
   SAVINGS + FREE SHIPPING PROGRESS
========================================================= */

export function ProductSavings({
  mrp,
  price,
  quantity,
}: {
  mrp: number;
  price: number;
  quantity: number;
}) {
  const saving = Math.max(0, (mrp - price) * quantity);
  const subtotal = price * quantity;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="product-sales__savings">
      {saving > 0 ? (
        <p className="product-sales__save">
          You save <strong>{money(saving)}</strong> on this order
        </p>
      ) : null}

      <div className="product-sales__ship">
        <Truck size={15} strokeWidth={1.5} />

        <div>
          <p>
            {remaining > 0 ? (
              <>
                Add <strong>{money(remaining)}</strong> more for free shipping
              </>
            ) : (
              <strong>You get free shipping on this order</strong>
            )}
          </p>

          <span className="product-sales__bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT ASSURANCE + WHATSAPP
========================================================= */

export function ProductAssurance({
  productName,
  productUrlPath,
}: {
  productName: string;
  productUrlPath: string;
}) {
  const message = `Hi Aayesha Fashion, I'm interested in "${productName}". ${siteConfig.url}${productUrlPath}`;

  return (
    <div className="product-sales__assure">
      <p className="product-sales__pay">
        <ShieldCheck size={15} strokeWidth={1.5} />
        <span>
          Pay by <strong>UPI or bank transfer</strong>: we send the bill on WhatsApp.
          Easy returns on eligible orders.
        </span>
      </p>

      <a
        href={`https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className="product-sales__whatsapp"
      >
        <MessageCircle size={16} strokeWidth={1.6} />
        Questions? Chat with us on WhatsApp
      </a>
    </div>
  );
}

/* =========================================================
   NOTIFY ME WHEN BACK IN STOCK (sold-out products)
========================================================= */

export function NotifyMeForm({ productId }: { productId: string }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (busy) return;

    const value = (email || user?.email || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setBusy(true);

      await subscribeStockAlert(
        productId,
        { email: value, phone: user?.phone },
        accessToken,
      );

      setDone(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your request.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="product-sales__notify product-sales__notify--done">
        <BellRing size={16} /> Thank you! We will email you as soon as it is
        back in stock.
      </p>
    );
  }

  return (
    <form className="product-sales__notify" onSubmit={submit} noValidate>
      <p className="product-sales__notify-title">
        <BellRing size={16} /> Notify me when it is back
      </p>

      <div className="product-sales__notify-row">
        <input
          type="email"
          value={email}
          placeholder={user?.email || "Your email address"}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Notify me"}
        </button>
      </div>
    </form>
  );
}
