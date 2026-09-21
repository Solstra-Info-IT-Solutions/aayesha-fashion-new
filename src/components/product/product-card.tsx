"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { Product } from "@/types/product";

import {
  getProductAvailability,
  getPrimaryProductMedia,
} from "@/types/product";

import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { WishlistButton } from "@/components/product/wishlist-button";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";
import { AddToBagPopup } from "@/components/product/add-to-bag-popup";
import { ProductPrice } from "@/components/product/product-price";

import "./ProductCard.css";

/* =========================================================
   TYPES
========================================================= */

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

/* =========================================================
   COMPONENT
========================================================= */

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const availability =
    getProductAvailability(product);

  const primaryMedia =
    getPrimaryProductMedia(product);

  const secondaryMedia = product.media.find(
    (media) =>
      media.type === "image" &&
      media.id !== primaryMedia?.id,
  );

  /* =======================================================
     AUTH
  ======================================================= */

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [cartQuantity, setCartQuantity] =
    useState(0);

  const [cartLoading, setCartLoading] =
    useState(false);

  const [cartInitialized, setCartInitialized] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const [showAddedPopup, setShowAddedPopup] =
    useState(false);

  /* =======================================================
     PRODUCT MEDIA SAFETY
  ======================================================= */

  if (!primaryMedia) {
    return null;
  }

  /* =======================================================
     BADGE
  ======================================================= */

  const hasBadge =
    product.merchandising.badges.length > 0;

  const badge =
    hasBadge
      ? product.merchandising.badges[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase(),
          )
      : null;

  /* =======================================================
     LOAD CART QUANTITY
  ======================================================= */

  const syncCartQuantity =
    useCallback(async () => {
      if (
        !isInitialized ||
        !isAuthenticated
      ) {
        setCartQuantity(0);
        setCartInitialized(true);
        return;
      }

      try {
        const cart = await getCart();

        const item = cart.items.find(
          (cartItem) =>
            cartItem.productId ===
            product._id,
        );

        setCartQuantity(
          item?.quantity ?? 0,
        );
      } catch (error) {
        console.error(
          "PRODUCT CARD CART SYNC ERROR:",
          error,
        );
      } finally {
        setCartInitialized(true);
      }
    }, [
      isAuthenticated,
      isInitialized,
      product._id,
    ]);

  useEffect(() => {
    void syncCartQuantity();
  }, [syncCartQuantity]);

  /* =======================================================
     LOGIN CHECK
  ======================================================= */

  const requireAuthentication =
    () => {
      if (!isInitialized) {
        return false;
      }

      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return false;
      }

      return true;
    };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = async () => {
    if (
      availability.isSoldOut ||
      availability.availableQuantity <= 0 ||
      cartLoading
    ) {
      return;
    }

    if (!requireAuthentication()) {
      return;
    }

    try {
      setCartLoading(true);

      const cart = await addToCart(
        product._id,
        1,
      );

      const item = cart.items.find(
        (cartItem) =>
          cartItem.productId ===
          product._id,
      );

      setCartQuantity(
        item?.quantity ?? 1,
      );

      setShowAddedPopup(true);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error,
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* =======================================================
     INCREASE
  ======================================================= */

  const handleIncrease = async () => {
    if (
      availability.isSoldOut ||
      cartLoading ||
      cartQuantity <= 0
    ) {
      return;
    }

    if (!requireAuthentication()) {
      return;
    }

    const nextQuantity =
      cartQuantity + 1;

    /*
     * Don't allow the card to exceed
     * the currently available inventory.
     */
    if (
      nextQuantity >
      availability.availableQuantity
    ) {
      return;
    }

    try {
      setCartLoading(true);

      const cart =
        await updateCartItem(
          product._id,
          nextQuantity,
        );

      const item = cart.items.find(
        (cartItem) =>
          cartItem.productId ===
          product._id,
      );

      setCartQuantity(
        item?.quantity ?? nextQuantity,
      );
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error,
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* =======================================================
     DECREASE
  ======================================================= */

  const handleDecrease = async () => {
    if (
      cartLoading ||
      cartQuantity <= 0
    ) {
      return;
    }

    if (!requireAuthentication()) {
      return;
    }

    try {
      setCartLoading(true);

      /*
       * Quantity 1 → remove product
       */
      if (cartQuantity === 1) {
        await removeFromCart(
          product._id,
        );

        setCartQuantity(0);

        return;
      }

      const nextQuantity =
        cartQuantity - 1;

      const cart =
        await updateCartItem(
          product._id,
          nextQuantity,
        );

      const item = cart.items.find(
        (cartItem) =>
          cartItem.productId ===
          product._id,
      );

      setCartQuantity(
        item?.quantity ?? nextQuantity,
      );
    } catch (error) {
      console.error(
        "UPDATE CART ERROR:",
        error,
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* =======================================================
     BUTTON STATE
  ======================================================= */

  const showQuantity =
    cartInitialized &&
    isAuthenticated &&
    cartQuantity > 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <article
        className={[
          "product-card",
          availability.isSoldOut
            ? "product-card--sold-out"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* =================================================
            MEDIA
        ================================================= */}

        <div className="product-card__media">
          <Link
            href={`/products/${product._id}`}
            aria-label={`View ${product.name}`}
            className="product-card__image-link"
          >
            <Image
              src={primaryMedia.src}
              alt={
                primaryMedia.alt ??
                product.name
              }
              fill
              priority={priority}
              sizes="
                (max-width: 639px) 46vw,
                (max-width: 1023px) 31vw,
                (max-width: 1279px) 24vw,
                22vw
              "
              className="product-card__image"
            />

            {secondaryMedia && (
              <Image
                src={secondaryMedia.src}
                alt={
                  secondaryMedia.alt ??
                  product.name
                }
                fill
                sizes="
                  (max-width: 639px) 46vw,
                  (max-width: 1023px) 31vw,
                  (max-width: 1279px) 24vw,
                  22vw
                "
                className="product-card__image product-card__image--secondary"
              />
            )}

            <span
              aria-hidden="true"
              className="product-card__image-shade"
            />
          </Link>

          {/* BADGE */}

          {badge && (
            <span className="product-card__badge">
              {badge}
            </span>
          )}

          {/* WISHLIST */}

          <div className="product-card__wishlist">
            <WishlistButton
              productId={product._id}
              productName={product.name}
            />
          </div>

          {/* SOLD OUT */}

          {availability.isSoldOut && (
            <div className="product-card__sold-out">
              SOLD OUT
            </div>
          )}

          {/* IMAGE LINK INDICATOR */}

          {!availability.isSoldOut && (
            <span
              aria-hidden="true"
              className="product-card__image-arrow"
            >
              ↗
            </span>
          )}
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="product-card__content">
          {/* PRODUCT NAME */}

          <Link
            href={`/products/${product._id}`}
            className="product-card__title-link"
          >
            <h3 className="product-card__title">
              {product.name}
            </h3>
          </Link>

          {/* PRICE */}

          <ProductPrice
            product={product}
          />

          {/* =================================================
              CART ACTION
          ================================================= */}

          {availability.isSoldOut ? (
            <button
              type="button"
              disabled
              className="product-card__cart-button product-card__cart-button--sold-out"
            >
              <span>SOLD OUT</span>
            </button>
          ) : showQuantity ? (
            <div
              className={[
                "product-card__quantity",
                cartLoading
                  ? "product-card__quantity--loading"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                onClick={() =>
                  void handleDecrease()
                }
                disabled={cartLoading}
                aria-label={`Decrease ${product.name} quantity`}
                className="product-card__quantity-button"
              >
                <Minus
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>

              <div
                className="product-card__quantity-value"
                aria-live="polite"
                aria-atomic="true"
              >
                <ShoppingBag
                  size={14}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />

                <span>
                  {cartQuantity}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  void handleIncrease()
                }
                disabled={
                  cartLoading ||
                  cartQuantity >=
                    availability.availableQuantity
                }
                aria-label={`Increase ${product.name} quantity`}
                className="product-card__quantity-button"
              >
                <Plus
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                void handleAddToCart()
              }
              disabled={
                cartLoading ||
                !isInitialized ||
                !cartInitialized
              }
              className={[
                "product-card__cart-button",
                cartLoading
                  ? "product-card__cart-button--loading"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="product-card__cart-button-main">
                <ShoppingBag
                  size={15}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />

                <span>
                  {cartLoading
                    ? "ADDING..."
                    : "ADD TO BAG"}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="product-card__cart-button-arrow"
              >
                ↗
              </span>
            </button>
          )}
        </div>
      </article>

      {/* =====================================================
          LOGIN REQUIRED
      ===================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />

      {/* =====================================================
          ADD TO BAG
      ===================================================== */}

      <AddToBagPopup
        open={showAddedPopup}
        product={product}
        image={primaryMedia.src}
        onClose={() =>
          setShowAddedPopup(false)
        }
      />
    </>
  );
}