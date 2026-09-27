"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  MapPin,
  Plus,
  RefreshCw,
} from "lucide-react";

import { useCheckoutStore } from "@/store/checkout-store";
import { useAuthStore } from "@/store/auth-store";

import {
  getCustomerAddresses,
  type CustomerAddress,
} from "@/lib/customer-api";

import type { CheckoutAddress as CheckoutAddressType } from "@/types/checkout";

import "./CheckoutAddress.css";

/* =========================================================
   COMPONENT
========================================================= */

export function CheckoutAddress() {
  const address = useCheckoutStore(
    (state) => state.address,
  );

  const setAddress = useCheckoutStore(
    (state) => state.setAddress,
  );

  const setContact = useCheckoutStore(
    (state) => state.setContact,
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [savedAddresses, setSavedAddresses] =
    useState<CustomerAddress[]>([]);

  const [isLoadingAddresses, setIsLoadingAddresses] =
    useState(false);

  const [addressError, setAddressError] =
    useState<string | null>(null);

  const [showManualForm, setShowManualForm] =
    useState(false);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const selectedSavedAddress = useMemo(
    () =>
      savedAddresses.find(
        (item) =>
          item.id === selectedAddressId,
      ) ?? null,
    [savedAddresses, selectedAddressId],
  );

  /* =========================================================
     LOAD SAVED ADDRESSES
  ========================================================= */

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      setSavedAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    let isMounted = true;

    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      setAddressError(null);

      try {
        const addresses =
          await getCustomerAddresses(
            accessToken,
          );

        if (!isMounted) {
          return;
        }

        setSavedAddresses(addresses);

        const defaultAddress =
          addresses.find(
            (item) => item.isDefault,
          ) ??
          addresses[0] ??
          null;

        if (!defaultAddress) {
          setSelectedAddressId(null);
          setShowManualForm(true);
          return;
        }

        setSelectedAddressId(
          defaultAddress.id,
        );

        setShowManualForm(false);

        applySavedAddress(
          defaultAddress,
          setAddress,
          setContact,
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setAddressError(
          error instanceof Error
            ? error.message
            : "Unable to load your saved addresses.",
        );
      } finally {
        if (isMounted) {
          setIsLoadingAddresses(false);
        }
      }
    };

    void loadAddresses();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    isAuthenticated,
    isInitialized,
    setAddress,
    setContact,
  ]);

  /* =========================================================
     SELECT SAVED ADDRESS
  ========================================================= */

  const handleSavedAddressSelect = (
    savedAddress: CustomerAddress,
  ) => {
    setSelectedAddressId(
      savedAddress.id,
    );

    setShowManualForm(false);

    applySavedAddress(
      savedAddress,
      setAddress,
      setContact,
    );
  };

  /* =========================================================
     MANUAL ADDRESS
  ========================================================= */

  const handleManualAddress = () => {
    setSelectedAddressId(null);
    setShowManualForm(true);

    setAddress({
      isDefault: false,
    });
  };

  const shouldShowSavedAddressView =
    isInitialized &&
    isAuthenticated &&
    (isLoadingAddresses ||
      savedAddresses.length > 0 ||
      !!addressError);

  /* =========================================================
     AUTHENTICATED CUSTOMER VIEW
  ========================================================= */

  if (shouldShowSavedAddressView) {
    return (
      <section className="checkout-address">
        <header className="checkout-address__header">
          <div className="checkout-address__step">
            <span>02</span>
          </div>

          <div className="checkout-address__header-content">
            <p className="checkout-address__eyebrow">
              Delivery Address
            </p>

            <div className="checkout-address__heading-row">
              <div>
                <h2 className="checkout-address__title">
                  Where should we deliver?
                </h2>

                <p className="checkout-address__description">
                  Select a saved address or add a
                  new delivery address.
                </p>
              </div>

              <Link
                href="/account/addresses"
                className="checkout-address__manage"
              >
                Manage Addresses
              </Link>
            </div>
          </div>
        </header>

        <div className="checkout-address__content">
          {isLoadingAddresses ? (
            <AddressLoadingState />
          ) : (
            <>
              {/* =================================================
                  ERROR
              ================================================= */}

              {addressError ? (
                <div className="checkout-address__error">
                  <div className="checkout-address__error-content">
                    <span className="checkout-address__error-icon">
                      !
                    </span>

                    <div>
                      <p className="checkout-address__error-title">
                        We couldn&apos;t load your
                        saved addresses.
                      </p>

                      <p className="checkout-address__error-description">
                        You can still enter a new
                        delivery address below.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="checkout-address__retry"
                  >
                    <RefreshCw
                      size={15}
                      strokeWidth={1.6}
                    />

                    <span>Retry</span>
                  </button>
                </div>
              ) : null}

              {/* =================================================
                  SAVED ADDRESSES
              ================================================= */}

              {!addressError &&
              savedAddresses.length > 0 ? (
                <div className="checkout-address__saved">
                  <div className="checkout-address__section-heading">
                    <div>
                      <p className="checkout-address__section-label">
                        Saved Addresses
                      </p>

                      <p className="checkout-address__section-description">
                        Choose where you would like
                        your order delivered.
                      </p>
                    </div>

                    <span className="checkout-address__section-count">
                      {savedAddresses.length}
                    </span>
                  </div>

                  <div className="checkout-address__saved-list">
                    {savedAddresses.map(
                      (savedAddress) => {
                        const isSelected =
                          savedAddress.id ===
                          selectedAddressId;

                        return (
                          <button
                            key={
                              savedAddress.id
                            }
                            type="button"
                            onClick={() =>
                              handleSavedAddressSelect(
                                savedAddress,
                              )
                            }
                            aria-pressed={
                              isSelected
                            }
                            className={[
                              "checkout-address-card",
                              isSelected
                                ? "checkout-address-card--selected"
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            <div className="checkout-address-card__top">
                              <div
                                className={[
                                  "checkout-address-card__radio",
                                  isSelected
                                    ? "checkout-address-card__radio--selected"
                                    : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              >
                                {isSelected ? (
                                  <Check
                                    size={12}
                                    strokeWidth={2.6}
                                  />
                                ) : null}
                              </div>

                              <div className="checkout-address-card__type">
                                <MapPin
                                  size={15}
                                  strokeWidth={1.5}
                                />

                                <span>
                                  Delivery Address
                                </span>
                              </div>

                              {savedAddress.isDefault ? (
                                <span className="checkout-address-card__default">
                                  Default
                                </span>
                              ) : null}
                            </div>

                            <div className="checkout-address-card__body">
                              <div className="checkout-address-card__identity">
                                <p className="checkout-address-card__name">
                                  {
                                    savedAddress.name
                                  }
                                </p>

                                <p className="checkout-address-card__phone">
                                  {
                                    savedAddress.phone
                                  }
                                </p>
                              </div>

                              <p className="checkout-address-card__address">
                                {
                                  savedAddress.addressLine
                                }

                                {savedAddress.landmark
                                  ? `, ${savedAddress.landmark}`
                                  : ""}

                                <br />

                                {
                                  savedAddress.city
                                }
                                {", "}
                                {
                                  savedAddress.state
                                }{" "}
                                {
                                  savedAddress.pincode
                                }
                              </p>
                            </div>

                            <span
                              className={[
                                "checkout-address-card__selected-label",
                                isSelected
                                  ? "checkout-address-card__selected-label--visible"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              Selected
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : null}

              {/* =================================================
                  ADD NEW ADDRESS
              ================================================= */}

              <button
                type="button"
                onClick={handleManualAddress}
                aria-expanded={
                  showManualForm
                }
                className={[
                  "checkout-address__add",
                  showManualForm
                    ? "checkout-address__add--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="checkout-address__add-icon">
                  <Plus
                    size={18}
                    strokeWidth={1.6}
                  />
                </span>

                <span className="checkout-address__add-copy">
                  <span className="checkout-address__add-title">
                    Add a new address
                  </span>

                  <span className="checkout-address__add-description">
                    Enter a different delivery
                    address
                  </span>
                </span>

                <span className="checkout-address__add-state">
                  {showManualForm
                    ? "Editing"
                    : "Add"}
                </span>
              </button>

              {/* =================================================
                  MANUAL FORM
              ================================================= */}

              {showManualForm ? (
                <ManualAddressForm
                  address={address}
                  setAddress={setAddress}
                />
              ) : null}

              {/* =================================================
                  SELECTED SUMMARY
              ================================================= */}

              {selectedSavedAddress &&
              !showManualForm ? (
                <div className="checkout-address__selected">
                  <div className="checkout-address__selected-icon">
                    <Check
                      size={16}
                      strokeWidth={2}
                    />
                  </div>

                  <div>
                    <p className="checkout-address__selected-label">
                      Delivery address selected
                    </p>

                    <p className="checkout-address__selected-name">
                      {
                        selectedSavedAddress.name
                      }{" "}
                      <span>•</span>{" "}
                      {
                        selectedSavedAddress.phone
                      }
                    </p>

                    <p className="checkout-address__selected-location">
                      {
                        selectedSavedAddress.city
                      }
                      {", "}
                      {
                        selectedSavedAddress.state
                      }{" "}
                      {
                        selectedSavedAddress.pincode
                      }
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    );
  }

  /* =========================================================
     GUEST / MANUAL ADDRESS VIEW
  ========================================================= */

  return (
    <section className="checkout-address">
      <header className="checkout-address__header">
        <div className="checkout-address__step">
          <span>02</span>
        </div>

        <div className="checkout-address__header-content">
          <p className="checkout-address__eyebrow">
            Delivery Address
          </p>

          <h2 className="checkout-address__title">
            Where should we deliver?
          </h2>

          <p className="checkout-address__description">
            Enter the address where you&apos;d like
            your order delivered.
          </p>
        </div>
      </header>

      <div className="checkout-address__guest-form">
        <ManualAddressFields
          address={address}
          setAddress={setAddress}
        />
      </div>
    </section>
  );
}

/* ============================================================
   MANUAL ADDRESS FORM
============================================================ */

function ManualAddressForm({
  address,
  setAddress,
}: {
  address: CheckoutAddressType;
  setAddress: (
    address: Partial<CheckoutAddressType>,
  ) => void;
}) {
  return (
    <div className="checkout-address__manual-form">
      <div className="checkout-address__form-heading">
        <div>
          <p className="checkout-address__section-label">
            New Delivery Address
          </p>

          <p className="checkout-address__section-description">
            Enter your complete delivery details.
          </p>
        </div>
      </div>

      <ManualAddressFields
        address={address}
        setAddress={setAddress}
      />
    </div>
  );
}

/* ============================================================
   MANUAL ADDRESS FIELDS
============================================================ */

function ManualAddressFields({
  address,
  setAddress,
}: {
  address: CheckoutAddressType;
  setAddress: (
    address: Partial<CheckoutAddressType>,
  ) => void;
}) {
  return (
    <div className="checkout-address-fields">
      <Field
        label="First Name"
        value={address.firstName}
        onChange={(value) =>
          setAddress({
            firstName: value,
          })
        }
      />

      <Field
        label="Last Name"
        value={address.lastName}
        onChange={(value) =>
          setAddress({
            lastName: value,
          })
        }
      />

      <div className="checkout-address-fields__full">
        <Field
          label="Address"
          value={address.addressLine1}
          onChange={(value) =>
            setAddress({
              addressLine1: value,
            })
          }
          placeholder="House / Flat / Street"
        />
      </div>

      <div className="checkout-address-fields__full">
        <Field
          label="Apartment / Area"
          value={address.addressLine2 ?? ""}
          onChange={(value) =>
            setAddress({
              addressLine2: value,
            })
          }
          placeholder="Apartment, locality, area"
        />
      </div>

      <Field
        label="Landmark"
        value={address.landmark ?? ""}
        onChange={(value) =>
          setAddress({
            landmark: value,
          })
        }
        placeholder="Optional"
      />

      <Field
        label="City"
        value={address.city}
        onChange={(value) =>
          setAddress({
            city: value,
          })
        }
      />

      <Field
        label="State"
        value={address.state}
        onChange={(value) =>
          setAddress({
            state: value,
          })
        }
      />

      <Field
        label="PIN Code"
        value={address.postalCode}
        inputMode="numeric"
        onChange={(value) =>
          setAddress({
            postalCode: value
              .replace(/\D/g, "")
              .slice(0, 6),
          })
        }
      />

      <SaveAddressCheckbox
        checked={!!address.isDefault}
        onChange={(checked) =>
          setAddress({
            isDefault: checked,
          })
        }
      />
    </div>
  );
}

/* ============================================================
   SAVE ADDRESS CHECKBOX
============================================================ */

function SaveAddressCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="checkout-address__save">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
      />

      <span className="checkout-address__save-box">
        <Check
          size={12}
          strokeWidth={2.4}
        />
      </span>

      <span className="checkout-address__save-text">
        Save this address for future orders
      </span>
    </label>
  );
}

/* ============================================================
   LOADING STATE
============================================================ */

function AddressLoadingState() {
  return (
    <div
      className="checkout-address-loading"
      aria-busy="true"
      aria-label="Loading saved addresses"
    >
      {[1, 2].map((item) => (
        <div
          key={item}
          className="checkout-address-loading__card"
        >
          <div className="checkout-address-loading__top">
            <span />
            <span />
            <span />
          </div>

          <div className="checkout-address-loading__line checkout-address-loading__line--name" />
          <div className="checkout-address-loading__line checkout-address-loading__line--phone" />
          <div className="checkout-address-loading__line" />
          <div className="checkout-address-loading__line checkout-address-loading__line--wide" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   APPLY SAVED ADDRESS
============================================================ */

function applySavedAddress(
  savedAddress: CustomerAddress,
  setAddress: (
    address: Partial<CheckoutAddressType>,
  ) => void,
  setContact: (contact: {
    email?: string;
    phone?: string;
  }) => void,
) {
  const { firstName, lastName } =
    splitName(savedAddress.name);

  setAddress({
    firstName,
    lastName,
    addressLine1:
      savedAddress.addressLine,
    addressLine2: "",
    landmark:
      savedAddress.landmark ?? "",
    city: savedAddress.city,
    state: savedAddress.state,
    postalCode:
      savedAddress.pincode,
    country: "India",
    isDefault:
      savedAddress.isDefault,
  });

  setContact({
    phone: normalizeIndianPhone(
      savedAddress.phone,
    ),
  });
}

/* ============================================================
   NAME SPLITTER
============================================================ */

function splitName(name: string): {
  firstName: string;
  lastName: string;
} {
  const normalized = name.trim();

  if (!normalized) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const parts =
    normalized.split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  return {
    firstName: parts[0],
    lastName:
      parts.slice(1).join(" "),
  };
}

/* ============================================================
   PHONE NORMALIZER
============================================================ */

function normalizeIndianPhone(
  phone: string,
): string {
  const digits =
    phone.replace(/\D/g, "");

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return digits.slice(2);
  }

  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    return digits.slice(1);
  }

  return digits.slice(-10);
}

/* ============================================================
   ADDRESS MATCHER
============================================================ */

function isSameAddress(
  savedAddress: CustomerAddress,
  checkoutAddress: CheckoutAddressType,
): boolean {
  const fullName = [
    checkoutAddress.firstName,
    checkoutAddress.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
    .toLowerCase();

  return (
    savedAddress.name
      .trim()
      .toLowerCase() ===
      fullName &&
    savedAddress.addressLine
      .trim()
      .toLowerCase() ===
      checkoutAddress.addressLine1
        .trim()
        .toLowerCase() &&
    savedAddress.city
      .trim()
      .toLowerCase() ===
      checkoutAddress.city
        .trim()
        .toLowerCase() &&
    savedAddress.state
      .trim()
      .toLowerCase() ===
      checkoutAddress.state
        .trim()
        .toLowerCase() &&
    savedAddress.pincode.trim() ===
      checkoutAddress.postalCode.trim() &&
    (savedAddress.landmark ?? "")
      .trim()
      .toLowerCase() ===
      (checkoutAddress.landmark ?? "")
        .trim()
        .toLowerCase()
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="checkout-field">
      <span className="checkout-field__label">
        {label}
      </span>

      <span className="checkout-field__control">
        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          placeholder={placeholder}
          inputMode={inputMode}
        />
      </span>
    </label>
  );
}