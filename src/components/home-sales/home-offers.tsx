"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

import {
  couponOffer,
  useAvailableCoupons,
} from "@/components/commerce/use-available-coupons";
import { Container } from "@/components/shared/container";

import "./HomeSales.css";

/** Live coupons as a band on the home page. Hidden when none are active. */
export function HomeOffers() {
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
    <section className="home-offers" aria-label="Current offers">
      <Container>
        <div className="home-offers__inner">
          <div className="home-offers__copy">
            <p className="home-offers__eyebrow">Offers for you</p>
            <h2>Save on your next piece</h2>
          </div>

          <ul className="home-offers__list">
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
                  {copied === coupon.code ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <Link href="/shop" className="home-offers__cta">
            Shop now <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
