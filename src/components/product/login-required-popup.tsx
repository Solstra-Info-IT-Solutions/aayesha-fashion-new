"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  ArrowRight,
  Heart,
  LogIn,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import "./LoginRequiredPopup.css";
import { useIsClient } from "@/hooks/use-is-client";

/* =========================================================
   TYPES
========================================================= */

export type LoginRequiredAction =
  | "cart"
  | "wishlist";

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;
  action?: LoginRequiredAction;
};

/* =========================================================
   COMPONENT
========================================================= */

export function LoginRequiredPopup({
  open,
  onClose,
  action = "cart",
}: LoginRequiredPopupProps) {
  const router = useRouter();

  const mounted = useIsClient();

  /* =======================================================
     PORTAL
  ======================================================= */

  /* =======================================================
     ESCAPE + BODY LOCK
  ======================================================= */

  useEffect(() => {
    if (!open) return;

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
    action === "wishlist";

  const Icon = isWishlist
    ? Heart
    : ShoppingBag;

  const title = isWishlist
    ? "Save your favourites"
    : "Continue with your shopping";

  const description = isWishlist
    ? "Sign in to save this beautiful piece to your personal wishlist and find it easily later."
    : "Sign in to your Aayesha Fashion account to add this piece to your shopping bag.";

  const eyebrow = isWishlist
    ? "Your personal collection"
    : "Your shopping bag";

  const primaryLabel = isWishlist
    ? "Login to save"
    : "Login to continue";

  const secondaryLabel = isWishlist
    ? "Keep browsing"
    : "Continue shopping";

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
      <div
        className={[
          "login-required-popup__dialog",
          isWishlist
            ? "login-required-popup__dialog--wishlist"
            : "login-required-popup__dialog--cart",
        ].join(" ")}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="login-required-popup__top">
          <div className="login-required-popup__brand">
            <span className="login-required-popup__brand-dot" />
            <span>AAYESHA</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="login-required-popup__close"
          >
            <X
              size={17}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* =================================================
            VISUAL AREA
        ================================================= */}

        <div className="login-required-popup__visual">
          <div
            className="login-required-popup__orb"
            aria-hidden="true"
          />

          <div
            className="login-required-popup__visual-card"
            aria-hidden="true"
          >
            <div className="login-required-popup__visual-icon">
              <Icon
                size={26}
                strokeWidth={1.25}
                fill={
                  isWishlist
                    ? "currentColor"
                    : "none"
                }
              />
            </div>

            <span className="login-required-popup__visual-line" />
            <span className="login-required-popup__visual-line login-required-popup__visual-line--short" />
          </div>

          <div
            className="login-required-popup__sparkle login-required-popup__sparkle--one"
            aria-hidden="true"
          >
            <Sparkles
              size={13}
              strokeWidth={1.2}
            />
          </div>

          <div
            className="login-required-popup__sparkle login-required-popup__sparkle--two"
            aria-hidden="true"
          >
            <Sparkles
              size={9}
              strokeWidth={1.2}
            />
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="login-required-popup__content">
          <span className="login-required-popup__eyebrow">
            {eyebrow}
          </span>

          <h2
            id="login-required-title"
            className="login-required-popup__title"
          >
            {title}
          </h2>

          <p className="login-required-popup__description">
            {description}
          </p>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="login-required-popup__actions">
          <button
            type="button"
            onClick={handleLogin}
            className="login-required-popup__primary"
          >
            <span>
              {primaryLabel}
            </span>

            <span className="login-required-popup__primary-icon">
              <LogIn
                size={15}
                strokeWidth={1.5}
              />
            </span>

            <ArrowRight
              className="login-required-popup__primary-arrow"
              size={16}
              strokeWidth={1.4}
            />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="login-required-popup__secondary"
          >
            {secondaryLabel}
          </button>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="login-required-popup__footer">
          <span />
          <p>
            AAYESHA FASHION
          </p>
          <span />
        </div>
      </div>
    </div>
  );

  return createPortal(
    popup,
    document.body,
  );
}