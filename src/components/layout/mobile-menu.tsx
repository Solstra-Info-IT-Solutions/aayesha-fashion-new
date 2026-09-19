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
        h-10
        w-10
        items-center
        justify-center
        text-[var(--color-text)]
        transition-all
        duration-500
        ease-[var(--ease-luxury)]
        hover:-translate-y-px
        hover:text-[var(--color-accent-dark)]
        lg:hidden
      "
    >
      <span
        className="
          relative
          flex
          h-9
          w-9
          items-center
          justify-center
        "
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-1
            rounded-full
            border
            border-transparent
            transition-all
            duration-500
            group-hover:border-[var(--color-accent-soft)]
          "
        />

        {isOpen ? (
          <X
            size={19}
            strokeWidth={1.2}
            className="relative z-10"
          />
        ) : (
          <Menu
            size={19}
            strokeWidth={1.2}
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
          bg-[rgba(33,31,29,0.50)]
          backdrop-blur-[5px]
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
          w-[88vw]
          max-w-[440px]
          flex-col
          overflow-hidden
          border-r
          border-[var(--color-border)]
          bg-[#f7f3ee]
          shadow-[30px_0_100px_rgba(33,31,29,0.20)]
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
            via-[var(--color-accent)]
            to-transparent
            opacity-70
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
            border-[var(--color-border)]
            bg-[#f7f3ee]
            px-5
            py-5
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
                text-[30px]
                font-medium
                leading-none
                tracking-[-0.03em]
                text-[var(--color-text)]
                transition-all
                duration-500
                group-hover:tracking-[-0.02em]
              "
            >
              Aayesha
            </p>

            <p
              className="
                mt-1.5
                font-body
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.34em]
                text-[var(--color-text-muted)]
                transition-colors
                duration-500
                group-hover:text-[var(--color-accent)]
              "
            >
              Fashion
            </p>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              group
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--color-border)]
              bg-transparent
              text-[var(--color-text-secondary)]
              transition-all
              duration-500
              hover:border-[var(--color-text)]
              hover:bg-[var(--color-text)]
              hover:text-[var(--color-text-inverse)]
            "
          >
            <X
              size={16}
              strokeWidth={1.2}
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
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-[#f7f3ee]
          "
        >
          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div className="px-5 pt-6 sm:px-7">
            {isLoggedIn ? (
              <Link
                href="/account"
                onClick={onClose}
                className="
                  group
                  flex
                  items-center
                  gap-3.5
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-4
                  py-4
                  transition-all
                  duration-500
                  hover:border-[var(--color-accent-soft)]
                  hover:shadow-[var(--shadow-md)]
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
                    rounded-full
                    border
                    border-[var(--color-accent-soft)]
                    bg-[var(--color-bg-soft)]
                    font-display
                    text-base
                    font-medium
                  "
                >
                  {initials}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="
                      block
                      truncate
                      font-body
                      text-[12px]
                      font-semibold
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

                <ChevronRight
                  size={16}
                  strokeWidth={1.2}
                  className="
                    text-[var(--color-text-muted)]
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                  "
                />
              </Link>
            ) : (
              <div className="space-y-4">
                <div>
                  <p
                    className="
                      eyebrow
                      text-[var(--color-accent)]
                    "
                  >
                    Your Account
                  </p>

                  <p
                    className="
                      mt-2
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

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      border
                      border-[var(--color-text)]
                      bg-[var(--color-text)]
                      px-4
                      font-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white
                    "
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      border
                      border-[var(--color-border)]
                      bg-white
                      px-4
                      font-body
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                    "
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              ACCOUNT LINKS
          ================================================= */}

          {isLoggedIn && (
            <section className="mt-7 px-5 sm:px-7">
              <div className="mb-3 flex items-end justify-between">
                <p className="eyebrow">
                  My Account
                </p>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="
                    font-body
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[var(--color-accent)]
                  "
                >
                  View All
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
                          border-[var(--color-border)]
                          px-4
                          py-4
                          last:border-b-0
                          transition-colors
                          duration-500
                          hover:bg-[var(--color-bg-soft)]
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[var(--color-border)]
                            bg-[var(--color-bg)]
                            text-[var(--color-text-secondary)]
                            transition-all
                            duration-500
                            group-hover:border-[var(--color-accent-soft)]
                            group-hover:bg-[var(--color-accent-soft)]
                          "
                        >
                          <Icon
                            size={15}
                            strokeWidth={1.3}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className="
                              block
                              font-body
                              text-[11px]
                              font-semibold
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
                          size={14}
                          strokeWidth={1.2}
                          className="
                            text-[var(--color-text-muted)]
                            transition-transform
                            duration-500
                            group-hover:translate-x-1
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
                    border-[var(--color-border)]
                    px-4
                    py-4
                    text-left
                    disabled:opacity-60
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[var(--color-border)]
                      bg-[var(--color-bg)]
                    "
                  >
                    <LogOut
                      size={15}
                      strokeWidth={1.3}
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className="
                        block
                        font-body
                        text-[11px]
                        font-semibold
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
            className="mt-8 px-5 sm:px-7"
            aria-label="Mobile navigation"
          >
            <div className="mb-4 flex items-end justify-between">
              <p className="eyebrow">
                Explore
              </p>

              <span
                aria-hidden="true"
                className="
                  h-px
                  w-12
                  bg-[var(--color-accent-soft)]
                "
              />
            </div>

            <div
              className="
                overflow-hidden
                border
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
                        flex
                        items-center
                        gap-3
                        border-b
                        border-[var(--color-border)]
                        px-4
                        py-4
                        last:border-b-0
                        transition-colors
                        duration-500
                        hover:bg-[var(--color-bg-soft)]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          font-body
                          text-[8px]
                          tracking-[0.08em]
                          text-[var(--color-text-muted)]
                        "
                      >
                        0{index + 1}
                      </span>

                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[var(--color-border)]
                          bg-[var(--color-bg)]
                          text-[var(--color-text-secondary)]
                          transition-all
                          duration-500
                          group-hover:border-[var(--color-accent-soft)]
                          group-hover:bg-[var(--color-accent-soft)]
                        "
                      >
                        <Icon
                          size={15}
                          strokeWidth={1.25}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className="
                            block
                            font-display
                            text-[18px]
                            leading-none
                            tracking-[-0.015em]
                          "
                        >
                          {item.label}
                        </span>

                        <span
                          className="
                            mt-1.5
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
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[var(--color-border)]
                          bg-[var(--color-bg)]
                        "
                      >
                        <ChevronRight
                          size={14}
                          strokeWidth={1.2}
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

          <div className="mt-7 px-5 sm:px-7">
            <div className="mb-4 flex items-end justify-between">
              <p className="eyebrow">
                Quick Access
              </p>

              <span
                aria-hidden="true"
                className="
                  h-px
                  w-12
                  bg-[var(--color-accent-soft)]
                "
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/search"
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-3.5
                  py-3.5
                  font-body
                  text-[10px]
                  font-medium
                  transition-all
                  duration-500
                  hover:border-[var(--color-text)]
                "
              >
                <Search
                  size={15}
                  strokeWidth={1.2}
                  className="text-[var(--color-accent)]"
                />

                <span>Search</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-3.5
                  py-3.5
                  font-body
                  text-[10px]
                  font-medium
                  transition-all
                  duration-500
                  hover:border-[var(--color-text)]
                "
              >
                <Heart
                  size={15}
                  strokeWidth={1.2}
                  className="text-[var(--color-accent)]"
                />

                <span>Wishlist</span>
              </Link>

              <Link
                href={
                  isLoggedIn
                    ? "/account"
                    : "/login"
                }
                onClick={onClose}
                className="
                  col-span-2
                  flex
                  items-center
                  justify-between
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-4
                  py-3.5
                  font-body
                  text-[10px]
                  font-medium
                  transition-all
                  duration-500
                  hover:border-[var(--color-text)]
                "
              >
                <span className="flex items-center gap-3">
                  <UserRound
                    size={15}
                    strokeWidth={1.2}
                    className="text-[var(--color-accent)]"
                  />

                  <span>
                    {isLoggedIn
                      ? "My Account"
                      : "Sign In / Account"}
                  </span>
                </span>

                <ChevronRight
                  size={15}
                  strokeWidth={1.2}
                />
              </Link>
            </div>
          </div>

          {/* =================================================
              EDITORIAL
          ================================================= */}

          <div className="px-5 pb-10 pt-9 sm:px-7">
            <div
              className="
                border-t
                border-[var(--color-border)]
                pt-6
              "
            >
              <p
                className="
                  font-display
                  text-[24px]
                  italic
                  leading-[1.05]
                  tracking-[-0.02em]
                "
              >
                Made for moments
                <br />
                worth remembering.
              </p>

              <p
                className="
                  mt-3
                  font-body
                  text-[8px]
                  uppercase
                  tracking-[0.16em]
                  text-[var(--color-text-muted)]
                "
              >
                Aayesha Fashion
              </p>
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
            bg-[#f2ede7]
            px-5
            py-4
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
                    text-[var(--color-text-muted)]
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
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[var(--color-border)]
                  bg-white
                "
              >
                <UserRound
                  size={15}
                  strokeWidth={1.2}
                />
              </Link>
            </div>
          ) : (
            <p
              className="
                max-w-[320px]
                font-body
                text-[8px]
                leading-4
                uppercase
                tracking-[0.12em]
                text-[var(--color-text-muted)]
              "
            >
              {siteConfig.description}
            </p>
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