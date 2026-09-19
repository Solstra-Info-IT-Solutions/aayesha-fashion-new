"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  MapPin,
  ShoppingBag,
  Trash2,
  User,
  UserCog,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";
import { deleteCustomerAccount } from "@/lib/customer-api";

import { AccountConfirmDialog } from "@/components/account/account-confirm-dialog";

type AccountPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

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

export function AccountPopup({
  isOpen,
  onClose,
}: AccountPopupProps) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore(
    (state) => state.user,
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const [confirmType, setConfirmType] = useState<
    "delete" | "logout" | null
  >(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  if (!isOpen || !user) {
    return null;
  }

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "A";

  const closeConfirmDialog = () => {
    if (isProcessing) {
      return;
    }

    setConfirmType(null);
  };

  const handleLogoutConfirm = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      setConfirmType(null);
      onClose();

      router.push("/");
      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isProcessing) {
      return;
    }

    if (!accessToken) {
      toast.error(
        "Your session has expired. Please sign in again.",
      );

      setConfirmType(null);
      onClose();

      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      await deleteCustomerAccount(
        accessToken,
      );

      /*
       * The delete API has already invalidated
       * the account. Clear the frontend session.
       */
      try {
        await logout();
      } catch {
        /*
         * Ignore logout failure here because
         * account deletion has already succeeded.
         */
      }

      toast.success(
        "Your account has been deleted.",
      );

      setConfirmType(null);
      onClose();

      router.push(
        "/?accountDeleted=1",
      );

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete your account.";

      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* =====================================================
          ACCOUNT POPUP
      ===================================================== */}

      <div
        className="
          absolute
          right-0
          top-[calc(100%+16px)]
          z-[100]
          w-[390px]
          max-w-[calc(100vw-24px)]
        "
      >
        <div
          className="
            relative
            overflow-hidden
            border
            border-[var(--color-border)]
            bg-white
            shadow-[0_28px_80px_rgba(23,21,20,0.14)]
          "
        >
          {/* Luxury accent */}

          <span
            aria-hidden="true"
            className="
              absolute
              left-1/2
              top-0
              h-px
              w-20
              -translate-x-1/2
              bg-gradient-to-r
              from-transparent
              via-[var(--color-champagne)]
              to-transparent
            "
          />

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div
            className="
              relative
              border-b
              border-[var(--color-border-light)]
              px-6
              pb-6
              pt-7
            "
          >
            {/* Close */}

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
                border-transparent
                text-[var(--color-text-muted)]
                transition-all
                duration-500
                hover:border-[var(--color-border)]
                hover:bg-[var(--color-bg-warm)]
                hover:text-[var(--color-text)]
              "
            >
              <X
                size={16}
                strokeWidth={1.25}
                className="
                  transition-transform
                  duration-500
                  group-hover:rotate-90
                "
              />
            </button>

            {/* Profile */}

            <div className="flex items-center gap-4 pr-10">
              <div
                className="
                  relative
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  border
                  border-[var(--color-accent-soft)]
                  bg-[var(--color-bg-warm)]
                  font-display
                  text-xl
                  font-normal
                  text-[var(--color-text)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_30%_20%,rgba(200,170,122,0.16),transparent_60%)]
                  "
                />

                <span className="relative">
                  {initials}
                </span>
              </div>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    font-display
                    text-[21px]
                    leading-tight
                    tracking-[-0.02em]
                    text-[var(--color-text)]
                  "
                >
                  {user.name}
                </p>

                <p
                  className="
                    mt-1.5
                    truncate
                    font-body
                    text-[12px]
                    text-[var(--color-text-secondary)]
                  "
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account CTA */}

            <Link
              href="/account"
              onClick={onClose}
              className="
                group
                mt-6
                flex
                items-center
                justify-between
                border
                border-[var(--color-border)]
                bg-[var(--color-bg-subtle)]
                px-4
                py-3.5
                transition-all
                duration-500
                hover:border-[var(--color-accent-soft)]
                hover:bg-[var(--color-bg-warm)]
              "
            >
              <span>
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
                    font-body
                    text-[12px]
                    text-[var(--color-text)]
                  "
                >
                  View your account
                </span>
              </span>

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  border
                  border-[var(--color-border)]
                  bg-white
                  transition-all
                  duration-500
                  group-hover:border-[var(--color-accent-soft)]
                "
              >
                <ChevronRight
                  size={15}
                  strokeWidth={1.2}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                  "
                />
              </span>
            </Link>
          </div>

          {/* =================================================
              ACCOUNT NAVIGATION
          ================================================= */}

          <div
            className="
              border-b
              border-[var(--color-border-light)]
              bg-white
              p-2.5
            "
          >
            {accountLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(
                      item.href,
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "group flex items-center gap-3.5 px-3.5 py-3.5",
                    "transition-all duration-500",
                    isActive
                      ? "bg-[var(--color-bg-warm)]"
                      : "hover:bg-[var(--color-bg-subtle)]",
                  ].join(" ")}
                >
                  {/* Icon */}

                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center border",
                      "transition-all duration-500",
                      isActive
                        ? "border-[var(--color-accent-soft)] bg-white text-[var(--color-accent-dark)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-accent-soft)] group-hover:text-[var(--color-accent-dark)]",
                    ].join(" ")}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.25}
                    />
                  </span>

                  {/* Text */}

                  <span className="min-w-0 flex-1">
                    <span
                      className={[
                        "block font-body text-[12px]",
                        isActive
                          ? "font-semibold text-[var(--color-text)]"
                          : "font-medium text-[var(--color-text-soft)]",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        font-body
                        text-[10px]
                        leading-4
                        text-[var(--color-text-muted)]
                      "
                    >
                      {item.description}
                    </span>
                  </span>

                  {/* Arrow */}

                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      text-[var(--color-text-faint)]
                      transition-all
                      duration-500
                      group-hover:text-[var(--color-accent-dark)]
                    "
                  >
                    <ChevronRight
                      size={15}
                      strokeWidth={1.2}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-1
                      "
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* =================================================
              ACCOUNT ACTIONS
          ================================================= */}

          <div
            className="
              bg-[var(--color-bg-subtle)]
              p-2.5
            "
          >
            {/* Delete */}

            <button
              type="button"
              onClick={() =>
                setConfirmType("delete")
              }
              disabled={isProcessing}
              className="
                group
                flex
                w-full
                items-center
                gap-3.5
                px-3.5
                py-3.5
                text-left
                transition-all
                duration-500
                hover:bg-[var(--color-rose-light)]
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
                  bg-white
                  text-[var(--color-burgundy)]
                  transition-colors
                  duration-500
                  group-hover:border-[var(--color-rose-soft)]
                "
              >
                <Trash2
                  size={16}
                  strokeWidth={1.25}
                />
              </span>

              <span className="flex-1">
                <span
                  className="
                    block
                    font-body
                    text-[12px]
                    font-semibold
                    text-[var(--color-burgundy)]
                  "
                >
                  Delete Account
                </span>

                <span
                  className="
                    mt-1
                    block
                    font-body
                    text-[10px]
                    leading-4
                    text-[var(--color-text-muted)]
                  "
                >
                  Permanently remove your account
                </span>
              </span>
            </button>

            {/* Sign out */}

            <button
              type="button"
              onClick={() =>
                setConfirmType("logout")
              }
              disabled={isProcessing}
              className="
                group
                mt-1
                flex
                w-full
                items-center
                gap-3.5
                px-3.5
                py-3.5
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
                  bg-white
                  text-[var(--color-text-secondary)]
                  transition-colors
                  duration-500
                  group-hover:border-[var(--color-border-dark)]
                "
              >
                <LogOut
                  size={16}
                  strokeWidth={1.25}
                />
              </span>

              <span className="flex-1">
                <span
                  className="
                    block
                    font-body
                    text-[12px]
                    font-semibold
                    text-[var(--color-text-soft)]
                  "
                >
                  Sign Out
                </span>

                <span
                  className="
                    mt-1
                    block
                    font-body
                    text-[10px]
                    leading-4
                    text-[var(--color-text-muted)]
                  "
                >
                  Sign out from this device
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONFIRMATION DIALOG
      ===================================================== */}

      <AccountConfirmDialog
        open={confirmType !== null}
        type={
          confirmType === "delete"
            ? "delete"
            : "logout"
        }
        loading={isProcessing}
        onCancel={closeConfirmDialog}
        onConfirm={() => {
          if (confirmType === "delete") {
            void handleDeleteConfirm();
            return;
          }

          if (confirmType === "logout") {
            void handleLogoutConfirm();
          }
        }}
      />
    </>
  );
}