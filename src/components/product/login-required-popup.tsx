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
            size={18}
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
            Aayesha Fashion
          </p>

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
            Login Required
          </h2>

          {/* DESCRIPTION */}

          <p className="login-required-popup__description">
            Please login to your account to
            add products to your wishlist.
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
                Login
              </span>

              <span
                className="login-required-popup__button-icon"
                aria-hidden="true"
              >
                <LogIn
                  size={15}
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

          {/* CONTINUE SHOPPING */}

          <button
            type="button"
            onClick={onClose}
            className="login-required-popup__button login-required-popup__button--secondary"
          >
            Continue Shopping
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