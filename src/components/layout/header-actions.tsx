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

      <div
        className="
          flex
          items-center
          gap-0.5
          sm:gap-1
          lg:gap-1.5
        "
      >
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
            size={20}
            strokeWidth={1.45}
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
              size={20}
              strokeWidth={1.45}
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
                  ring-white
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
            h-11
            w-11
            items-center
            justify-center
            text-[var(--color-text)]
            transition-all
            duration-300
            ease-[var(--ease-luxury)]
            hover:-translate-y-px
            hover:text-[var(--color-accent-dark)]
            lg:flex
          "
        >
          <Heart
            size={20}
            strokeWidth={1.45}
            className="
              transition-transform
              duration-300
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
              bg-[var(--color-champagne)]
              transition-all
              duration-400
              ease-[var(--ease-luxury)]
              group-hover:w-4
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
            h-11
            w-11
            items-center
            justify-center
            text-[var(--color-text)]
            transition-all
            duration-300
            ease-[var(--ease-luxury)]
            hover:-translate-y-px
            hover:text-[var(--color-accent-dark)]
          "
        >
          <ShoppingBag
            size={20}
            strokeWidth={1.45}
            className="
              transition-transform
              duration-300
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
              bottom-1
              left-1/2
              h-px
              w-0
              -translate-x-1/2
              bg-[var(--color-champagne)]
              transition-all
              duration-400
              ease-[var(--ease-luxury)]
              group-hover:w-4
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
              bg-[rgba(17,16,15,0.16)]
              backdrop-blur-[4px]
              animate-[fade-in_300ms_ease-out]
            "
          />

          {/* Search Drawer */}

          <div
            className="
              fixed
              inset-x-0
              top-[72px]
              z-[70]
              overflow-hidden
              border-b
              border-[var(--color-border-light)]
              bg-[rgba(255,255,255,0.98)]
              shadow-[0_24px_70px_rgba(23,21,20,0.10)]
              backdrop-blur-xl
              animate-[slide-down_500ms_cubic-bezier(.22,1,.36,1)]
              sm:top-[76px]
              lg:absolute
              lg:top-full
            "
          >
            {/* Champagne accent */}

            <div
              aria-hidden="true"
              className="
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[var(--color-champagne)]
                to-transparent
                opacity-70
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
                  py-7
                  sm:py-8
                  md:py-10
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
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          border
                          border-[var(--color-border)]
                          bg-[var(--color-bg-subtle)]
                          text-[var(--color-text-secondary)]
                        "
                      >
                        <Search
                          size={19}
                          strokeWidth={1.35}
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
                          leading-tight
                          tracking-[-0.02em]
                          text-[var(--color-text)]
                          outline-none
                          placeholder:text-[var(--color-text-muted)]
                          sm:text-3xl
                          md:text-4xl
                          lg:text-[42px]
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
                            text-[12px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[var(--color-text)]
                            transition-colors
                            duration-300
                            hover:text-[var(--color-accent-dark)]
                            sm:inline-flex
                          "
                        >
                          Search

                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.35}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className="
                        mt-6
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
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[var(--color-border)]
                      text-[var(--color-text-secondary)]
                      transition-all
                      duration-300
                      hover:border-[var(--color-text)]
                      hover:bg-[var(--color-text)]
                      hover:text-white
                    "
                  >
                    <X
                      size={18}
                      strokeWidth={1.35}
                      className="
                        transition-transform
                        duration-400
                        group-hover:rotate-90
                      "
                    />
                  </button>
                </div>

                <div
                  className="
                    mt-6
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
                      text-[12px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-[var(--color-text-muted)]
                    "
                  >
                    Search Aayesha Fashion
                  </p>

                  <p
                    className="
                      font-body
                      text-[12px]
                      uppercase
                      tracking-[0.1em]
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
        h-11
        w-11
        items-center
        justify-center
        text-[var(--color-text)]
        transition-all
        duration-300
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
          duration-300
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
          bg-[var(--color-champagne)]
          transition-all
          duration-300
          ease-[var(--ease-luxury)]
          ${
            active
              ? "w-4"
              : "w-0 group-hover:w-4"
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
        w-[360px]
        max-w-[calc(100vw-24px)]
        animate-[slide-down_400ms_cubic-bezier(.22,1,.36,1)]
      "
    >
      <div
        className="
          overflow-hidden
          border
          border-[var(--color-border)]
          bg-white
          shadow-[0_24px_70px_rgba(23,21,20,0.12)]
        "
      >
        {/* Champagne accent */}

        <div
          aria-hidden="true"
          className="
            h-px
            bg-gradient-to-r
            from-transparent
            via-[var(--color-champagne)]
            to-transparent
            opacity-80
          "
        />

        <div
          className="
            relative
            border-b
            border-[var(--color-border-light)]
            px-7
            py-7
          "
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account menu"
            className="
              group
              absolute
              right-5
              top-5
              flex
              h-9
              w-9
              items-center
              justify-center
              border
              border-[var(--color-border)]
              text-[var(--color-text-secondary)]
              transition-all
              duration-300
              hover:border-[var(--color-text)]
              hover:bg-[var(--color-text)]
              hover:text-white
            "
          >
            <X
              size={16}
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
              text-[var(--color-accent-dark)]
            "
          >
            Your Account
          </p>

          <h3
            className="
              mt-4
              font-display
              text-[34px]
              leading-[0.98]
              tracking-[-0.025em]
              text-[var(--color-text)]
            "
          >
            Welcome to Aayesha
          </h3>

          <p
            className="
              mt-4
              max-w-[290px]
              font-body
              text-[14px]
              leading-6
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
            border-[var(--color-border-light)]
            p-6
          "
        >
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login"
              onClick={onClose}
              className="
                group
                flex
                h-12
                items-center
                justify-center
                gap-2
                bg-[var(--color-text)]
                font-body
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-white
                transition-all
                duration-300
                hover:bg-[var(--color-accent-dark)]
              "
            >
              Sign In

              <ArrowUpRight
                size={15}
                strokeWidth={1.35}
                className="
                  transition-transform
                  duration-300
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
                h-12
                items-center
                justify-center
                border
                border-[var(--color-border)]
                font-body
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[var(--color-text)]
                transition-all
                duration-300
                hover:border-[var(--color-text)]
                hover:bg-[var(--color-bg-subtle)]
              "
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Benefits */}

        <div className="px-7 py-7">
          <p
            className="
              eyebrow
              text-[var(--color-text-muted)]
            "
          >
            With an account
          </p>

          <div className="mt-5 space-y-5">
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
          mt-[7px]
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-[var(--color-champagne)]
          transition-transform
          duration-300
          group-hover:scale-125
        "
      />

      <div>
        <p
          className="
            font-body
            text-[13px]
            font-semibold
            text-[var(--color-text)]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            font-body
            text-[12px]
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