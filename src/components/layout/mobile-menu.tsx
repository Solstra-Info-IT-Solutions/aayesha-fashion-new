"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import {
  ArrowUpRight,
  ChevronRight,
  Heart,
  Layers,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  UserCog,
  UserRound,
  X,
} from "lucide-react";

import { mainNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/store/auth-store";

import "./MobileMenu.css";

/* =========================================================
   TYPES
========================================================= */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

/* =========================================================
   ACCOUNT LINKS
========================================================= */

const accountLinks = [
  {
    label: "Your Orders",
    href: "/account/orders",
    description: "View and track orders",
    icon: ShoppingBag,
  },
  {
    label: "Profile Details",
    href: "/account",
    description: "Your personal information",
    icon: User,
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    description: "Manage delivery addresses",
    icon: MapPin,
  },
  {
    label: "Edit Account",
    href: "/account/edit",
    description: "Update account details",
    icon: UserCog,
  },
];

/* =========================================================
   NAVIGATION DETAILS
========================================================= */

const navigationDetails: Record<
  string,
  {
    description: string;
    icon: typeof ShoppingBag;
  }
> = {
  "New Arrivals": {
    description: "Discover the latest styles",
    icon: Sparkles,
  },

  Shop: {
    description: "Explore all fashion",
    icon: ShoppingBag,
  },

  Collections: {
    description: "Browse curated edits",
    icon: Layers,
  },

  "Best Sellers": {
    description: "Most-loved pieces",
    icon: Heart,
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export function MobileMenu({
  isOpen,
  onClose,
  onOpen,
}: MobileMenuProps) {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

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

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const isLoggedIn =
    isInitialized &&
    isAuthenticated &&
    Boolean(user);

  /* =======================================================
     MOUNT
  ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen]);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
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
  }, [isOpen, onClose]);

  /* =======================================================
     INITIALS
  ======================================================= */

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "A";

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      onClose();

      router.push("/");
      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  /* =======================================================
     HAMBURGER
  ======================================================= */

  const hamburger = (
    <button
      type="button"
      onClick={
        isOpen ? onClose : onOpen
      }
      aria-label={
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      }
      aria-expanded={isOpen}
      className="mobile-menu-trigger"
    >
      <span className="mobile-menu-trigger__inner">
        <span
          aria-hidden="true"
          className="mobile-menu-trigger__frame"
        />

        {isOpen ? (
          <X
            size={20}
            strokeWidth={1.15}
            className="
              mobile-menu-trigger__icon
              mobile-menu-trigger__icon--close
            "
          />
        ) : (
          <Menu
            size={20}
            strokeWidth={1.15}
            className="mobile-menu-trigger__icon"
          />
        )}
      </span>
    </button>
  );

  /* =======================================================
     DRAWER
  ======================================================= */

  const drawer = (
    <div
      className={`
        mobile-menu
        ${
          isOpen
            ? "mobile-menu--open"
            : "mobile-menu--closed"
        }
      `}
      aria-hidden={!isOpen}
    >
      {/* ===================================================
          BACKDROP
      =================================================== */}

      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        className="mobile-menu__backdrop"
      />

      {/* ===================================================
          DRAWER
      =================================================== */}

      <aside
        className="mobile-menu__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* =================================================
            EDITORIAL FRAME
        ================================================= */}

        <span
          aria-hidden="true"
          className="mobile-menu__frame mobile-menu__frame--top"
        />

        <span
          aria-hidden="true"
          className="mobile-menu__frame mobile-menu__frame--bottom"
        />

        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <span
          aria-hidden="true"
          className="mobile-menu__top-accent"
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mobile-menu__header">
          <Link
            href="/"
            onClick={onClose}
            className="mobile-menu__brand"
            aria-label="Aayesha Fashion home"
          >
            <span className="mobile-menu__brand-mark">
              A
            </span>

            <span className="mobile-menu__brand-copy">
              <span className="mobile-menu__brand-name">
                Aayesha
              </span>

              <span className="mobile-menu__brand-subline">
                Contemporary Indian Fashion
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="mobile-menu__close"
          >
            <X
              size={18}
              strokeWidth={1.15}
            />
          </button>
        </header>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div className="mobile-menu__content">
          {/* =================================================
              ACCOUNT
          ================================================= */}

          <section className="mobile-menu__account">
            {isLoggedIn ? (
              <Link
                href="/account"
                onClick={onClose}
                className="mobile-account-card"
              >
                <span
                  aria-hidden="true"
                  className="mobile-account-card__number"
                >
                  01
                </span>

                <span className="mobile-account-card__avatar">
                  {initials}
                </span>

                <span className="mobile-account-card__identity">
                  <span className="mobile-account-card__eyebrow">
                    My Account
                  </span>

                  <span className="mobile-account-card__name">
                    {user?.name}
                  </span>

                  <span className="mobile-account-card__email">
                    {user?.email}
                  </span>
                </span>

                <span className="mobile-account-card__arrow">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.2}
                  />
                </span>
              </Link>
            ) : (
              <div className="mobile-guest-account">
                <div className="mobile-guest-account__heading">
                  <div>
                    <p className="eyebrow mobile-guest-account__eyebrow">
                      Your Account
                    </p>

                    <h2 className="mobile-guest-account__title">
                      Welcome to Aayesha.
                    </h2>

                    <p className="mobile-guest-account__description">
                      Sign in or create an
                      account to manage your
                      orders and personal
                      details.
                    </p>
                  </div>

                  <span className="mobile-guest-account__icon">
                    <UserRound
                      size={19}
                      strokeWidth={1.1}
                    />
                  </span>
                </div>

                <div className="mobile-guest-account__actions">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="
                      button
                      button-primary
                      mobile-guest-account__button
                    "
                  >
                    <span>Sign In</span>

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.25}
                    />
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="
                      button
                      button-secondary
                      mobile-guest-account__button
                    "
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* =================================================
              ACCOUNT LINKS
          ================================================= */}

          {isLoggedIn && (
            <section
              className="
                mobile-menu__section
                mobile-menu__section--account-links
              "
            >
              <div className="mobile-menu__section-heading">
                <div>
                  <p className="eyebrow">
                    My Account
                  </p>

                  <p className="mobile-menu__section-subtitle">
                    Your personal space
                  </p>
                </div>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="mobile-menu__view-account"
                >
                  View Account

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.2}
                  />
                </Link>
              </div>

              <div className="mobile-account-links">
                {accountLinks.map(
                  (item, index) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="mobile-account-link"
                      >
                        <span className="mobile-account-link__number">
                          {String(
                            index + 1,
                          ).padStart(2, "0")}
                        </span>

                        <span className="mobile-account-link__icon">
                          <Icon
                            size={15}
                            strokeWidth={1.2}
                          />
                        </span>

                        <span className="mobile-account-link__content">
                          <span className="mobile-account-link__title">
                            {item.label}
                          </span>

                          <span className="mobile-account-link__description">
                            {item.description}
                          </span>
                        </span>

                        <span className="mobile-account-link__arrow">
                          <ChevronRight
                            size={15}
                            strokeWidth={1.15}
                          />
                        </span>
                      </Link>
                    );
                  },
                )}

                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="
                    mobile-account-link
                    mobile-account-link--logout
                  "
                >
                  <span className="mobile-account-link__number">
                    —
                  </span>

                  <span className="mobile-account-link__icon">
                    <LogOut
                      size={15}
                      strokeWidth={1.2}
                    />
                  </span>

                  <span className="mobile-account-link__content">
                    <span className="mobile-account-link__title">
                      {isLoggingOut
                        ? "Signing Out..."
                        : "Sign Out"}
                    </span>

                    <span className="mobile-account-link__description">
                      Sign out from this device
                    </span>
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <nav
            className="
              mobile-menu__section
              mobile-menu__navigation
            "
            aria-label="Mobile navigation"
          >
            <div
              className="
                mobile-menu__section-heading
                mobile-menu__section-heading--navigation
              "
            >
              <div>
                <p className="eyebrow">
                  Explore
                </p>

                <div className="mobile-menu__collection-label">
                  <span
                    aria-hidden="true"
                    className="mobile-menu__collection-line"
                  />

                  <span>
                    The Collection
                  </span>
                </div>
              </div>

              <span className="mobile-menu__section-index">
                04
              </span>
            </div>

            <div className="mobile-navigation-list">
              {mainNavigation.map(
                (item, index) => {
                  const details =
                    navigationDetails[
                      item.label
                    ] ?? {
                      description:
                        "Explore Aayesha Fashion",
                      icon: ChevronRight,
                    };

                  const Icon =
                    details.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="mobile-navigation-item"
                    >
                      <span className="mobile-navigation-item__number">
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>

                      <span className="mobile-navigation-item__icon">
                        <Icon
                          size={16}
                          strokeWidth={1.15}
                        />
                      </span>

                      <span className="mobile-navigation-item__content">
                        <span className="mobile-navigation-item__title">
                          {item.label}
                        </span>

                        <span className="mobile-navigation-item__description">
                          {details.description}
                        </span>
                      </span>

                      <span className="mobile-navigation-item__arrow">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.15}
                        />
                      </span>
                    </Link>
                  );
                },
              )}
            </div>
          </nav>

          {/* =================================================
              QUICK ACCESS
          ================================================= */}

          <section
            className="
              mobile-menu__section
              mobile-menu__quick-access
            "
          >
            <div className="mobile-menu__section-heading">
              <div>
                <p className="eyebrow">
                  Quick Access
                </p>

                <p className="mobile-menu__section-subtitle">
                  Find your way around
                </p>
              </div>
            </div>

            <div className="mobile-quick-grid">
              <Link
                href="/search"
                onClick={onClose}
                className="mobile-quick-item"
              >
                <span className="mobile-quick-item__index">
                  01
                </span>

                <span className="mobile-quick-item__main">
                  <Search
                    size={16}
                    strokeWidth={1.15}
                  />

                  <span className="mobile-quick-item__content">
                    <span className="mobile-quick-item__title">
                      Search
                    </span>

                    <span className="mobile-quick-item__description">
                      Find your style
                    </span>
                  </span>
                </span>
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="
                  mobile-quick-item
                  mobile-quick-item--wishlist
                "
              >
                <span className="mobile-quick-item__index">
                  02
                </span>

                <span className="mobile-quick-item__main">
                  <Heart
                    size={16}
                    strokeWidth={1.15}
                  />

                  <span className="mobile-quick-item__content">
                    <span className="mobile-quick-item__title">
                      Wishlist
                    </span>

                    <span className="mobile-quick-item__description">
                      Saved pieces
                    </span>
                  </span>
                </span>
              </Link>

              <Link
                href={
                  isLoggedIn
                    ? "/account"
                    : "/login"
                }
                onClick={onClose}
                className="
                  mobile-quick-item
                  mobile-quick-item--account
                "
              >
                <span className="mobile-quick-item__index">
                  03
                </span>

                <span className="mobile-quick-item__main">
                  <UserRound
                    size={16}
                    strokeWidth={1.15}
                  />

                  <span className="mobile-quick-item__content">
                    <span className="mobile-quick-item__title">
                      {isLoggedIn
                        ? "My Account"
                        : "Sign In / Account"}
                    </span>

                    <span className="mobile-quick-item__description">
                      Personal space
                    </span>
                  </span>
                </span>

                <ChevronRight
                  size={15}
                  strokeWidth={1.15}
                  className="mobile-quick-item__arrow"
                />
              </Link>
            </div>
          </section>

          {/* =================================================
              EDITORIAL STATEMENT
          ================================================= */}

          <section className="mobile-menu__editorial">
            <div className="mobile-menu__editorial-top">
              <span className="mobile-menu__editorial-label">
                AAYESHA / 01
              </span>

              <span className="mobile-menu__editorial-label">
                WOMENSWEAR
              </span>
            </div>

            <div className="mobile-menu__editorial-rule">
              <span
                aria-hidden="true"
                className="mobile-menu__editorial-accent"
              />
            </div>

            <p className="mobile-menu__editorial-title">
              Made for moments
              <br />
              worth remembering.
            </p>

            <div className="mobile-menu__editorial-signature">
              <span
                aria-hidden="true"
                className="mobile-menu__editorial-signature-line"
              />

              <p>
                Aayesha Fashion
              </p>
            </div>
          </section>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mobile-menu__footer">
          {isLoggedIn ? (
            <div className="mobile-menu__footer-account">
              <div className="mobile-menu__footer-identity">
                <p className="mobile-menu__footer-name">
                  Signed in as {user?.name}
                </p>

                <p className="mobile-menu__footer-email">
                  {user?.email}
                </p>
              </div>

              <Link
                href="/account"
                onClick={onClose}
                aria-label="Open account"
                className="mobile-menu__footer-action"
              >
                <UserRound
                  size={15}
                  strokeWidth={1.15}
                />
              </Link>
            </div>
          ) : (
            <div className="mobile-menu__footer-guest">
              <p>
                {siteConfig.description}
              </p>

              <span
                aria-hidden="true"
                className="mobile-menu__footer-dot"
              />
            </div>
          )}
        </footer>
      </aside>
    </div>
  );

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
      {hamburger}

      {mounted &&
        createPortal(
          drawer,
          document.body,
        )}
    </>
  );
}