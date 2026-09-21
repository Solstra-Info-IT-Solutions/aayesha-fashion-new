"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import "./AddressForm.css";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth-store";

import {
  createCustomerAddress,
  getCustomerAddress,
  updateCustomerAddress,
  type CreateCustomerAddressPayload,
} from "@/lib/customer-api";

/* =========================================================
   TYPES
========================================================= */

type AddressFormProps = {
  mode: "create" | "edit";
};

type FormState = {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
};

type FormErrors = Partial<
  Record<keyof FormState, string>
>;

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm: FormState = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

/* =========================================================
   INDIAN STATES / UTs
========================================================= */

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/* =========================================================
   HELPERS
========================================================= */

function normalizePhoneForInput(phone: string): string {
  const value = phone.trim();

  if (value.startsWith("+91")) {
    return value.slice(3);
  }

  if (value.startsWith("91") && value.length === 12) {
    return value.slice(2);
  }

  return value;
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter the recipient name.";
  }

  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone =
      "Enter a valid 10-digit Indian mobile number.";
  }

  if (form.addressLine.trim().length < 5) {
    errors.addressLine =
      "Please enter your complete address.";
  }

  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }

  if (!form.state) {
    errors.state = "Please select your state.";
  }

  if (!/^[1-9][0-9]{5}$/.test(form.pincode.trim())) {
    errors.pincode =
      "Enter a valid 6-digit pincode.";
  }

  if (form.landmark.trim().length > 150) {
    errors.landmark =
      "Landmark must be 150 characters or less.";
  }

  return errors;
}

/* =========================================================
   COMPONENT
========================================================= */

