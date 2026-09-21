"use client";

import {
  useEffect,
  useState,
} from "react";

import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlist-store";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

import "./WishlistButton.css";

/* =========================================================
   TYPES
========================================================= */

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export function WishlistButton({
  productId,
  productName = "Product",
  className = "",
}: WishlistButtonProps) {
  /* =======================================================
     WISHLIST STATE
  ======================================================= */

  const isInWishlist = useWishlistStore(
    (state) =>
      state.productIds.includes(productId),
  );

  const toggle = useWishlistStore(
    (state) => state.toggle,
  );

  /* =======================================================
     AUTH STATE
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

  const [hydrated, setHydrated] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  /* =======================================================
     ACTIVE STATE
  ======================================================= */

  const active =
    hydrated && isInWishlist;

  /* =======================================================
     TOGGLE WISHLIST
  ======================================================= */

  const handleToggle = () => {
    /*
     * Wait until auth has been initialized.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Wishlist requires login.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    toggle(productId);
  };

  /* =======================================================
     CLASS
  ======================================================= */

  const buttonClassName = [
    "wishlist-button",
    active
      ? "wishlist-button--active"
      : "wishlist-button--inactive",
    className,
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
        onClick={handleToggle}
        disabled={!isInitialized}
        aria-label={
          active
            ? `Remove ${productName} from wishlist`
            : `Add ${productName} to wishlist`
        }
        aria-pressed={active}
        className={buttonClassName}
      >
        <Heart
          aria-hidden="true"
          size={18}
          strokeWidth={1.35}
          fill={
            active
              ? "currentColor"
              : "none"
          }
          className="wishlist-button__icon"
        />
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