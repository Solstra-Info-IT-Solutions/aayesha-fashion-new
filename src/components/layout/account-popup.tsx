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
      await deleteCustomerAccount(accessToken);

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

      router.push("/?accountDeleted=1");
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
      ====================================================== */}

      <div className="account-popup">
        <div className="account-popup__surface">
          {/* Luxury accent */}

          <span
            aria-hidden="true"
            className="account-popup__accent"
          />

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="account-popup__profile">
            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close account menu"
              className="account-popup__close"
            >
              <X
                size={16}
                strokeWidth={1.25}
              />
            </button>

            {/* Profile */}

            <div className="account-popup__identity">
              <div className="account-popup__avatar">
                <span
                  aria-hidden="true"
                  className="account-popup__avatar-glow"
                />

                <span className="account-popup__initials">
                  {initials}
                </span>
              </div>

              <div className="account-popup__user">
                <p className="account-popup__name">
                  {user.name}
                </p>

                <p className="account-popup__email">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account CTA */}

            <Link
              href="/account"
              onClick={onClose}
              className="account-popup__cta"
            >
              <span>
                <span className="account-popup__cta-label">
                  My Account
                </span>

                <span className="account-popup__cta-text">
                  View your account
                </span>
              </span>

              <span className="account-popup__cta-icon">
                <ChevronRight
                  size={15}
                  strokeWidth={1.2}
                />
              </span>
            </Link>
          </div>

          {/* =================================================
              ACCOUNT NAVIGATION
          ================================================= */}

          <div className="account-popup__navigation">
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
                  className={`account-popup__nav-item ${
                    isActive
                      ? "account-popup__nav-item--active"
                      : ""
                  }`}
                >
                  <span className="account-popup__nav-icon">
                    <Icon
                      size={16}
                      strokeWidth={1.25}
                    />
                  </span>

                  <span className="account-popup__nav-content">
                    <span className="account-popup__nav-title">
                      {item.label}
                    </span>

                    <span className="account-popup__nav-description">
                      {item.description}
                    </span>
                  </span>

                  <span className="account-popup__nav-arrow">
                    <ChevronRight
                      size={15}
                      strokeWidth={1.2}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* =================================================
              ACCOUNT ACTIONS
          ================================================= */}

          <div className="account-popup__actions">
            {/* Delete */}

            <button
              type="button"
              onClick={() =>
                setConfirmType("delete")
              }
              disabled={isProcessing}
              className="account-popup__action account-popup__action--delete"
            >
              <span className="account-popup__action-icon">
                <Trash2
                  size={16}
                  strokeWidth={1.25}
                />
              </span>

              <span className="account-popup__action-content">
                <span className="account-popup__action-title">
                  Delete Account
                </span>

                <span className="account-popup__action-description">
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
              className="account-popup__action account-popup__action--logout"
            >
              <span className="account-popup__action-icon">
                <LogOut
                  size={16}
                  strokeWidth={1.25}
                />
              </span>

              <span className="account-popup__action-content">
                <span className="account-popup__action-title">
                  Sign Out
                </span>

                <span className="account-popup__action-description">
                  Sign out from this device
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONFIRMATION DIALOG
      ====================================================== */}

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