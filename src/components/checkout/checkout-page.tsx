"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getCart } from "@/services/cart.service";

import { CheckoutContact } from "@/components/checkout/checkout-contact";
import { CheckoutAddress } from "@/components/checkout/checkout-address";
import { CheckoutDelivery } from "@/components/checkout/checkout-delivery";
import { CheckoutPayment } from "@/components/checkout/checkout-payment";
import { CheckoutCoupon } from "@/components/checkout/checkout-coupon";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutPlaceOrder } from "@/components/checkout/checkout-place-order";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const [hasItems, setHasItems] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* ==========================================================
     LOAD CART FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        setHasItems(cart.items.length > 0);
      } catch (error) {
        console.error(
          "CHECKOUT CART ERROR:",
          error,
        );

        if (!cancelled) {
          setHasItems(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (isLoading) {
    return (
      <main className="checkout-page checkout-page--loading">
        <div className="checkout-page__container">
          <div className="checkout-page__loading-header">
            <div className="checkout-page__skeleton checkout-page__skeleton--eyebrow" />
            <div className="checkout-page__skeleton checkout-page__skeleton--title" />
            <div className="checkout-page__skeleton checkout-page__skeleton--description" />
          </div>

          <div className="checkout-page__loading-layout">
            <div className="checkout-page__loading-steps">
              <div className="checkout-page__skeleton checkout-page__skeleton--step" />
              <div className="checkout-page__skeleton checkout-page__skeleton--step" />
              <div className="checkout-page__skeleton checkout-page__skeleton--step" />
              <div className="checkout-page__skeleton checkout-page__skeleton--step" />
            </div>

            <div className="checkout-page__skeleton checkout-page__skeleton--summary" />
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!hasItems) {
    return (
      <main className="checkout-page checkout-page--empty">
        <div className="checkout-page__empty">
          <div className="checkout-page__empty-icon">
            <ShieldCheck
              size={22}
              strokeWidth={1.25}
            />
          </div>

          <p className="checkout-page__eyebrow">
            Checkout
          </p>

          <h1 className="checkout-page__empty-title">
            Your bag is empty.
          </h1>

          <p className="checkout-page__empty-description">
            Add something beautiful before continuing
            to checkout.
          </p>

          <Link
            href="/shop"
            className="checkout-page__primary-button"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     CHECKOUT
  ========================================================== */

  return (
    <main className="checkout-page">
      <div className="checkout-page__container">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="checkout-page__header">
          <div className="checkout-page__header-top">
            <Link
              href="/cart"
              className="checkout-page__back"
            >
              <ChevronLeft
                className="checkout-page__back-icon"
                size={16}
                strokeWidth={1.5}
              />

              <span>Back to Bag</span>
            </Link>

            <div className="checkout-page__secure">
              <ShieldCheck
                size={16}
                strokeWidth={1.4}
              />

              <span>Secure Checkout</span>
            </div>
          </div>

          <div className="checkout-page__heading">
            <p className="checkout-page__eyebrow">
              Aayesha Fashion
            </p>

            <h1 className="checkout-page__title">
              Checkout
            </h1>

            <p className="checkout-page__description">
              Complete your details below to place
              your order with Aayesha Fashion.
            </p>
          </div>
        </header>

        {/* ====================================================
            CHECKOUT BODY
        ==================================================== */}

        <div className="checkout-page__layout">
          {/* LEFT — CHECKOUT STEPS */}

          <div className="checkout-page__steps">
            <CheckoutContact />

            <CheckoutAddress />

            <CheckoutDelivery />

            <CheckoutPayment />

            <CheckoutCoupon />

            <CheckoutPlaceOrder />
          </div>

          {/* RIGHT — ORDER SUMMARY */}

          <aside className="checkout-page__summary">
            <CheckoutSummary />
          </aside>
        </div>
      </div>
    </main>
  );
}