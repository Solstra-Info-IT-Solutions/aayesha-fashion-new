"use client";

import { useState } from "react";

import {
  ArrowUpRight,
  Check,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

import "./AddToCartButton.css";

/* =========================================================
   TYPES
========================================================= */

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  quantity?: number;
  fullWidth?: boolean;
};

/* =========================================================
   COMPONENT
========================================================= */

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  fullWidth = true,
}: AddToCartButtonProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [adding, setAdding] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = async () => {
    if (adding) {
      return;
    }

    /*
     * Wait until authentication state
     * has been initialized.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Cart requires an authenticated user.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setAdding(true);
      setAdded(false);

      await addToCart(
        productId,
        quantity,
      );

      setAdded(true);

      toast.success(
        quantity > 1
          ? `${quantity} × ${productName} added to your bag`
          : `${productName} added to your bag`,
      );

      /*
       * Return to the normal button
       * state after a short confirmation.
       */
      window.setTimeout(() => {
        setAdded(false);
      }, 1600);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAdding(false);
    }
  };

  /* =======================================================
     BUTTON CLASS
  ======================================================= */

  const buttonClassName = [
    "add-to-cart-button",

    fullWidth
      ? "add-to-cart-button--full"
      : "add-to-cart-button--auto",

    adding
      ? "add-to-cart-button--loading"
      : "",

    added
      ? "add-to-cart-button--added"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <button
        type="button"
        onClick={() =>
          void handleAddToCart()
        }
        disabled={
          adding ||
          !isInitialized
        }
        aria-busy={adding}
        aria-label={
          adding
            ? "Adding product to bag"
            : added
              ? "Product added to bag"
              : "Add product to bag"
        }
        className={buttonClassName}
      >
        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <span className="add-to-cart-button__content">

          <span
            className="add-to-cart-button__icon-wrap"
            aria-hidden="true"
          >
            {adding ? (
              <Loader2
                className="add-to-cart-button__icon add-to-cart-button__icon--loading"
                size={16}
                strokeWidth={1.5}
              />
            ) : added ? (
              <Check
                className="add-to-cart-button__icon"
                size={16}
                strokeWidth={1.7}
              />
            ) : (
              <ShoppingBag
                className="add-to-cart-button__icon"
                size={16}
                strokeWidth={1.35}
              />
            )}
          </span>

          <span className="add-to-cart-button__label">
            {adding
              ? "Adding..."
              : added
                ? "Added to Bag"
                : "Add to Bag"}
          </span>

        </span>

        {/* =================================================
            ACTION ICON
        ================================================= */}

        <span
          className="add-to-cart-button__arrow"
          aria-hidden="true"
        >
          <ArrowUpRight
            size={15}
            strokeWidth={1.35}
          />
        </span>
      </button>

      {/* ===================================================
          LOGIN REQUIRED
      =================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />
    </>
  );
}