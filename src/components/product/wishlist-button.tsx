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
import { useIsClient } from "@/hooks/use-is-client";

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

  const hydrated = useIsClient();

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  /* =======================================================
     HYDRATION
  ======================================================= */

  /* =======================================================
     ACTIVE STATE
  ======================================================= */

  const active =
    hydrated && isInWishlist;

  /* =======================================================
     WISHLIST TOGGLE
  ======================================================= */

  const handleToggle = () => {
    /*
     * Wait until authentication state
     * has been initialized.
     */
    if (!isInitialized) {
      return;
    }

    /*
     * Wishlist requires authentication.
     */
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    /*
     * Toggle wishlist only when
     * the user is authenticated.
     */
    toggle(productId);
  };

  /* =======================================================
     BUTTON CLASS
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

      {/* ===================================================
          WISHLIST LOGIN POPUP
      =================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
        action="wishlist"
      />
    </>
  );
}