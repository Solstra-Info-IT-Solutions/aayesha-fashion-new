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
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { WishlistCount } from "./wishlist-count";
import { CartCount } from "./cart-count";
import { AccountPopup } from "./account-popup";

import { useAuthStore } from "@/store/auth-store";

export function HeaderActions() {
  const router = useRouter();

  /* =======================================================
     AUTH STATE
  ======================================================= */

  const user = useAuthStore((state) => state.user);

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

  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const accountWrapperRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     SEARCH FOCUS
  ======================================================= */

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchOpen]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!searchOpen && !accountOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setSearchOpen(false);
      setAccountOpen(false);
    }

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
  }, [searchOpen, accountOpen]);

  /* =======================================================
     ACCOUNT OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        accountWrapperRef.current &&
        !accountWrapperRef.current.contains(target)
      ) {
        setAccountOpen(false);
      }
    }

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
     SEARCH
  ======================================================= */

  const openSearch = () => {
    setAccountOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setSearchOpen(false);

    router.push(
      `/search?q=${encodeURIComponent(trimmedQuery)}`,
    );
  };

  /* =======================================================
     ACCOUNT
  ======================================================= */

  const handleAccountClick = () => {
    if (!isInitialized) {
      return;
    }

    setSearchOpen(false);

    setAccountOpen((current) => !current);
  };

  /* =======================================================
     ACCOUNT LABEL
  ======================================================= */

  const accountLabel =
    isInitialized && loggedIn
      ? `Account for ${user?.name ?? "customer"}`
      : "Sign in or account";

  return (
    <>
      {/* ===================================================
          HEADER ACTIONS
      =================================================== */}

      <div className="header-actions">
        {/* Search */}

        <HeaderActionButton
          label="Search"
          onClick={openSearch}
          active={searchOpen}
          className="header-action--search"
        >
          <Search
            size={20}
            strokeWidth={1.45}
          />
        </HeaderActionButton>

        {/* Account */}

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
          >
            <UserRound
              size={20}
              strokeWidth={1.45}
            />

            {isInitialized && loggedIn && (
              <span
                aria-hidden="true"
                className="header-account-status"
              />
            )}
          </HeaderActionButton>

          {isInitialized && loggedIn && (
            <AccountPopup
              isOpen={accountOpen}
              onClose={() => setAccountOpen(false)}
            />
          )}

          {isInitialized &&
            !loggedIn &&
            accountOpen && (
              <GuestAccountPopup
                onClose={() => setAccountOpen(false)}
              />
            )}
        </div>

        {/* Wishlist */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={() => setAccountOpen(false)}
          className="header-action-link header-action--wishlist"
        >
          <Heart
            size={20}
            strokeWidth={1.45}
            className="header-action-icon"
          />

          <WishlistCount />

          <span
            aria-hidden="true"
            className="header-action-underline"
          />
        </Link>

        {/* Shopping bag */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() => setAccountOpen(false)}
          className="header-action-link"
        >
          <ShoppingBag
            size={20}
            strokeWidth={1.45}
            className="header-action-icon"
          />

          <CartCount />

          <span
            aria-hidden="true"
            className="header-action-underline"
          />
        </Link>
      </div>

      {/* =====================================================
          SEARCH PANEL
      ===================================================== */}

      {searchOpen && (
        <>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="header-search-backdrop"
          />

          <div className="header-search-panel">
            <span
              aria-hidden="true"
              className="header-search-accent"
            />

            <div className="header-search-container">
              <div className="header-search-content">
                <div className="header-search-row">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="header-search-form"
                  >
                    <div className="header-search-input-row">
                      <span
                        aria-hidden="true"
                        className="header-search-icon"
                      >
                        <Search
                          size={19}
                          strokeWidth={1.35}
                        />
                      </span>

                      <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) =>
                          setQuery(event.target.value)
                        }
                        placeholder="What are you looking for?"
                        aria-label="Search products"
                        autoComplete="off"
                        className="header-search-input"
                      />

                      {query.trim() && (
                        <button
                          type="submit"
                          className="header-search-submit"
                        >
                          Search

                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.35}
                          />
                        </button>
                      )}
                    </div>

                    <div className="header-search-line" />
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="header-search-close"
                  >
                    <X
                      size={18}
                      strokeWidth={1.35}
                    />
                  </button>
                </div>

                <div className="header-search-meta">
                  <p className="text-caption">
                    Search Aayesha Fashion
                  </p>

                  <p className="text-caption">
                    Press ESC to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}


/* =========================================================
   HEADER ACTION BUTTON
========================================================= */

function HeaderActionButton({
  label,
  children,
  onClick,
  active = false,
  expanded,
  hasPopup,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  expanded?: boolean;
  hasPopup?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-haspopup={hasPopup ? "menu" : undefined}
      className={`header-action-button ${
        active
          ? "header-action-button--active"
          : ""
      } ${className}`}
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
    <div className="guest-account-popup">
      <div className="guest-account-popup__surface">
        <span
          aria-hidden="true"
          className="guest-account-popup__accent"
        />

        <div className="guest-account-popup__intro">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account menu"
            className="guest-account-popup__close"
          >
            <X
              size={16}
              strokeWidth={1.3}
            />
          </button>

          <p className="eyebrow guest-account-popup__eyebrow">
            Your Account
          </p>

          <h3 className="guest-account-popup__title">
            Welcome to Aayesha
          </h3>

          <p className="guest-account-popup__description">
            Sign in or create an account
            to manage your orders and
            details.
          </p>
        </div>

        {/* Auth actions */}

        <div className="guest-account-popup__actions">
          <div className="guest-account-popup__buttons">
            <Link
              href="/login"
              onClick={onClose}
              className="button button-primary guest-account-popup__button"
            >
              Sign In

              <ArrowUpRight
                size={15}
                strokeWidth={1.35}
              />
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="button button-secondary guest-account-popup__button"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Benefits */}

        <div className="guest-account-popup__benefits">
          <p className="eyebrow">
            With an account
          </p>

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