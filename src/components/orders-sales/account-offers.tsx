"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Copy, Gift } from "lucide-react";
import toast from "react-hot-toast";

import {
  couponOffer,
  useAvailableCoupons,
} from "@/components/commerce/use-available-coupons";

import "./OrdersSales.css";
import "./AccountOffers.css";

/** Live offers on the account home so the customer has a reason to shop. */
export function AccountOffers() {
  const coupons = useAvailableCoupons();
  const [copied, setCopied] = useState("");

  if (coupons.length === 0) {
    return null;
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast.success(`Code ${code} copied. Apply it at checkout.`);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      toast.error("Unable to copy the code.");
    }
  }

  return (
    <section className="account-offers" aria-label="Offers for you">
      <div className="account-offers__head">
        <p>
          <Gift size={16} strokeWidth={1.5} /> Offers for you
        </p>

        <Link href="/account/coupons">
          All offers <ArrowRight size={13} />
        </Link>
      </div>

      <ul>
        {coupons.slice(0, 3).map((coupon) => (
          <li key={coupon.code}>
            <div>
              <strong>{couponOffer(coupon)}</strong>

              <span>
                {coupon.minimumOrderValue > 0
                  ? `On orders above ₹${coupon.minimumOrderValue.toLocaleString("en-IN")}`
                  : coupon.description || "Apply at checkout"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => void copy(coupon.code)}
              aria-label={`Copy coupon code ${coupon.code}`}
            >
              {coupon.code}
              {copied === coupon.code ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
