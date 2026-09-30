"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { WishlistCount } from "./wishlist-count";
import { CartCount } from "./cart-count";
import { AccountPopup } from "./account-popup";

import { useAuthStore } from "@/store/auth-store";

import "./HeaderActions.css";

/* =========================================================
   COMPONENT
========================================================= */

export function HeaderActions() {
  /* =======================================================
     AUTH STATE
  ======================================================= */

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const loggedIn =
    isInitialized &&
    isAuthenticated &&
    Boolean(user);

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [accountOpen, setAccountOpen] =
    useState(false);

  const accountWrapperRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setAccountOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [accountOpen]);

  /* =======================================================
     ACCOUNT OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    const handlePointerDown = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        accountWrapperRef.current &&
        !accountWrapperRef.current.contains(
          target,
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );
    };
  }, [accountOpen]);

  /* =======================================================
     ACCOUNT
  ======================================================= */

  const handleAccountClick = () => {
    if (!isInitialized) {
      return;
    }

    setAccountOpen(
      (current) => !current,
    );
  };

  /* =======================================================
     WISHLIST
     Guests are asked to sign in, same as the account icon.
  ======================================================= */

  const handleWishlistClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (isInitialized && !loggedIn) {
      event.preventDefault();

      setAccountOpen(true);

      return;
    }

    setAccountOpen(false);
  };

  /* =======================================================
     ACCOUNT LABEL
  ======================================================= */

  const accountLabel =
    isInitialized && loggedIn
      ? `Account for ${
          user?.name ?? "customer"
        }`
      : "Sign in or account";

  return (
    <>
      {/* ===================================================
          HEADER ACTIONS
      =================================================== */}

      <div
        className="header-actions"
        aria-label="Header actions"
      >
        {/* =================================================
            SEARCH
        ================================================= */}

        <Link
          href="/search"
          aria-label="Search"
          onClick={() =>
            setAccountOpen(false)
          }
          className="
            header-action-link
            header-action--search
          "
        >
          <span className="header-action-link__icon">
            <Search
              size={20}
              strokeWidth={1.6}
            />
          </span>

          <span
            aria-hidden="true"
            className="header-action-link__underline"
          />
        </Link>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div
          ref={accountWrapperRef}
          className="header-action-account"
        >
          <HeaderActionButton
            label={accountLabel}
            onClick={handleAccountClick}
            active={accountOpen}
            expanded={
              isInitialized
                ? accountOpen
                : undefined
            }
            hasPopup={isInitialized}
            className="header-action--account"
          >
            <UserRound
              size={20}
              strokeWidth={1.6}
            />
          </HeaderActionButton>

          {/* Logged-in account popup */}

          {isInitialized &&
            loggedIn && (
              <AccountPopup
                isOpen={accountOpen}
                onClose={() =>
                  setAccountOpen(false)
                }
              />
            )}

          {/* Guest account popup */}

          {isInitialized &&
            !loggedIn &&
            accountOpen && (
              <GuestAccountPopup
                onClose={() =>
                  setAccountOpen(false)
                }
              />
            )}
        </div>

        {/* =================================================
            WISHLIST
        ================================================= */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={handleWishlistClick}
          className="
            header-action-link
            header-action--wishlist
          "
        >
          <span className="header-action-link__icon">
            <Heart
              size={20}
              strokeWidth={1.6}
            />
          </span>

          <WishlistCount />

          <span
            aria-hidden="true"
            className="header-action-link__underline"
          />
        </Link>

        {/* =================================================
            SHOPPING BAG
        ================================================= */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() =>
            setAccountOpen(false)
          }
          className="
            header-action-link
            header-action--cart
          "
        >
          <span className="header-action-link__icon">
            <ShoppingBag
              size={20}
              strokeWidth={1.6}
            />
          </span>

          <CartCount />

          <span
            aria-hidden="true"
            className="header-action-link__underline"
          />
        </Link>
      </div>
    </>
  );
}

/* =========================================================
   HEADER ACTION BUTTON
========================================================= */

interface HeaderActionButtonProps {
  label: string;
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  expanded?: boolean;
  hasPopup?: boolean;
  className?: string;
}

function HeaderActionButton({
  label,
  children,
  onClick,
  active = false,
  expanded,
  hasPopup = false,
  className = "",
}: HeaderActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-haspopup={
        hasPopup ? "menu" : undefined
      }
      className={[
        "header-action-button",
        active
          ? "header-action-button--active"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="header-action-button__icon">
        {children}
      </span>

      <span
        aria-hidden="true"
        className="header-action-button__underline"
      />
    </button>
  );
}

/* =========================================================
   GUEST ACCOUNT POPUP
========================================================= */

function GuestAccountPopup({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="guest-account-popup"
      role="dialog"
      aria-label="Account"
    >
      <div className="guest-account-popup__surface">

        <span
          aria-hidden="true"
          className="guest-account-popup__accent"
        />

        {/* Popup header */}

        <div className="guest-account-popup__intro">

          <div className="guest-account-popup__intro-top">
            <div>
              <p className="eyebrow guest-account-popup__eyebrow">
                Your Account
              </p>

              <h3 className="guest-account-popup__title">
                Welcome to Aayesha
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close account menu"
              className="guest-account-popup__close"
            >
              <X
                size={17}
                strokeWidth={1.6}
              />
            </button>
          </div>

          <p className="guest-account-popup__description">
            Sign in or create an account
            to manage your orders,
            wishlist and details.
          </p>
        </div>

        {/* Auth actions */}

        <div className="guest-account-popup__actions">

          <div className="guest-account-popup__buttons">

            <Link
              href="/login"
              onClick={onClose}
              className="
                button
                button-primary
                guest-account-popup__button
              "
            >
              <span>
                Sign In
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.6}
              />
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="
                button
                button-secondary
                guest-account-popup__button
              "
            >
              Sign Up
            </Link>

          </div>

        </div>

        {/* Benefits */}

        <div className="guest-account-popup__benefits">

          <div className="guest-account-popup__benefits-heading">
            <span className="guest-account-popup__benefits-icon">
              ✦
            </span>

            <p className="eyebrow">
              With an account
            </p>
          </div>

          <div className="guest-account-popup__benefit-list">

            <GuestBenefit
              title="Track your orders"
              description="View order status and history."
            />

            <GuestBenefit
              title="Save your addresses"
              description="Checkout faster with saved details."
            />

            <GuestBenefit
              title="Manage your profile"
              description="Keep your account information updated."
            />

          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   GUEST BENEFIT
========================================================= */

function GuestBenefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="guest-benefit">

      <span
        aria-hidden="true"
        className="guest-benefit__dot"
      />

      <div className="guest-benefit__content">

        <p className="guest-benefit__title">
          {title}
        </p>

        <p className="guest-benefit__description">
          {description}
        </p>

      </div>

    </div>
  );
}