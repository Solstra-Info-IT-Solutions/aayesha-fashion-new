"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/types/product";

import { WishlistButton } from "@/components/product/wishlist-button";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";
import { AddToBagPopup } from "@/components/product/add-to-bag-popup";

import {
  getDiscountPercentage,
  getProductAvailability,
  getPrimaryProductMedia,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatBadge(badge: string) {
  return badge
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const [isAdding, setIsAdding] = useState(false);

  const [showAddedPopup, setShowAddedPopup] = useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const availability = getProductAvailability(product);

  /* =======================================================
     PRODUCT MEDIA
  ======================================================= */

  const primaryMedia = getPrimaryProductMedia(product);

  const secondaryMedia = product.media.find(
    (media) =>
      media.type === "image" &&
      media.id !== primaryMedia?.id,
  );

  if (!primaryMedia) {
    return null;
  }

  /* =======================================================
     PRICING
  ======================================================= */

  const discount = getDiscountPercentage(
    product.pricing,
  );

  /* =======================================================
     BADGE
  ======================================================= */

  const hasBadge =
    product.merchandising.badges.length > 0;

  /* =======================================================
     ADD TO BAG
  ======================================================= */

  const handleAddToBag = async () => {
    if (availability.isSoldOut || isAdding) {
      return;
    }

    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setIsAdding(true);

      await addToCart(product._id, 1);
       setShowAddedPopup(true);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
    } finally {
      setIsAdding(false);
    }
  };

  /* =======================================================
     BUTTON STATE
  ======================================================= */

  const buttonClassName = [
    "product-card__button",
    availability.isSoldOut
      ? "product-card__button--sold-out"
      : "",
    isAdding
      ? "product-card__button--loading"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

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
        {/* =====================================================
            PRODUCT IMAGE
        ===================================================== */}

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
                (max-width: 639px) 44vw,
                (max-width: 767px) 44vw,
                (max-width: 1023px) 30vw,
                (max-width: 1279px) 23vw,
                21vw
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
                  (max-width: 639px) 44vw,
                  (max-width: 767px) 44vw,
                  (max-width: 1023px) 30vw,
                  (max-width: 1279px) 23vw,
                  21vw
                "
                className="product-card__image product-card__image--secondary"
              />
            )}

            <span
              aria-hidden="true"
              className="product-card__image-overlay"
            />
          </Link>

          {/* BADGE */}

          {hasBadge && (
            <div className="product-card__badge">
              {formatBadge(
                product.merchandising.badges[0],
              )}
            </div>
          )}

          {/* WISHLIST */}

          <div className="product-card__wishlist">
            <WishlistButton
              productId={product._id}
              productName={product.name}
            />
          </div>

          {/* SOLD OUT IMAGE LABEL */}

          {availability.isSoldOut && (
            <div className="product-card__sold-out-label">
              Sold Out
            </div>
          )}
        </div>

        {/* =====================================================
            PRODUCT INFORMATION
        ===================================================== */}

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

          <div className="product-card__pricing">
            <span className="product-card__selling-price">
              {formatPrice(
                product.pricing.sellingPrice,
              )}
            </span>

            {discount > 0 && (
              <>
                <span className="product-card__mrp">
                  {formatPrice(
                    product.pricing.mrp,
                  )}
                </span>

                <span className="product-card__discount">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* ===================================================
              ADD TO BAG
          =================================================== */}

          <button
            type="button"
            onClick={handleAddToBag}
            disabled={
              availability.isSoldOut ||
              isAdding ||
              !isInitialized
            }
            className={buttonClassName}
          >
            <ShoppingBag
              className="product-card__button-icon"
              aria-hidden="true"
            />

            <span>
              {availability.isSoldOut
                ? "Sold Out"
                : isAdding
                  ? "Adding..."
                  : "Add to Bag"}
            </span>
          </button>
        </div>
      </article>

      {/* =====================================================
          LOGIN REQUIRED POPUP
      ===================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />


      <AddToBagPopup
        open={showAddedPopup}
        product={product}
        image={primaryMedia.url}
        onClose={() => setShowAddedPopup(false)}
      />
    </>
  );
}