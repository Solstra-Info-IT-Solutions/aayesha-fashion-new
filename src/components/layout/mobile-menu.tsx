"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
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
     AUTH
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
    !!user;

  /* =======================================================
     PORTAL MOUNT
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
     ESCAPE KEY
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
      className="
        group
        relative
        flex
        h-11
        w-11
        items-center
        justify-center
        text-[var(--color-text)]
        transition-all
        duration-500
        ease-[var(--ease-luxury)]
        hover:text-[var(--color-accent-dark)]
        lg:hidden
      "
    >
      <span
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
        "
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            border
            border-transparent
            transition-all
            duration-500
            group-hover:border-[var(--color-accent-soft)]
          "
        />

        {isOpen ? (
          <X
            size={20}
            strokeWidth={1.15}
            className="
              relative
              z-10
              transition-transform
              duration-500
              group-hover:rotate-90
            "
          />
        ) : (
          <Menu
            size={20}
            strokeWidth={1.15}
            className="
              relative
              z-10
              transition-transform
              duration-500
              group-hover:scale-105
            "
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
        fixed
        inset-0
        z-[999999]
        lg:hidden
        ${
          isOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }
      `}
      aria-hidden={!isOpen}
    >
      {/* =================================================
          BACKDROP
      ================================================= */}

      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        className={`
          absolute
          inset-0
          z-0
          cursor-default
          bg-[rgba(17,16,15,0.56)]
          backdrop-blur-[6px]
          transition-opacity
          duration-700
          ease-[var(--ease-luxury)]
          ${
            isOpen
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* =================================================
          DRAWER
      ================================================= */}

      <aside
        className={`
          absolute
          left-0
          top-0
          z-10
          flex
          h-[100dvh]
          w-[92vw]
          max-w-[460px]
          flex-col
          overflow-hidden
          border-r
          border-[var(--color-border)]
          bg-white
          shadow-[30px_0_100px_rgba(17,16,15,0.18)]
          transition-transform
          duration-700
          ease-[var(--ease-luxury)]
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* =================================================
            AMBIENT LIGHT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-80px]
            top-[-80px]
            z-0
            h-56
            w-56
            rounded-full
            bg-[var(--color-champagne)]
            opacity-[0.07]
            blur-[70px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[15%]
            left-[-100px]
            z-0
            h-64
            w-64
            rounded-full
            bg-[var(--color-rose)]
            opacity-[0.035]
            blur-[80px]
          "
        />

        {/* =================================================
            TOP ACCENT
        ================================================= */}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            top-0
            z-30
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--color-champagne)]
            to-transparent
            opacity-80
          "
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            relative
            z-20
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-[var(--color-border-light)]
            bg-white/[0.96]
            px-5
            py-5
            backdrop-blur-xl
            sm:px-7
          "
        >
          <Link
            href="/"
            onClick={onClose}
            className="group block"
            aria-label="Aayesha Fashion home"
          >
            <p
              className="
                font-display
                text-[32px]
                font-normal
                leading-none
                tracking-[-0.035em]
                text-[var(--color-text)]
                transition-all
                duration-500
                group-hover:text-[var(--color-accent-dark)]
              "
            >
              Aayesha
            </p>

            <div
              className="
                mt-2
                flex
                items-center
                gap-2
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-px
                  w-5
                  bg-[var(--color-champagne)]
                "
              />

              <p
                className="
                  font-body
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.34em]
                  text-[var(--color-text-muted)]
                "
              >
                Fashion
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              border
              border-[var(--color-border)]
              bg-white
              text-[var(--color-text-secondary)]
              transition-all
              duration-500
              hover:border-[var(--color-text)]
              hover:bg-[var(--color-text)]
              hover:text-white
            "
          >
            <X
              size={17}
              strokeWidth={1.15}
              className="
                transition-transform
                duration-500
                group-hover:rotate-90
              "
            />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-white
          "
        >
          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div className="px-5 pt-7 sm:px-7">
            {isLoggedIn ? (
              <Link
                href="/account"
                onClick={onClose}
                className="
                  group
                  relative
                  flex
                  items-center
                  gap-4
                  overflow-hidden
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-bg-subtle)]
                  px-4
                  py-4
                  transition-all
                  duration-500
                  hover:border-[var(--color-accent-soft)]
                  hover:bg-[var(--color-bg-warm)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-20
                    bg-gradient-to-l
                    from-[var(--color-champagne)]/[0.07]
                    to-transparent
                  "
                />

                <span
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[var(--color-accent-soft)]
                    bg-white
                    font-display
                    text-lg
                    font-normal
                    text-[var(--color-text)]
                  "
                >
                  {initials}
                </span>

                <span className="relative min-w-0 flex-1">
                  <span
                    className="
                      block
                      font-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[var(--color-accent-dark)]
                    "
                  >
                    My Account
                  </span>

                  <span
                    className="
                      mt-1.5
                      block
                      truncate
                      font-display
                      text-[18px]
                      leading-tight
                      tracking-[-0.015em]
                      text-[var(--color-text)]
                    "
                  >
                    {user.name}
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      truncate
                      font-body
                      text-[10px]
                      text-[var(--color-text-secondary)]
                    "
                  >
                    {user.email}
                  </span>
                </span>

                <span
                  className="
                    relative
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[var(--color-border)]
                    bg-white
                  "
                >
                  <ChevronRight
                    size={15}
                    strokeWidth={1.15}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </Link>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p
                      className="
                        eyebrow
                        text-[var(--color-accent-dark)]
                      "
                    >
                      Your Account
                    </p>

                    <h2
                      className="
                        mt-3
                        max-w-[330px]
                        font-display
                        text-[28px]
                        leading-[1.05]
                        tracking-[-0.025em]
                        text-[var(--color-text)]
                      "
                    >
                      Welcome to Aayesha.
                    </h2>

                    <p
                      className="
                        mt-3
                        max-w-[330px]
                        font-body
                        text-[11px]
                        leading-5
                        text-[var(--color-text-secondary)]
                      "
                    >
                      Sign in or create an account
                      to manage your orders and
                      personal details.
                    </p>
                  </div>

                  <UserRound
                    size={20}
                    strokeWidth={1.1}
                    className="
                      mt-1
                      shrink-0
                      text-[var(--color-champagne)]
                    "
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      border
                      border-[var(--color-text)]
                      bg-[var(--color-text)]
                      px-4
                      font-body
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white
                      transition-all
                      duration-500
                      hover:bg-[var(--color-charcoal-soft)]
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      border
                      border-[var(--color-border)]
                      bg-white
                      px-4
                      font-body
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[var(--color-text)]
                      transition-all
                      duration-500
                      hover:border-[var(--color-text)]
                    "
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              ACCOUNT LINKS
          ================================================= */}

          {isLoggedIn && (
            <section className="mt-8 px-5 sm:px-7">
              <div className="mb-4 flex items-end justify-between">
                <p className="eyebrow">
                  My Account
                </p>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="
                    group
                    flex
                    items-center
                    gap-1.5
                    font-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[var(--color-accent-dark)]
                  "
                >
                  View Account

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.2}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </Link>
              </div>

              <div
                className="
                  overflow-hidden
                  border
                  border-[var(--color-border)]
                  bg-white
                "
              >
                {accountLinks.map(
                  (item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="
                          group
                          flex
                          items-center
                          gap-3.5
                          border-b
                          border-[var(--color-border-light)]
                          px-4
                          py-4
                          last:border-b-0
                          transition-all
                          duration-500
                          hover:bg-[var(--color-bg-warm)]
                        "
                      >
                        <span
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-[var(--color-border)]
                            bg-[var(--color-bg-subtle)]
                            text-[var(--color-text-secondary)]
                            transition-all
                            duration-500
                            group-hover:border-[var(--color-accent-soft)]
                            group-hover:bg-white
                            group-hover:text-[var(--color-accent-dark)]
                          "
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.2}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className="
                              block
                              font-body
                              text-[12px]
                              font-semibold
                              text-[var(--color-text)]
                            "
                          >
                            {item.label}
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              font-body
                              text-[9px]
                              leading-4
                              text-[var(--color-text-muted)]
                            "
                          >
                            {item.description}
                          </span>
                        </span>

                        <ChevronRight
                          size={15}
                          strokeWidth={1.15}
                          className="
                            shrink-0
                            text-[var(--color-text-faint)]
                            transition-all
                            duration-500
                            group-hover:translate-x-1
                            group-hover:text-[var(--color-accent-dark)]
                          "
                        />
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
                    group
                    flex
                    w-full
                    items-center
                    gap-3.5
                    border-t
                    border-[var(--color-border-light)]
                    px-4
                    py-4
                    text-left
                    transition-all
                    duration-500
                    hover:bg-[var(--color-bg-warm)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[var(--color-border)]
                      bg-[var(--color-bg-subtle)]
                      text-[var(--color-text-secondary)]
                    "
                  >
                    <LogOut
                      size={16}
                      strokeWidth={1.2}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        font-body
                        text-[12px]
                        font-semibold
                        text-[var(--color-text)]
                      "
                    >
                      {isLoggingOut
                        ? "Signing Out..."
                        : "Sign Out"}
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        font-body
                        text-[9px]
                        text-[var(--color-text-muted)]
                      "
                    >
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
            className="mt-9 px-5 sm:px-7"
            aria-label="Mobile navigation"
          >
            <div className="mb-4">
              <p className="eyebrow">
                Explore
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="
                    h-px
                    w-10
                    bg-[var(--color-champagne)]
                  "
                />

                <span
                  className="
                    font-body
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    text-[var(--color-text-faint)]
                  "
                >
                  The Collection
                </span>
              </div>
            </div>

            <div
              className="
                overflow-hidden
                border-y
                border-[var(--color-border)]
                bg-white
              "
            >
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
                      className="
                        group
                        relative
                        flex
                        items-center
                        gap-3.5
                        border-b
                        border-[var(--color-border-light)]
                        px-1
                        py-5
                        last:border-b-0
                        transition-all
                        duration-500
                        hover:px-3
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          font-body
                          text-[8px]
                          font-medium
                          tracking-[0.12em]
                          text-[var(--color-text-faint)]
                        "
                      >
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          border
                          border-[var(--color-border)]
                          bg-[var(--color-bg-subtle)]
                          text-[var(--color-text-secondary)]
                          transition-all
                          duration-500
                          group-hover:border-[var(--color-accent-soft)]
                          group-hover:bg-[var(--color-bg-warm)]
                          group-hover:text-[var(--color-accent-dark)]
                        "
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.15}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className="
                            block
                            font-display
                            text-[21px]
                            leading-none
                            tracking-[-0.02em]
                            text-[var(--color-text)]
                          "
                        >
                          {item.label}
                        </span>

                        <span
                          className="
                            mt-2
                            block
                            font-body
                            text-[9px]
                            leading-4
                            text-[var(--color-text-muted)]
                          "
                        >
                          {details.description}
                        </span>
                      </span>

                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          border
                          border-transparent
                          text-[var(--color-text-faint)]
                          transition-all
                          duration-500
                          group-hover:border-[var(--color-border)]
                          group-hover:text-[var(--color-accent-dark)]
                        "
                      >
                        <ChevronRight
                          size={16}
                          strokeWidth={1.15}
                          className="
                            transition-transform
                            duration-500
                            group-hover:translate-x-1
                          "
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

          <section className="mt-9 px-5 sm:px-7">
            <div className="mb-4">
              <p className="eyebrow">
                Quick Access
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px border border-[var(--color-border)] bg-[var(--color-border)]">
              <Link
                href="/search"
                onClick={onClose}
                className="
                  group
                  flex
                  min-h-[72px]
                  items-center
                  gap-3
                  bg-white
                  px-4
                  py-3
                  transition-all
                  duration-500
                  hover:bg-[var(--color-bg-warm)]
                "
              >
                <Search
                  size={17}
                  strokeWidth={1.15}
                  className="
                    text-[var(--color-accent-dark)]
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                <span>
                  <span
                    className="
                      block
                      font-body
                      text-[11px]
                      font-semibold
                      text-[var(--color-text)]
                    "
                  >
                    Search
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      font-body
                      text-[8px]
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Find your style
                  </span>
                </span>
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="
                  group
                  flex
                  min-h-[72px]
                  items-center
                  gap-3
                  bg-white
                  px-4
                  py-3
                  transition-all
                  duration-500
                  hover:bg-[var(--color-bg-warm)]
                "
              >
                <Heart
                  size={17}
                  strokeWidth={1.15}
                  className="
                    text-[var(--color-burgundy)]
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                <span>
                  <span
                    className="
                      block
                      font-body
                      text-[11px]
                      font-semibold
                      text-[var(--color-text)]
                    "
                  >
                    Wishlist
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      font-body
                      text-[8px]
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Saved pieces
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
                  group
                  col-span-2
                  flex
                  min-h-[66px]
                  items-center
                  justify-between
                  bg-white
                  px-4
                  py-3
                  transition-all
                  duration-500
                  hover:bg-[var(--color-bg-warm)]
                "
              >
                <span className="flex items-center gap-3">
                  <UserRound
                    size={17}
                    strokeWidth={1.15}
                    className="
                      text-[var(--color-accent-dark)]
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  <span>
                    <span
                      className="
                        block
                        font-body
                        text-[11px]
                        font-semibold
                        text-[var(--color-text)]
                      "
                    >
                      {isLoggedIn
                        ? "My Account"
                        : "Sign In / Account"}
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        font-body
                        text-[8px]
                        uppercase
                        tracking-[0.12em]
                        text-[var(--color-text-muted)]
                      "
                    >
                      Personal space
                    </span>
                  </span>
                </span>

                <ChevronRight
                  size={16}
                  strokeWidth={1.15}
                  className="
                    text-[var(--color-text-faint)]
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>
          </section>

          {/* =================================================
              EDITORIAL STATEMENT
          ================================================= */}

          <div className="px-5 pb-10 pt-10 sm:px-7">
            <div
              className="
                relative
                overflow-hidden
                border-t
                border-[var(--color-border)]
                pt-7
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute
                  left-0
                  top-0
                  h-px
                  w-12
                  bg-[var(--color-champagne)]
                "
              />

              <p
                className="
                  max-w-[330px]
                  font-display
                  text-[29px]
                  italic
                  leading-[1.02]
                  tracking-[-0.025em]
                  text-[var(--color-text)]
                "
              >
                Made for moments
                <br />
                worth remembering.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="
                    h-px
                    w-7
                    bg-[var(--color-champagne)]
                  "
                />

                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[var(--color-text-muted)]
                  "
                >
                  Aayesha Fashion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            relative
            z-20
            shrink-0
            border-t
            border-[var(--color-border)]
            bg-[var(--color-charcoal)]
            px-5
            py-4
            text-white
            sm:px-7
          "
        >
          {isLoggedIn ? (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p
                  className="
                    truncate
                    font-body
                    text-[10px]
                    font-semibold
                    text-white
                  "
                >
                  Signed in as {user.name}
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    font-body
                    text-[9px]
                    text-white/55
                  "
                >
                  {user.email}
                </p>
              </div>

              <Link
                href="/account"
                onClick={onClose}
                aria-label="Open account"
                className="
                  group
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-white/15
                  bg-white/[0.06]
                  transition-all
                  duration-500
                  hover:border-[var(--color-champagne)]
                  hover:bg-[var(--color-champagne)]
                  hover:text-[var(--color-text)]
                "
              >
                <UserRound
                  size={15}
                  strokeWidth={1.15}
                  className="
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p
                className="
                  max-w-[320px]
                  font-body
                  text-[8px]
                  leading-4
                  uppercase
                  tracking-[0.12em]
                  text-white/55
                "
              >
                {siteConfig.description}
              </p>

              <span
                aria-hidden="true"
                className="
                  h-1.5
                  w-1.5
                  shrink-0
                  rounded-full
                  bg-[var(--color-champagne)]
                "
              />
            </div>
          )}
        </div>
      </aside>
    </div>
  );

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