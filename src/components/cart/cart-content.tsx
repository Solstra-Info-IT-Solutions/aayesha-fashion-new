"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
  type Cart,
} from "@/services/cart.service";

import "./CartContent.css";

export function CartContent() {
  const [cart, setCart] = useState<Cart | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [updatingProductId, setUpdatingProductId] =
    useState<string | null>(null);

  const [removingProductId, setRemovingProductId] =
    useState<string | null>(null);

  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setIsLoading(true);

      try {
        const response = await getCart();

        if (cancelled) {
          return;
        }

        setCart(response);
      } catch (error) {
        console.error("LOAD CART ERROR:", error);

        if (!cancelled) {
          setCart(null);
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

  const cartItems = cart?.items ?? [];

  const summary = useMemo(() => {
    return cartItems.reduce(
      (result, item) => {
        const product = item.product;

        if (!product) {
          return result;
        }

        const quantity = item.quantity;
        const sellingPrice = product.pricing.sellingPrice;
        const mrp = product.pricing.mrp;

        result.itemCount += quantity;
        result.subtotal += sellingPrice * quantity;
        result.mrpTotal += mrp * quantity;

        return result;
      },
      {
        itemCount: 0,
        subtotal: 0,
        mrpTotal: 0,
      },
    );
  }, [cartItems]);

  const savings = Math.max(
    0,
    summary.mrpTotal - summary.subtotal,
  );

  const formatPrice = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const handleUpdateQuantity = async (
    productId: string,
    quantity: number,
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingProductId(productId);

      const response = await updateCartItem(
        productId,
        quantity,
      );

      setCart(response);

      toast.success("Cart updated.");
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update cart.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemoveItem = async (
    productId: string,
  ) => {
    try {
      setRemovingProductId(productId);

      const response =
        await removeFromCart(productId);

      setCart(response);

      toast.success("Removed from bag.");
    } catch (error) {
      console.error(
        "REMOVE FROM CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove item.",
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsClearing(true);

      const response = await clearCart();

      setCart(response);

      toast.success("Your bag has been cleared.");
    } catch (error) {
      console.error("CLEAR CART ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to clear your bag.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <section className="cart-page cart-page--loading">
        <div className="cart-page__container">
          <div className="cart-page__loading-header">
            <div className="cart-skeleton cart-skeleton--eyebrow" />
            <div className="cart-skeleton cart-skeleton--title" />
          </div>

          <div className="cart-page__loading-layout">
            <div className="cart-page__loading-items">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="cart-loading-item"
                >
                  <div className="cart-skeleton cart-skeleton--image" />

                  <div className="cart-loading-item__content">
                    <div className="cart-skeleton cart-skeleton--small" />
                    <div className="cart-skeleton cart-skeleton--product-title" />
                    <div className="cart-skeleton cart-skeleton--meta" />
                    <div className="cart-skeleton cart-skeleton--price" />
                    <div className="cart-skeleton cart-skeleton--quantity" />
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-skeleton cart-skeleton--summary" />
          </div>
        </div>
      </section>
    );
  }

  if (!cartItems.length) {
    return (
      <section className="cart-page cart-page--empty">
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <ShoppingBag
              size={24}
              strokeWidth={1.25}
            />
          </div>

          <p className="cart-eyebrow">
            Your Aayesha edit
          </p>

          <h1 className="cart-empty__title">
            Your bag is empty.
          </h1>

          <p className="cart-empty__description">
            Discover thoughtfully designed pieces from
            the latest Aayesha collection.
          </p>

          <Link
            href="/shop"
            className="cart-button cart-button--primary"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-page__container">
        {/* HEADER */}

        <header className="cart-header">
          <Link
            href="/shop"
            className="cart-header__back"
          >
            <ChevronLeft
              size={16}
              strokeWidth={1.4}
            />

            <span>Continue Shopping</span>
          </Link>

          <div className="cart-header__main">
            <div>
              <p className="cart-eyebrow">
                Aayesha Fashion
              </p>

              <h1 className="cart-header__title">
                Your Bag
              </h1>
            </div>

            <div className="cart-header__meta">
              <p>
                {summary.itemCount}{" "}
                {summary.itemCount === 1
                  ? "item"
                  : "items"}
              </p>

              {savings > 0 && (
                <span>
                  You save {formatPrice(savings)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}

        <div className="cart-layout">
          {/* ITEMS */}

          <section className="cart-items">
            <div className="cart-items__list">
              {cartItems.map((item) => {
                const product = item.product;

                if (!product) {
                  return null;
                }

                const availableStock = Math.max(
                  0,
                  product.inventory.stock -
                    product.inventory.reserved,
                );

                const price =
                  product.pricing.sellingPrice;

                const mrp = product.pricing.mrp;

                const discount =
                  mrp > 0
                    ? Math.round(
                        ((mrp - price) / mrp) *
                          100,
                      )
                    : 0;

                const itemTotal =
                  price * item.quantity;

                const media =
                  product.media.find(
                    (mediaItem) =>
                      mediaItem.type === "image",
                  ) ?? product.media[0];

                const isUpdating =
                  updatingProductId ===
                  item.productId;

                const isRemoving =
                  removingProductId ===
                  item.productId;

                return (
                  <article
                    key={item.productId}
                    className="cart-item"
                  >
                    {/* IMAGE */}

                    <Link
                      href={`/products/${product._id}`}
                      className="cart-item__image"
                    >
                      {media?.url ? (
                        <Image
                          src={media.url}
                          alt={
                            media.alt ??
                            product.name
                          }
                          fill
                          sizes="(max-width: 639px) 112px, (max-width: 1023px) 150px, 180px"
                          className="cart-item__image-element"
                        />
                      ) : (
                        <div className="cart-item__image-placeholder">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* DETAILS */}

                    <div className="cart-item__details">
                      <div className="cart-item__top">
                        <div className="cart-item__identity">
                          <p className="cart-item__label">
                            Product
                          </p>

                          <Link
                            href={`/products/${product._id}`}
                            className="cart-item__name"
                          >
                            {product.name}
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            void handleRemoveItem(
                              item.productId,
                            )
                          }
                          disabled={isRemoving}
                          aria-label={`Remove ${product.name}`}
                          className="cart-item__remove"
                        >
                          <Trash2
                            size={17}
                            strokeWidth={1.35}
                          />
                        </button>
                      </div>

                      <p className="cart-item__sku">
                        SKU: {product.id}
                      </p>

                      <div className="cart-item__pricing">
                        <span className="cart-item__price">
                          {formatPrice(price)}
                        </span>

                        {mrp > price && (
                          <>
                            <span className="cart-item__mrp">
                              {formatPrice(mrp)}
                            </span>

                            {discount > 0 && (
                              <span className="cart-item__discount">
                                {discount}% Off
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="cart-item__bottom">
                        <div className="cart-item__quantity">
                          <p className="cart-item__label">
                            Quantity
                          </p>

                          <div className="cart-quantity">
                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity -
                                    1,
                                )
                              }
                              disabled={
                                item.quantity <=
                                  1 ||
                                isUpdating ||
                                isRemoving
                              }
                              aria-label="Decrease quantity"
                              className="cart-quantity__button"
                            >
                              <Minus
                                size={14}
                                strokeWidth={1.4}
                              />
                            </button>

                            <span className="cart-quantity__value">
                              {isUpdating
                                ? "..."
                                : item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                void handleUpdateQuantity(
                                  item.productId,
                                  item.quantity +
                                    1,
                                )
                              }
                              disabled={
                                availableStock <=
                                  item.quantity ||
                                isUpdating ||
                                isRemoving
                              }
                              aria-label="Increase quantity"
                              className="cart-quantity__button"
                            >
                              <Plus
                                size={14}
                                strokeWidth={1.4}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item__total">
                          <p className="cart-item__label">
                            Item Total
                          </p>

                          <p>
                            {formatPrice(itemTotal)}
                          </p>
                        </div>
                      </div>

                      {availableStock > 0 &&
                        availableStock <=
                          product.inventory
                            .lowStockThreshold && (
                          <p className="cart-item__notice cart-item__notice--warning">
                            Only {availableStock} left
                          </p>
                        )}

                      {availableStock === 0 && (
                        <p className="cart-item__notice cart-item__notice--error">
                          This product is currently
                          unavailable.
                        </p>
                      )}

                      {item.quantity >
                        availableStock &&
                        availableStock > 0 && (
                          <p className="cart-item__notice cart-item__notice--error">
                            Only {availableStock} units are
                            currently available. Please
                            reduce the quantity.
                          </p>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                void handleClearCart()
              }
              disabled={isClearing}
              className="cart-clear"
            >
              {isClearing
                ? "Clearing..."
                : "Clear Bag"}
            </button>
          </section>

          {/* SUMMARY */}

          <aside className="cart-summary">
            <div className="cart-summary__card">
              <div className="cart-summary__heading">
                <p className="cart-eyebrow">
                  Order Summary
                </p>

                <h2>Review your selection</h2>
              </div>

              <div className="cart-summary__rows">
                <SummaryRow
                  label="MRP Total"
                  value={formatPrice(
                    summary.mrpTotal,
                  )}
                />

                {savings > 0 && (
                  <SummaryRow
                    label="Product Discount"
                    value={`- ${formatPrice(
                      savings,
                    )}`}
                    valueClassName="cart-summary__value--success"
                  />
                )}

                <SummaryRow
                  label="Shipping"
                  value="Calculated at checkout"
                  valueClassName="cart-summary__value--muted"
                />
              </div>

              <div className="cart-summary__total">
                <div>
                  <p>Subtotal</p>

                  <span>
                    Inclusive of applicable taxes
                  </span>
                </div>

                <strong>
                  {formatPrice(summary.subtotal)}
                </strong>
              </div>

              <Link
                href="/checkout"
                className="cart-button cart-button--checkout"
              >
                Proceed to Checkout
              </Link>

              <p className="cart-summary__secure">
                Secure checkout · Payment and delivery
                options available at checkout
              </p>
            </div>

            <div className="cart-care">
              <p className="cart-care__title">
                Aayesha Care
              </p>

              <p className="cart-care__description">
                Your selected product is preserved in
                your bag. Final inventory availability is
                confirmed before order placement.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="cart-summary__row">
      <span>{label}</span>

      <strong className={valueClassName}>
        {value}
      </strong>
    </div>
  );
}