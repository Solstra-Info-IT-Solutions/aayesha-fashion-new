"use client";

import { useState } from "react";

import { ShoppingBag } from "lucide-react";

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

      await addToCart(
        productId,
        quantity,
      );

      toast.success(
        quantity > 1
          ? `${quantity} × ${productName} added to your bag`
          : `${productName} added to your bag`,
      );
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
        className={buttonClassName}
      >
        <span className="add-to-cart-button__content">
          <ShoppingBag
            className="add-to-cart-button__icon"
            size={16}
            strokeWidth={1.35}
            aria-hidden="true"
          />

          <span className="add-to-cart-button__label">
            {adding
              ? "Adding..."
              : "Add to Bag"}
          </span>
        </span>

        <span
          className="add-to-cart-button__arrow"
          aria-hidden="true"
        >
          ↗
        </span>
      </button>

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />
    </>
  );
}