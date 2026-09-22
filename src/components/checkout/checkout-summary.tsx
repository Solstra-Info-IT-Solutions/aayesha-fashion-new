"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  getCart,
  type CartItem,
} from "@/services/cart.service";

import { useCheckoutStore } from "@/store/checkout-store";

import "./CheckoutSummary.css";

type CheckoutCartItem = CartItem;

export function CheckoutSummary() {
  const delivery = useCheckoutStore(
    (state) => state.delivery,
  );

  const couponCode = useCheckoutStore(
    (state) => state.couponCode,
  );

  const couponDiscount = useCheckoutStore(
    (state) => state.couponDiscount,
  );

  const couponShippingDiscount =
    useCheckoutStore(
      (state) => state.couponShippingDiscount,
    );

  const [items, setItems] = useState<
    CheckoutCartItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================================
     LOAD CART FROM BACKEND
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoading(true);

      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        setItems(cart.items);
      } catch (error) {
        console.error(
          "CHECKOUT CART ERROR:",
          error,
        );

        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     SUMMARY
  ========================================================== */

  let subtotal = 0;
  let mrpTotal = 0;

  for (const item of items) {
    const sellingPrice = Number(
      item.product.pricing.sellingPrice,
    );

    const mrp = Number(
      item.product.pricing.mrp,
    );

    subtotal +=
      sellingPrice * item.quantity;

    mrpTotal +=
      mrp * item.quantity;
  }

  const baseShipping =
    delivery === "express"
      ? 199
      : subtotal >= 2999
        ? 0
        : 99;

  const shipping = Math.max(
    0,
    baseShipping -
      couponShippingDiscount,
  );

  const productSavings = Math.max(
    0,
    mrpTotal - subtotal,
  );

  const total = Math.max(
    0,
    subtotal +
      shipping -
      couponDiscount,
  );

  return (
    <aside className="checkout-summary">
      <div className="checkout-summary__card">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="checkout-summary__header">
          <p className="checkout-summary__eyebrow">
            Order Summary
          </p>

          <h2 className="checkout-summary__title">
            Your Ayesha edit
          </h2>

          <p className="checkout-summary__description">
            A final look at everything in your bag.
          </p>
        </header>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <div className="checkout-summary__products">
          {loading ? (
            <CheckoutItemsSkeleton />
          ) : items.length ? (
            items.map((item) => {
              const product = item.product;

              const sellingPrice =
                Number(
                  product.pricing
                    .sellingPrice,
                );

              const mrp = Number(
                product.pricing.mrp,
              );

              const image =
                product.media.find(
                  (media) =>
                    media.type ===
                    "image",
                ) ??
                product.media[0];

              return (
                <div
                  key={item.productId}
                  className="checkout-summary__product"
                >
                  {/* IMAGE */}

                  <div className="checkout-summary__image">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={
                          image.alt ??
                          product.name
                        }
                        fill
                        className="checkout-summary__product-image"
                        sizes="76px"
                      />
                    ) : (
                      <div className="checkout-summary__no-image">
                        No image
                      </div>
                    )}

                    <span className="checkout-summary__quantity">
                      {item.quantity}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="checkout-summary__product-details">
                    <p className="checkout-summary__product-name">
                      {product.name}
                    </p>

                    <p className="checkout-summary__product-type">
                      Product
                    </p>

                    <div className="checkout-summary__product-price-row">
                      <p className="checkout-summary__selling-price">
                        ₹
                        {sellingPrice.toLocaleString(
                          "en-IN",
                        )}
                      </p>

                      {mrp >
                      sellingPrice ? (
                        <p className="checkout-summary__mrp">
                          ₹
                          {mrp.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      ) : null}
                    </div>

                    <p className="checkout-summary__product-quantity">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="checkout-summary__empty">
              <p className="checkout-summary__empty-title">
                Your bag is empty.
              </p>

              <p className="checkout-summary__empty-copy">
                Add something beautiful to continue.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            TOTALS
        =================================================== */}

        <div className="checkout-summary__totals">
          <SummaryRow
            label="MRP Total"
            value={`₹${mrpTotal.toLocaleString(
              "en-IN",
            )}`}
          />

          {productSavings > 0 ? (
            <SummaryRow
              label="Product Discount"
              value={`- ₹${productSavings.toLocaleString(
                "en-IN",
              )}`}
              valueClass="checkout-summary__value--success"
            />
          ) : null}

          {couponDiscount > 0 &&
          couponCode ? (
            <SummaryRow
              label={`Coupon (${couponCode.toUpperCase()})`}
              value={`- ₹${couponDiscount.toLocaleString(
                "en-IN",
              )}`}
              valueClass="checkout-summary__value--success"
            />
          ) : null}

          {couponShippingDiscount >
            0 &&
          couponCode ? (
            <SummaryRow
              label={`Shipping Discount (${couponCode.toUpperCase()})`}
              value={`- ₹${couponShippingDiscount.toLocaleString(
                "en-IN",
              )}`}
              valueClass="checkout-summary__value--success"
            />
          ) : null}

          <SummaryRow
            label="Delivery"
            value={
              shipping === 0
                ? "Free"
                : `₹${shipping.toLocaleString(
                    "en-IN",
                  )}`
            }
          />

          {/* TOTAL */}

          <div className="checkout-summary__total">
            <div className="checkout-summary__total-copy">
              <p className="checkout-summary__total-eyebrow">
                Total
              </p>

              <p className="checkout-summary__total-note">
                Inclusive of applicable taxes
              </p>
            </div>

            <p className="checkout-summary__total-value">
              ₹
              {total.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SAVINGS CALLOUT
      ===================================================== */}

      {productSavings > 0 ? (
        <div className="checkout-summary__savings">
          <p className="checkout-summary__savings-eyebrow">
            You&apos;re saving
          </p>

          <p className="checkout-summary__savings-value">
            ₹
            {productSavings.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
      ) : null}
    </aside>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="checkout-summary__row">
      <span className="checkout-summary__row-label">
        {label}
      </span>

      <span
        className={[
          "checkout-summary__row-value",
          valueClass,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function CheckoutItemsSkeleton() {
  return (
    <>
      {Array.from({
        length: 2,
      }).map((_, index) => (
        <div
          key={index}
          className="checkout-summary__product checkout-summary__product--skeleton"
        >
          <div className="checkout-summary__skeleton-image" />

          <div className="checkout-summary__skeleton-content">
            <div className="checkout-summary__skeleton-line checkout-summary__skeleton-line--name" />

            <div className="checkout-summary__skeleton-line checkout-summary__skeleton-line--type" />

            <div className="checkout-summary__skeleton-line checkout-summary__skeleton-line--price" />
          </div>
        </div>
      ))}
    </>
  );
}