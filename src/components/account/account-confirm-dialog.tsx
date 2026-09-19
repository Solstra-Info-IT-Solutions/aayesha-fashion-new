"use client";

import {
  AlertTriangle,
  Loader2,
  LogOut,
  Trash2,
  X,
} from "lucide-react";

type AccountConfirmDialogProps = {
  open: boolean;
  type: "delete" | "logout";
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AccountConfirmDialog({
  open,
  type,
  loading = false,
  onCancel,
  onConfirm,
}: AccountConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const isDelete = type === "delete";

  return (
    <div
      className="account-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirm-title"
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={loading}
        className="account-dialog__backdrop"
      />

      {/* =====================================================
          DIALOG
      ===================================================== */}

      <div
        className={`account-dialog__panel ${
          isDelete
            ? "account-dialog__panel--delete"
            : "account-dialog__panel--logout"
        }`}
      >
        {/* ===================================================
            TOP ACCENT
        =================================================== */}

        <div
          className={`account-dialog__accent ${
            isDelete
              ? "account-dialog__accent--delete"
              : "account-dialog__accent--default"
          }`}
          aria-hidden="true"
        />

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="account-dialog__header">
          <div className="account-dialog__heading">
            <div
              className={`account-dialog__icon ${
                isDelete
                  ? "account-dialog__icon--danger"
                  : "account-dialog__icon--default"
              }`}
            >
              {isDelete ? (
                <Trash2
                  size={21}
                  strokeWidth={1.35}
                />
              ) : (
                <LogOut
                  size={21}
                  strokeWidth={1.35}
                />
              )}
            </div>

            <div className="account-dialog__heading-content">
              <span className="account-dialog__eyebrow">
                Aayesha Fashion
              </span>

              <h2
                id="account-confirm-title"
                className="account-dialog__title"
              >
                {isDelete
                  ? "Delete Account"
                  : "Sign Out"}
              </h2>
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
            className="account-dialog__close"
          >
            <X
              size={18}
              strokeWidth={1.4}
            />
          </button>
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="account-dialog__content">
          {/* STATUS */}

          <div
            className={`account-dialog__status ${
              isDelete
                ? "account-dialog__status--danger"
                : "account-dialog__status--default"
            }`}
          >
            <span className="account-dialog__status-dot" />

            <span>
              {isDelete
                ? "Permanent action"
                : "Account session"}
            </span>
          </div>

          {isDelete ? (
            <>
              <div className="account-dialog__message">
                <h3 className="account-dialog__message-title">
                  Are you sure you want to
                  continue?
                </h3>

                <p className="account-dialog__description">
                  This action is permanent. Your
                  profile and saved addresses will
                  be removed from active use.
                  Existing order records will be
                  retained where required for order
                  history.
                </p>
              </div>

              <div className="account-dialog__warning">
                <AlertTriangle
                  size={18}
                  strokeWidth={1.5}
                  className="account-dialog__warning-icon"
                />

                <p>
                  After deletion, you will be signed
                  out automatically and your account
                  will no longer be available for
                  login.
                </p>
              </div>
            </>
          ) : (
            <div className="account-dialog__message">
              <h3 className="account-dialog__message-title">
                Ready to sign out?
              </h3>

              <p className="account-dialog__description">
                Are you sure you want to sign out of
                your Aayesha Fashion account on this
                device?
              </p>

              <p className="account-dialog__note">
                Your account, orders and saved
                information will remain safe.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="account-dialog__actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="account-dialog__button account-dialog__button--cancel"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`account-dialog__button ${
              isDelete
                ? "account-dialog__button--delete"
                : "account-dialog__button--confirm"
            }`}
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                  strokeWidth={1.5}
                />

                <span>Processing...</span>
              </>
            ) : isDelete ? (
              <>
                <Trash2
                  size={16}
                  strokeWidth={1.5}
                />

                <span>Delete Account</span>
              </>
            ) : (
              <>
                <LogOut
                  size={16}
                  strokeWidth={1.5}
                />

                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}