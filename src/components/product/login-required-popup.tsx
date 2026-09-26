"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  ArrowUpRight,
  Heart,
  LogIn,
  ShoppingBag,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import "./LoginRequiredPopup.css";

/* =========================================================
   TYPES
========================================================= */

export type LoginRequiredAction =
  | "cart"
  | "wishlist";

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;

  /**
   * Defaults to "cart".
   *
   * Use actionType="wishlist" only when the popup
   * is triggered from wishlist functionality.
   */
  actionType?: LoginRequiredAction;
};

/* =========================================================
   COMPONENT
========================================================= */

export function LoginRequiredPopup({
  open,
  onClose,
  actionType = "cart",
}: LoginRequiredPopupProps) {
  const router = useRouter();

  const [mounted, setMounted] =
    useState(false);

  /* =======================================================
     PORTAL MOUNT
  ======================================================= */

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /* =======================================================
     ESCAPE + BODY LOCK
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, onClose]);

  /* =======================================================
     CONTENT
  ======================================================= */

  const isWishlist =
    actionType === "wishlist";

  const title = isWishlist
    ? "Login to Save"
    : "Login Required";

  const description = isWishlist
    ? "Please login to your account to save this piece to your wishlist."
    : "Please login to your account to add products to your shopping bag.";

  const eyebrow = isWishlist
    ? "Save your favourites"
    : "Continue your shopping";

  const primaryLabel = isWishlist
    ? "Login to Save"
    : "Login to Continue";

  const secondaryLabel = isWishlist
    ? "Continue Browsing"
    : "Continue Shopping";

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = () => {
    onClose();

    router.push("/login");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  if (!open || !mounted) {
    return null;
  }

  const popup = (
    <div
      className="login-required-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={onClose}
    >
      {/* =================================================
          DIALOG
      ================================================= */}

      <div
        className="login-required-popup__dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <div
          className="login-required-popup__accent"
          aria-hidden="true"
        />

        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="login-required-popup__close"
        >
          <X
            className="login-required-popup__close-icon"
            size={17}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="login-required-popup__content">
          {/* BRAND */}

          <p className="login-required-popup__eyebrow">
            AAYESHA FASHION
          </p>

          {/* ICON */}

          <div
            className={[
              "login-required-popup__icon",
              isWishlist
                ? "login-required-popup__icon--wishlist"
                : "login-required-popup__icon--cart",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
          >
            {isWishlist ? (
              <Heart
                size={20}
                strokeWidth={1.35}
              />
            ) : (
              <ShoppingBag
                size={20}
                strokeWidth={1.35}
              />
            )}
          </div>

          {/* DECORATIVE MARK */}

          <div
            className="login-required-popup__mark"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>

          {/* TITLE */}

          <h2
            id="login-required-title"
            className="login-required-popup__title"
          >
            {title}
          </h2>

          {/* DESCRIPTION */}

          <p className="login-required-popup__description">
            {description}
          </p>

          {/* CONTEXT */}

          <p className="login-required-popup__context">
            {eyebrow}
          </p>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="login-required-popup__actions">
          {/* LOGIN */}

          <button
            type="button"
            onClick={handleLogin}
            className="login-required-popup__button login-required-popup__button--primary"
          >
            <span className="login-required-popup__button-content">
              <span>
                {primaryLabel}
              </span>

              <span
                className="login-required-popup__button-icon"
                aria-hidden="true"
              >
                <LogIn
                  size={14}
                  strokeWidth={1.4}
                />
              </span>
            </span>

            <ArrowUpRight
              className="login-required-popup__button-arrow"
              size={15}
              strokeWidth={1.35}
              aria-hidden="true"
            />
          </button>

          {/* CONTINUE */}

          <button
            type="button"
            onClick={onClose}
            className="login-required-popup__button login-required-popup__button--secondary"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    popup,
    document.body,
  );
}