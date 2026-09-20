"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginRequiredPopupProps = {
  open: boolean;
  onClose: () => void;
};

export function LoginRequiredPopup({
  open,
  onClose,
}: LoginRequiredPopupProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div
      className="login-required-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={onClose}
    >
      <div
        className="login-required-popup__dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="login-required-popup__close"
        >
          <X
            className="login-required-popup__close-icon"
            aria-hidden="true"
          />
        </button>

        <div className="login-required-popup__content">
          <p className="login-required-popup__eyebrow">
            Aayesha Fashion
          </p>

          <h2
            id="login-required-title"
            className="login-required-popup__title"
          >
            Login Required
          </h2>

          <p className="login-required-popup__description">
            Please login to your account to add products
            to your bag.
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
}