export function AddressForm({
  mode,
}: AddressFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const addressId = searchParams.get("id");

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isLoading, setIsLoading] =
    useState(mode === "edit");

  const [isSaving, setIsSaving] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const pageTitle = useMemo(
    () =>
      mode === "create"
        ? "Add New Address"
        : "Edit Address",
    [mode],
  );

  const pageDescription = useMemo(
    () =>
      mode === "create"
        ? "Save a delivery address for a faster checkout experience."
        : "Update the delivery details saved to your account.",
    [mode],
  );

  /* =======================================================
     AUTH + LOAD EDIT ADDRESS
  ======================================================= */

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      const callbackUrl =
        mode === "create"
          ? "/account/addresses/new"
          : `/account/addresses/edit?id=${encodeURIComponent(
              addressId ?? "",
            )}`;

      router.replace(
        `/login?callbackUrl=${encodeURIComponent(
          callbackUrl,
        )}`,
      );

      return;
    }

    if (mode === "create") {
      setIsLoading(false);
      return;
    }

    if (!addressId) {
      setPageError(
        "The address could not be identified.",
      );

      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadAddress = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const address = await getCustomerAddress(
          accessToken,
          addressId,
        );

        if (cancelled) {
          return;
        }

        setForm({
          name: address.name ?? "",
          phone: normalizePhoneForInput(
            address.phone ?? "",
          ),
          addressLine:
            address.addressLine ?? "",
          city: address.city ?? "",
          state: address.state ?? "",
          pincode: address.pincode ?? "",
          landmark: address.landmark ?? "",
          isDefault: Boolean(
            address.isDefault,
          ),
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load this address.";

        setPageError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAddress();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    addressId,
    isAuthenticated,
    isInitialized,
    mode,
    router,
  ]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setPageError("");
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!accessToken) {
      const callbackUrl =
        mode === "create"
          ? "/account/addresses/new"
          : `/account/addresses/edit?id=${encodeURIComponent(
              addressId ?? "",
            )}`;

      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          callbackUrl,
        )}`,
      );

      return;
    }

    if (mode === "edit" && !addressId) {
      setPageError("Address ID is missing.");

      toast.error("Address ID is missing.");

      return;
    }

    const validationErrors =
      validateForm(form);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);

      const firstError =
        Object.values(validationErrors).find(
          Boolean,
        );

      if (firstError) {
        toast.error(firstError);
      }

      return;
    }

    setIsSaving(true);
    setPageError("");
    setErrors({});

    const payload: CreateCustomerAddressPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      addressLine:
        form.addressLine.trim(),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim(),
      isDefault: form.isDefault,
    };

    try {
      if (mode === "create") {
        await createCustomerAddress(
          accessToken,
          payload,
        );

        toast.success(
          "Address added successfully.",
        );
      } else {
        await updateCustomerAddress(
          accessToken,
          addressId as string,
          payload,
        );

        toast.success(
          "Address updated successfully.",
        );
      }

      router.push("/account/addresses");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : mode === "create"
            ? "Unable to add the address."
            : "Unable to update the address.";

      setPageError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (!isInitialized || isLoading) {
    return (
      <section className="address-form">
        <div className="address-form__loading">
          <div className="address-form__loading-header">
            <div className="address-form__skeleton address-form__skeleton--eyebrow" />

            <div className="address-form__skeleton address-form__skeleton--title" />

            <div className="address-form__skeleton address-form__skeleton--description" />
          </div>

          <div className="address-form__loading-fields">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="address-form__skeleton address-form__skeleton--field"
                />
              ),
            )}
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     AUTH FALLBACK
  ======================================================= */

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  /* =======================================================
     MISSING ADDRESS
  ======================================================= */

  if (mode === "edit" && !addressId) {
    return (
      <section className="address-form">
        <div className="address-form__empty">
          <div className="address-form__empty-icon">
            <MapPin
              size={24}
              strokeWidth={1.35}
            />
          </div>

          <p className="address-form__eyebrow">
            Delivery Details
          </p>

          <h1 className="address-form__empty-title">
            Address unavailable
          </h1>

          <p className="address-form__empty-description">
            We could not identify the address you
            are trying to edit.
          </p>

          <Link
            href="/account/addresses"
            className="address-form__primary-action"
          >
            Back to Addresses
          </Link>
        </div>
      </section>
    );
  }

  /* =======================================================
     FORM
  ======================================================= */

  return (
    <section className="address-form">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="address-form__header">
        <Link
          href="/account/addresses"
          className="address-form__back"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
          />

          <span>Back to Addresses</span>
        </Link>

        <div className="address-form__hero">
          <div className="address-form__hero-icon">
            <MapPin
              size={21}
              strokeWidth={1.35}
            />
          </div>

          <div>
            <p className="address-form__eyebrow">
              Delivery Details
            </p>

            <h1 className="address-form__title">
              {pageTitle}
            </h1>

            <p className="address-form__description">
              {pageDescription}
            </p>
          </div>
        </div>
      </header>

      {/* ===================================================
          PAGE ERROR
      =================================================== */}

      {pageError ? (
        <div className="address-form__page-error">
          <p>{pageError}</p>
        </div>
      ) : null}

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="address-form__body">
          {/* =================================================
              RECIPIENT
          ================================================= */}

          <section className="address-form__section">
            <div className="address-form__section-heading">
              <span className="address-form__section-number">
                01
              </span>

              <div>
                <h2 className="address-form__section-title">
                  Recipient Information
                </h2>

                <p className="address-form__section-description">
                  Enter the name and phone number of
                  the person receiving the order.
                </p>
              </div>
            </div>

            <div className="address-form__fields address-form__fields--two">
              {/* NAME */}

              <div className="address-field">
                <label
                  htmlFor="address-name"
                  className="address-field__label"
                >
                  Full Name
                </label>

                <input
                  id="address-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="Enter recipient name"
                  className={`address-field__input ${
                    errors.name
                      ? "address-field__input--error"
                      : ""
                  }`}
                />

                {errors.name ? (
                  <p className="address-field__error">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              {/* PHONE */}

              <div className="address-field">
                <label
                  htmlFor="address-phone"
                  className="address-field__label"
                >
                  Mobile Number
                </label>

                <div
                  className={`address-field__phone ${
                    errors.phone
                      ? "address-field__phone--error"
                      : ""
                  }`}
                >
                  <span className="address-field__country">
                    +91
                  </span>

                  <input
                    id="address-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="10-digit mobile number"
                    className="address-field__phone-input"
                  />
                </div>

                {errors.phone ? (
                  <p className="address-field__error">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {/* =================================================
              DELIVERY ADDRESS
          ================================================= */}

          <section className="address-form__section">
            <div className="address-form__section-heading">
              <span className="address-form__section-number">
                02
              </span>

              <div>
                <h2 className="address-form__section-title">
                  Delivery Address
                </h2>

                <p className="address-form__section-description">
                  Use the complete address where your
                  order should be delivered.
                </p>
              </div>
            </div>

            <div className="address-form__fields">
              {/* ADDRESS */}

              <div className="address-field">
                <label
                  htmlFor="address-line"
                  className="address-field__label"
                >
                  Address
                </label>

                <textarea
                  id="address-line"
                  rows={3}
                  autoComplete="street-address"
                  value={form.addressLine}
                  onChange={(event) =>
                    updateField(
                      "addressLine",
                      event.target.value,
                    )
                  }
                  placeholder="House / Flat / Building / Street"
                  className={`address-field__textarea ${
                    errors.addressLine
                      ? "address-field__textarea--error"
                      : ""
                  }`}
                />

                {errors.addressLine ? (
                  <p className="address-field__error">
                    {errors.addressLine}
                  </p>
                ) : null}
              </div>

              {/* CITY + STATE */}

              <div className="address-form__fields address-form__fields--two">
                <div className="address-field">
                  <label
                    htmlFor="address-city"
                    className="address-field__label"
                  >
                    City
                  </label>

                  <input
                    id="address-city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value,
                      )
                    }
                    placeholder="Enter city"
                    className={`address-field__input ${
                      errors.city
                        ? "address-field__input--error"
                        : ""
                    }`}
                  />

                  {errors.city ? (
                    <p className="address-field__error">
                      {errors.city}
                    </p>
                  ) : null}
                </div>

                <div className="address-field">
                  <label
                    htmlFor="address-state"
                    className="address-field__label"
                  >
                    State
                  </label>

                  <div className="address-field__select-wrap">
                    <select
                      id="address-state"
                      autoComplete="address-level1"
                      value={form.state}
                      onChange={(event) =>
                        updateField(
                          "state",
                          event.target.value,
                        )
                      }
                      className={`address-field__select ${
                        errors.state
                          ? "address-field__select--error"
                          : ""
                      }`}
                    >
                      <option value="">
                        Select state
                      </option>

                      {INDIA_STATES.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown
                      size={16}
                      strokeWidth={1.6}
                      className="address-field__select-icon"
                    />
                  </div>

                  {errors.state ? (
                    <p className="address-field__error">
                      {errors.state}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* PINCODE + LANDMARK */}

              <div className="address-form__fields address-form__fields--two">
                <div className="address-field">
                  <label
                    htmlFor="address-pincode"
                    className="address-field__label"
                  >
                    Pincode
                  </label>

                  <input
                    id="address-pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(event) =>
                      updateField(
                        "pincode",
                        event.target.value.replace(
                          /\D/g,
                          "",
                        ),
                      )
                    }
                    placeholder="6-digit pincode"
                    className={`address-field__input ${
                      errors.pincode
                        ? "address-field__input--error"
                        : ""
                    }`}
                  />

                  {errors.pincode ? (
                    <p className="address-field__error">
                      {errors.pincode}
                    </p>
                  ) : null}
                </div>

                <div className="address-field">
                  <label
                    htmlFor="address-landmark"
                    className="address-field__label"
                  >
                    Landmark
                    <span className="address-field__optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id="address-landmark"
                    type="text"
                    value={form.landmark}
                    onChange={(event) =>
                      updateField(
                        "landmark",
                        event.target.value,
                      )
                    }
                    placeholder="Near a known landmark"
                    className={`address-field__input ${
                      errors.landmark
                        ? "address-field__input--error"
                        : ""
                    }`}
                  />

                  {errors.landmark ? (
                    <p className="address-field__error">
                      {errors.landmark}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* DEFAULT ADDRESS */}

              <label
                className={`address-default ${
                  form.isDefault
                    ? "address-default--active"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) =>
                    updateField(
                      "isDefault",
                      event.target.checked,
                    )
                  }
                  className="sr-only"
                />

                <span className="address-default__check">
                  <Check
                    size={14}
                    strokeWidth={2}
                  />
                </span>

                <span className="address-default__content">
                  <span className="address-default__title">
                    Make this my default address
                  </span>

                  <span className="address-default__description">
                    This address will be selected
                    automatically during checkout.
                  </span>
                </span>

                <span className="address-default__badge">
                  Default
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="address-form__actions">
          <Link
            href="/account/addresses"
            className="address-form__secondary-action"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="address-form__save-action"
          >
            {isSaving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                  strokeWidth={1.7}
                />

                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check
                  size={16}
                  strokeWidth={1.8}
                />

                <span>
                  {mode === "create"
                    ? "Save Address"
                    : "Update Address"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}