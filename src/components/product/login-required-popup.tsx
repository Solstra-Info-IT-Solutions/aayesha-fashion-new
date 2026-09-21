"use client";

import {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import "./LoginRequiredPopup.css";

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;
};

export function LoginRequiredPopup({
  open,
  onClose,
}: LoginRequiredPopupProps) {
  const router = useRouter();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  const popup = (
    <div
      className="login-required-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={onClose}
    >
      <div
        className="login-required-popup__dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
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

        <div className="login-required-popup__content">
          <p className="login-required-popup__eyebrow">
            Aayesha Fashion
          </p>

          <span
            className="login-required-popup__rule"
            aria-hidden="true"
          />

          <h2
            id="login-required-title"
            className="login-required-popup__title"
          >
            Login Required
          </h2>

          <p className="login-required-popup__description">
            Please login to your account to
            add products to your wishlist.
          </p>
        </div>

        <div className="login-required-popup__actions">
          <button
            type="button"
            onClick={handleLogin}
            className="login-required-popup__button login-required-popup__button--primary"
          >
            Login
          </button>

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