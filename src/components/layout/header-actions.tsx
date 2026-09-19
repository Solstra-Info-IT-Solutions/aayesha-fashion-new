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

/* =========================================================
   COMPONENT
========================================================= */

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
    if (!searchOpen) return;

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
    if (!accountOpen) return;

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

      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* =================================================
            SEARCH
        ================================================= */}

        <HeaderActionButton
          label="Search"
          onClick={openSearch}
          active={searchOpen}
          className="hidden lg:flex"
        >
          <Search
            size={18}
            strokeWidth={1.25}
          />
        </HeaderActionButton>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div
          ref={accountWrapperRef}
          className="relative hidden lg:block"
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
              size={18}
              strokeWidth={1.25}
            />

            {isInitialized && loggedIn && (
              <span
                aria-hidden="true"
                className="
                  absolute
                  right-[5px]
                  top-[5px]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--color-accent)]
                  ring-2
                  ring-[var(--color-bg)]
                "
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

        {/* =================================================
            WISHLIST
        ================================================= */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          onClick={() => setAccountOpen(false)}
          className="
            group
            relative
            hidden
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
            lg:flex
          "
        >
          <Heart
            size={18}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.06]
            "
          />

          <WishlistCount />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-1
              left-1/2
              h-px
              w-0
              -translate-x-1/2
              bg-[var(--color-accent)]
              transition-all
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:w-3
            "
          />
        </Link>

        {/* =================================================
            SHOPPING BAG
        ================================================= */}

        <Link
          href="/cart"
          aria-label="Shopping bag"
          onClick={() => setAccountOpen(false)}
          className="
            group
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            text-[var(--color-text)]
            transition-all
            duration-500
            ease-[var(--ease-luxury)]
            hover:-translate-y-px
            hover:text-[var(--color-accent-dark)]
            sm:h-10
            sm:w-10
          "
        >
          <ShoppingBag
            size={18}
            strokeWidth={1.25}
            className="
              transition-transform
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:scale-[1.06]
            "
          />

          <CartCount />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0.5
              left-1/2
              h-px
              w-0
              -translate-x-1/2
              bg-[var(--color-accent)]
              transition-all
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:w-3
            "
          />
        </Link>
      </div>

      {/* =====================================================
          SEARCH PANEL
      ===================================================== */}

      {searchOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="
              fixed
              inset-0
              z-[55]
              cursor-default
              bg-[rgba(33,31,29,0.18)]
              backdrop-blur-[3px]
              animate-[fade-in_300ms_ease-out]
            "
          />

          {/* Search Drawer */}
          <div
            className="
              fixed
              inset-x-0
              top-[76px]
              z-[70]
              overflow-hidden
              border-b
              border-[var(--color-border)]
              bg-[rgba(247,243,238,0.96)]
              shadow-[0_24px_70px_rgba(33,31,29,0.10)]
              backdrop-blur-xl
              animate-[slide-down_500ms_cubic-bezier(.22,1,.36,1)]
              sm:top-[80px]
              md:top-[84px]
              lg:absolute
              lg:top-full
            "
          >
            {/* Decorative line */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[var(--color-accent-soft)]
                to-transparent
              "
            />

            <div
              className="
                mx-auto
                max-w-[1600px]
                px-5
                sm:px-8
                md:px-10
                lg:px-12
                xl:px-16
              "
            >
              <div
                className="
                  py-6
                  sm:py-7
                  md:py-8
                "
              >
                <div className="flex items-center gap-5">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[var(--color-border)]
                          bg-[var(--color-surface)]
                        "
                      >
                        <Search
                          size={17}
                          strokeWidth={1.2}
                          className="
                            text-[var(--color-text-secondary)]
                          "
                        />
                      </div>

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
                        className="
                          min-w-0
                          flex-1
                          border-0
                          bg-transparent
                          p-0
                          font-display
                          text-2xl
                          leading-none
                          tracking-[-0.02em]
                          text-[var(--color-text)]
                          outline-none
                          placeholder:text-[var(--color-text-muted)]
                          sm:text-3xl
                          md:text-4xl
                        "
                      />

                      {query.trim() && (
                        <button
                          type="submit"
                          className="
                            hidden
                            shrink-0
                            items-center
                            gap-2
                            font-body
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-[var(--color-text)]
                            transition-colors
                            duration-300
                            hover:text-[var(--color-accent-dark)]
                            sm:inline-flex
                          "
                        >
                          Search
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.25}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className="
                        mt-5
                        h-px
                        origin-left
                        bg-[var(--color-border)]
                      "
                    />
                  </form>

                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close search"
                    className="
                      group
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[var(--color-border)]
                      text-[var(--color-text-secondary)]
                      transition-all
                      duration-500
                      hover:border-[var(--color-text)]
                      hover:bg-[var(--color-text)]
                      hover:text-[var(--color-text-inverse)]
                    "
                  >
                    <X
                      size={17}
                      strokeWidth={1.25}
                      className="
                        transition-transform
                        duration-500
                        group-hover:rotate-90
                      "
                    />
                  </button>
                </div>

                <div
                  className="
                    mt-5
                    hidden
                    items-center
                    justify-between
                    gap-4
                    sm:flex
                  "
                >
                  <p
                    className="
                      font-body
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Search Aayesha Fashion
                  </p>

                  <p
                    className="
                      font-body
                      text-[9px]
                      uppercase
                      tracking-[0.14em]
                      text-[var(--color-text-muted)]
                    "
                  >
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
      className={`
        group
        relative
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
        ${className}
      `}
    >
      <span
        className={`
          flex
          h-full
          w-full
          items-center
          justify-center
          transition-transform
          duration-500
          ease-[var(--ease-luxury)]
          group-hover:scale-[1.04]
          ${active ? "text-[var(--color-accent-dark)]" : ""}
        `}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          bottom-1
          left-1/2
          h-px
          -translate-x-1/2
          bg-[var(--color-accent)]
          transition-all
          duration-500
          ease-[var(--ease-luxury)]
          ${
            active
              ? "w-3"
              : "w-0 group-hover:w-3"
          }
        `}
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
      className="
        absolute
        right-0
        top-[calc(100%+14px)]
        z-[100]
        w-[340px]
        max-w-[calc(100vw-24px)]
        animate-[slide-down_400ms_cubic-bezier(.22,1,.36,1)]
      "
    >
      <div
        className="
          overflow-hidden
          border
          border-[var(--color-border)]
          bg-[rgba(247,243,238,0.97)]
          shadow-[0_24px_70px_rgba(33,31,29,0.12)]
          backdrop-blur-xl
        "
      >
        {/* Top accent */}
        <div
          aria-hidden="true"
          className="
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--color-accent)]
            to-transparent
            opacity-70
          "
        />

        <div
          className="
            relative
            border-b
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-6
            py-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account menu"
            className="
              group
              absolute
              right-4
              top-4
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-[var(--color-text-secondary)]
              transition-all
              duration-300
              hover:bg-[var(--color-text)]
              hover:text-[var(--color-text-inverse)]
            "
          >
            <X
              size={15}
              strokeWidth={1.3}
              className="
                transition-transform
                duration-300
                group-hover:rotate-90
              "
            />
          </button>

          <p
            className="
              eyebrow
              text-[var(--color-accent)]
            "
          >
            Your Account
          </p>

          <h3
            className="
              mt-3
              font-display
              text-3xl
              leading-none
              tracking-[-0.025em]
              text-[var(--color-text)]
            "
          >
            Welcome to Aayesha
          </h3>

          <p
            className="
              mt-4
              max-w-[280px]
              font-body
              text-xs
              leading-5
              text-[var(--color-text-secondary)]
            "
          >
            Sign in or create an account
            to manage your orders and
            details.
          </p>
        </div>

        {/* Auth actions */}
        <div
          className="
            border-b
            border-[var(--color-border)]
            p-5
          "
        >
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="
                group
                flex
                h-11
                items-center
                justify-center
                gap-2
                bg-[var(--color-text)]
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-[var(--color-text-inverse)]
                transition-all
                duration-500
                hover:bg-[var(--color-accent-dark)]
              "
            >
              Sign In

              <ArrowUpRight
                size={13}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-500
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
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
                font-body
                text-[9px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-[var(--color-text)]
                transition-all
                duration-500
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-surface)]
              "
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 py-6">
          <p
            className="
              eyebrow
              text-[var(--color-text-muted)]
            "
          >
            With an account
          </p>

          <div className="mt-5 space-y-4">
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
    <div className="group flex items-start gap-3">
      <span
        className="
          mt-1.5
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-[var(--color-accent)]
          transition-transform
          duration-300
          group-hover:scale-125
        "
      />

      <div>
        <p
          className="
            font-body
            text-[11px]
            font-medium
            text-[var(--color-text)]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            font-body
            text-[10px]
            leading-5
            text-[var(--color-text-secondary)]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}