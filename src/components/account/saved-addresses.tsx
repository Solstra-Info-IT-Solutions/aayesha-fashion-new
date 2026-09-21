"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Check,
  ChevronRight,
  Edit3,
  MapPin,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";
import "./SavedAddresses.css";

import {
  deleteCustomerAddress,
  getCustomerAddresses,
  setCustomerDefaultAddress,
} from "@/lib/customer-api";

import type {
  CustomerAddress,
} from "@/lib/customer-api";

/* =========================================================
   COMPONENT
========================================================= */

export function SavedAddresses() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [addresses, setAddresses] =
    useState<CustomerAddress[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [defaultId, setDefaultId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =======================================================
     LOAD ADDRESSES
  ======================================================= */

  const loadAddresses = useCallback(
    async () => {
      if (!accessToken) {
        setAddresses([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const data =
          await getCustomerAddresses(
            accessToken,
          );

        setAddresses(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your saved addresses.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (
      !isAuthenticated ||
      !accessToken
    ) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    void loadAddresses();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadAddresses,
  ]);

  /* =======================================================
     SET DEFAULT
  ======================================================= */

  const handleSetDefault = async (
    addressId: string,
  ) => {
    if (
      !accessToken ||
      defaultId
    ) {
      return;
    }

    setDefaultId(addressId);
    setErrorMessage("");

    try {
      const updatedAddress =
        await setCustomerDefaultAddress(
          accessToken,
          addressId,
        );

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault:
            address.id ===
            updatedAddress.id,
        })),
      );

      toast.success(
        "Default address updated.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update the default address.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setDefaultId(null);
    }
  };

  /* =======================================================
     DELETE ADDRESS
  ======================================================= */

  const handleDelete = async (
    address: CustomerAddress,
  ) => {
    if (
      !accessToken ||
      deletingId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete the saved address for ${address.name}?`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(address.id);
    setErrorMessage("");

    try {
      await deleteCustomerAddress(
        accessToken,
        address.id,
      );

      setAddresses((current) =>
        current.filter(
          (item) =>
            item.id !== address.id,
        ),
      );

      toast.success(
        "Address deleted successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete the address.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    !isInitialized ||
    isLoading
  ) {
    return (
      <section className="saved-addresses saved-addresses--loading">
        <div className="saved-addresses__header saved-addresses__header--loading">
          <div className="saved-addresses__skeleton saved-addresses__skeleton--title" />

          <div className="saved-addresses__skeleton saved-addresses__skeleton--description" />
        </div>

        <div className="saved-addresses__grid">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="saved-addresses__card-skeleton"
            >
              <div className="saved-addresses__skeleton saved-addresses__skeleton--card-title" />

              <div className="saved-addresses__skeleton saved-addresses__skeleton--line" />

              <div className="saved-addresses__skeleton saved-addresses__skeleton--line saved-addresses__skeleton--line-short" />

              <div className="saved-addresses__skeleton saved-addresses__skeleton--line" />

              <div className="saved-addresses__skeleton saved-addresses__skeleton--line saved-addresses__skeleton--line-short" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* =======================================================
     AUTH REQUIRED
  ======================================================= */

  if (
    !isAuthenticated ||
    !accessToken
  ) {
    return (
      <section className="saved-addresses saved-addresses--auth">
        <div className="saved-addresses__state-icon">
          <MapPin
            size={24}
            strokeWidth={1.4}
          />
        </div>

        <p className="saved-addresses__eyebrow">
          Delivery
        </p>

        <h1 className="saved-addresses__state-title">
          Saved Addresses
        </h1>

        <p className="saved-addresses__state-description">
          Sign in to save and manage your
          delivery addresses.
        </p>

        <Link
          href="/login?callbackUrl=/account/addresses"
          className="saved-addresses__button saved-addresses__button--primary"
        >
          Sign In
        </Link>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <section className="saved-addresses">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="saved-addresses__header">
        <div className="saved-addresses__heading">
          <div className="saved-addresses__eyebrow-row">
            <span className="saved-addresses__eyebrow-line" />

            <p className="saved-addresses__eyebrow">
              Delivery
            </p>
          </div>

          <h1 className="saved-addresses__title">
            Saved Addresses
          </h1>

          <p className="saved-addresses__description">
            Manage the addresses you use for
            your Aayesha Fashion orders.
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          className="saved-addresses__button saved-addresses__button--primary"
        >
          <Plus
            size={16}
            strokeWidth={1.8}
          />

          <span>Add New Address</span>
        </Link>
      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {errorMessage ? (
        <div className="saved-addresses__feedback">
          <div className="saved-addresses__feedback-content">
            <span className="saved-addresses__feedback-dot" />

            <p>{errorMessage}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadAddresses()
            }
            className="saved-addresses__button saved-addresses__button--secondary saved-addresses__button--small"
          >
            Try Again
          </button>
        </div>
      ) : null}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {addresses.length === 0 ? (
        <div className="saved-addresses__empty">
          <div className="saved-addresses__empty-icon">
            <MapPin
              size={24}
              strokeWidth={1.4}
            />
          </div>

          <p className="saved-addresses__eyebrow">
            Your delivery book
          </p>

          <h2 className="saved-addresses__empty-title">
            No saved addresses
          </h2>

          <p className="saved-addresses__empty-description">
            Add your preferred delivery
            address to make checkout faster
            and easier.
          </p>

          <Link
            href="/account/addresses/new"
            className="saved-addresses__button saved-addresses__button--primary"
          >
            <Plus
              size={16}
              strokeWidth={1.8}
            />

            <span>Add Address</span>
          </Link>
        </div>
      ) : (
        /* ===================================================
           ADDRESS GRID
        =================================================== */

        <div className="saved-addresses__grid">
          {addresses.map((address) => {
            const isDeleting =
              deletingId === address.id;

            const isSettingDefault =
              defaultId === address.id;

            return (
              <article
                key={address.id}
                className={`saved-address-card ${
                  address.isDefault
                    ? "saved-address-card--default"
                    : ""
                }`}
              >
                {/* ADDRESS HEADER */}

                <div className="saved-address-card__header">
                  <div className="saved-address-card__identity">
                    <div className="saved-address-card__name-row">
                      <h2 className="saved-address-card__name">
                        {address.name}
                      </h2>

                      {address.isDefault ? (
                        <span className="saved-address-card__default-badge">
                          <Star
                            size={11}
                            fill="currentColor"
                            strokeWidth={1.5}
                          />

                          Default
                        </span>
                      ) : null}
                    </div>

                    <p className="saved-address-card__phone">
                      +91 {address.phone}
                    </p>
                  </div>

                  <div className="saved-address-card__location-icon">
                    <MapPin
                      size={16}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* ADDRESS DETAILS */}

                <div className="saved-address-card__body">
                  <address className="saved-address-card__address">
                    <span>
                      {address.addressLine}
                    </span>

                    <span>
                      {address.city},{" "}
                      {address.state}
                    </span>

                    <span className="saved-address-card__pincode">
                      {address.pincode}
                    </span>

                    {address.landmark ? (
                      <span className="saved-address-card__landmark">
                        Landmark:{" "}
                        {address.landmark}
                      </span>
                    ) : null}
                  </address>
                </div>

                {/* ACTIONS */}

                <div className="saved-address-card__actions">
                  <Link
                    href={`/account/addresses/edit?id=${encodeURIComponent(
                      address.id,
                    )}`}
                    className="saved-address-card__action"
                  >
                    <Edit3
                      size={15}
                      strokeWidth={1.6}
                    />

                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    disabled={
                      address.isDefault ||
                      Boolean(defaultId) ||
                      isDeleting
                    }
                    onClick={() =>
                      void handleSetDefault(
                        address.id,
                      )
                    }
                    className="saved-address-card__action"
                  >
                    {isSettingDefault ? (
                      <span className="saved-address-card__spinner" />
                    ) : address.isDefault ? (
                      <Check
                        size={15}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Star
                        size={15}
                        strokeWidth={1.6}
                      />
                    )}

                    <span>
                      {address.isDefault
                        ? "Default"
                        : "Set Default"}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() =>
                      void handleDelete(
                        address,
                      )
                    }
                    className="saved-address-card__action saved-address-card__action--danger"
                  >
                    {isDeleting ? (
                      <span className="saved-address-card__spinner saved-address-card__spinner--danger" />
                    ) : (
                      <Trash2
                        size={15}
                        strokeWidth={1.6}
                      />
                    )}

                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =====================================================
          BACK TO ACCOUNT
      ===================================================== */}

      {addresses.length > 0 ? (
        <div className="saved-addresses__footer">
          <Link
            href="/account"
            className="saved-addresses__back-link"
          >
            <span>Back to Account</span>

            <ChevronRight
              size={15}
              strokeWidth={1.5}
            />
          </Link>
        </div>
      ) : null}
    </section>
  );
}