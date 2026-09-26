"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  ArrowUpRight,
  LogIn,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import "./LoginRequiredPopup.css";

/* =========================================================
   TYPES
========================================================= */

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;
};

/* =========================================================
   COMPONENT
========================================================= */

export function LoginRequiredPopup({
  open,
  onClose,
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
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="login-required-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-required-title"
        aria-describedby="login-required-description"
      >
        {/* =================================================
            DECORATIVE TOP LINE
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
          aria-label="Close login dialog"
          className="login-required-popup__close"
        >
          <X
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="login-required-popup__content">
          {/* BRAND */}

          <div className="login-required-popup__brand">
            <span
              className="login-required-popup__brand-line"
              aria-hidden="true"
            />

            <span>
              AAYESHA
            </span>

            <span
              className="login-required-popup__brand-line"
              aria-hidden="true"
            />
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
            Keep your favourites
            close.
          </h2>

          {/* DESCRIPTION */}

          <p
            id="login-required-description"
            className="login-required-popup__description"
          >
            Sign in to save pieces to
            your wishlist and revisit
            them whenever you like.
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
            className="
              login-required-popup__button
              login-required-popup__button--primary
            "
          >
            <span className="login-required-popup__button-left">
              <span className="login-required-popup__button-icon">
                <LogIn
                  size={15}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span>Login to continue</span>
            </span>

            <span
              className="login-required-popup__button-arrow"
              aria-hidden="true"
            >
              <ArrowUpRight
                size={16}
                strokeWidth={1.4}
              />
            </span>
          </button>

          {/* CONTINUE SHOPPING */}

          <button
            type="button"
            onClick={onClose}
            className="
              login-required-popup__secondary
            "
          >
            <span>
              Continue Shopping
            </span>

            <span
              className="login-required-popup__secondary-line"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* =================================================
            FOOTNOTE
        ================================================= */}

        <p className="login-required-popup__note">
          Your wishlist is available across
          your account.
        </p>
      </div>
    </div>
  );

  return createPortal(
    popup,
    document.body,
  );
}