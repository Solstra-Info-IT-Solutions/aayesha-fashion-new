"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import "./EditAccountForm.css";

import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/lib/api/customer";

import { CustomCalendar } from "@/components/account/custom-calendar";

import { useAuthStore } from "@/store/auth-store";

import type {
  CustomerGender,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

type FormState = {
  name: string;
  phone: string;
  avatarUrl: string;
  dateOfBirth: string;
  gender: CustomerGender;
};

/* =========================================================
   HELPERS
========================================================= */

function createInitialForm(
  profile: CustomerProfile,
): FormState {
  let dateOfBirth = "";

  if (profile.customer.dateOfBirth) {
    const date = new Date(
      profile.customer.dateOfBirth,
    );

    if (!Number.isNaN(date.getTime())) {
      dateOfBirth =
        `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}-${String(
          date.getDate(),
        ).padStart(2, "0")}`;
    }
  }

  return {
    name: profile.user.name ?? "",
    phone:
      profile.user.phone ||
      profile.customer.phone ||
      "",
    avatarUrl:
      profile.user.avatarUrl ?? "",
    dateOfBirth,
    gender:
      profile.customer.gender ?? null,
  };
}

function getInitials(name: string) {
  const trimmed = name.trim();

  if (!trimmed) {
    return "AF";
  }

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

/* =========================================================
   COMPONENT
========================================================= */

export function EditAccountForm() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const [profile, setProfile] =
    useState<CustomerProfile | null>(null);

  const [form, setForm] =
    useState<FormState | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [genderOpen, setGenderOpen] =
    useState(false);

  const [calendarOpen, setCalendarOpen] =
    useState(false);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile = useCallback(
    async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await getCustomerProfile(
            accessToken,
          );

        setProfile(response);

        setForm(
          createInitialForm(response),
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your account details.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    void loadProfile();
  }, [
    isAuthenticated,
    loadProfile,
  ]);

  /* =========================================================
     FIELD UPDATE
  ========================================================= */

  const updateField = <
    K extends keyof FormState,
  >(
    key: K,
    value: FormState[K],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setErrorMessage("");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!accessToken || !form) {
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();

    setErrorMessage("");

    if (name.length < 2) {
      setErrorMessage(
        "Please enter your full name.",
      );

      return;
    }

    if (
      !/^(?:\+91|91)?[6-9]\d{9}$/.test(
        phone,
      )
    ) {
      setErrorMessage(
        "Please enter a valid Indian phone number.",
      );

      return;
    }

    setIsSaving(true);

    const payload: UpdateCustomerProfilePayload =
      {
        name,
        phone,
        avatarUrl:
          form.avatarUrl.trim(),
        dateOfBirth:
          form.dateOfBirth
            ? new Date(
                `${form.dateOfBirth}T00:00:00`,
              ).toISOString()
            : null,
        gender: form.gender,
      };

    try {
      const response =
        await updateCustomerProfile(
          accessToken,
          payload,
        );

      setProfile(response);

      setForm(
        createInitialForm(response),
      );

      setGenderOpen(false);
      setCalendarOpen(false);

      toast.success(
        "Account details updated successfully.",
      );

      window.location.href =
        "/account";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your account.";

      setErrorMessage(message);

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     AUTH STATE
  ========================================================= */

  if (!isAuthenticated) {
    return (
      <section className="edit-account">
        <div className="edit-account__state">
          <div className="edit-account__state-content">
            <p className="edit-account__eyebrow">
              Account
            </p>

            <h1 className="edit-account__state-title">
              Sign in to edit your account
            </h1>

            <p className="edit-account__state-description">
              Please sign in before changing your
              account details.
            </p>

            <Link
              href="/login?callbackUrl=/account/edit"
              className="edit-account__primary-button"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <section className="edit-account">
        <div className="edit-account__state">
          <div className="edit-account__loading">
            <Loader2
              size={19}
              strokeWidth={1.7}
              className="edit-account__loading-icon"
            />

            <span>
              Loading your account...
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (!profile || !form) {
    return (
      <section className="edit-account">
        <div className="edit-account__state">
          <div className="edit-account__state-content">
            <p className="edit-account__eyebrow">
              Account
            </p>

            <h1 className="edit-account__state-title">
              Unable to load account
            </h1>

            <p className="edit-account__state-description">
              {errorMessage ||
                "Something went wrong while loading your account."}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadProfile();
              }}
              className="edit-account__primary-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const initials = getInitials(
    profile.user.name,
  );

  return (
    <section className="edit-account">
      <div className="edit-account__container">
        {/* =====================================================
            BACK
        ====================================================== */}

        <Link
          href="/account"
          className="edit-account__back"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
          />

          <span>Back to Account</span>
        </Link>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="edit-account__header">
          <div>
            <p className="edit-account__eyebrow">
              Account Settings
            </p>

            <h1 className="edit-account__title">
              Edit Account
            </h1>

            <p className="edit-account__description">
              Update your personal information and
              keep your account details current.
            </p>
          </div>
        </header>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {errorMessage && (
          <div
            role="alert"
            className="edit-account__error"
          >
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="edit-account__form"
        >
          {/* ===================================================
              PROFILE SUMMARY
          ==================================================== */}

          <div className="edit-account__profile">
            <div className="edit-account__avatar">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={
                    profile.user.name ||
                    "Profile"
                  }
                  className="edit-account__avatar-image"
                />
              ) : (
                <span>
                  {initials}
                </span>
              )}
            </div>

            <div className="edit-account__profile-info">
              <p className="edit-account__section-eyebrow">
                Profile
              </p>

              <h2 className="edit-account__profile-name">
                {profile.user.name}
              </h2>

              <p className="edit-account__profile-email">
                {profile.user.email}
              </p>
            </div>
          </div>

          {/* ===================================================
              PERSONAL DETAILS
          ==================================================== */}

          <div className="edit-account__details">
            <div className="edit-account__section-heading">
              <div className="edit-account__section-icon">
                <UserRound
                  size={17}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="edit-account__section-eyebrow">
                  Personal Details
                </p>

                <h2 className="edit-account__section-title">
                  Account Information
                </h2>
              </div>
            </div>

            <div className="edit-account__fields">
              {/* =================================================
                  FULL NAME
              ================================================== */}

              <div className="edit-account__field">
                <label
                  htmlFor="account-name"
                  className="edit-account__label"
                >
                  Full Name
                </label>

                <div className="edit-account__input-wrap">
                  <UserRound
                    size={16}
                    strokeWidth={1.7}
                    className="edit-account__input-icon"
                  />

                  <input
                    id="account-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(event) => {
                      updateField(
                        "name",
                        event.target.value,
                      );
                    }}
                    autoComplete="name"
                    className="edit-account__input"
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div className="edit-account__field">
                <label
                  htmlFor="account-email"
                  className="edit-account__label"
                >
                  Email Address
                </label>

                <div className="edit-account__input-wrap edit-account__input-wrap--readonly">
                  <Mail
                    size={16}
                    strokeWidth={1.7}
                    className="edit-account__input-icon"
                  />

                  <input
                    id="account-email"
                    type="email"
                    value={
                      profile.user.email
                    }
                    readOnly
                    className="edit-account__input edit-account__input--readonly"
                  />
                </div>

                <p className="edit-account__help">
                  Email changes require a separate
                  verification flow.
                </p>
              </div>

              {/* =================================================
                  PHONE
              ================================================== */}

              <div className="edit-account__field">
                <label
                  htmlFor="account-phone"
                  className="edit-account__label"
                >
                  Phone Number
                </label>

                <div className="edit-account__input-wrap">
                  <Phone
                    size={16}
                    strokeWidth={1.7}
                    className="edit-account__input-icon"
                  />

                  <input
                    id="account-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => {
                      updateField(
                        "phone",
                        event.target.value,
                      );
                    }}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 9876543210"
                    className="edit-account__input"
                  />
                </div>
              </div>

              {/* =================================================
                  GENDER
              ================================================== */}

              <div className="edit-account__field edit-account__field--dropdown">
                <label className="edit-account__label">
                  Gender
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setGenderOpen(
                      (current) =>
                        !current,
                    );

                    setCalendarOpen(false);
                  }}
                  className={`edit-account__select ${
                    genderOpen
                      ? "edit-account__select--open"
                      : ""
                  }`}
                >
                  <span
                    className={
                      form.gender
                        ? "edit-account__select-value"
                        : "edit-account__select-placeholder"
                    }
                  >
                    {form.gender ===
                    "female"
                      ? "Female"
                      : form.gender ===
                          "male"
                        ? "Male"
                        : form.gender ===
                            "other"
                          ? "Other"
                          : "Prefer not to say"}
                  </span>

                  <ChevronDown
                    size={16}
                    strokeWidth={1.7}
                    className={`edit-account__select-icon ${
                      genderOpen
                        ? "edit-account__select-icon--open"
                        : ""
                    }`}
                  />
                </button>

                {genderOpen && (
                  <div className="edit-account__dropdown">
                    <div className="edit-account__dropdown-header">
                      Select preference
                    </div>

                    <div className="edit-account__dropdown-options">
                      {[
                        {
                          value: null,
                          label:
                            "Prefer not to say",
                        },
                        {
                          value:
                            "female" as const,
                          label:
                            "Female",
                        },
                        {
                          value:
                            "male" as const,
                          label:
                            "Male",
                        },
                        {
                          value:
                            "other" as const,
                          label:
                            "Other",
                        },
                      ].map(
                        (option) => {
                          const selected =
                            form.gender ===
                            option.value;

                          return (
                            <button
                              key={
                                option.value ??
                                "none"
                              }
                              type="button"
                              onClick={() => {
                                updateField(
                                  "gender",
                                  option.value,
                                );

                                setGenderOpen(
                                  false,
                                );
                              }}
                              className={`edit-account__dropdown-option ${
                                selected
                                  ? "edit-account__dropdown-option--selected"
                                  : ""
                              }`}
                            >
                              <span>
                                {
                                  option.label
                                }
                              </span>

                              {selected && (
                                <Check
                                  size={15}
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  DATE OF BIRTH
              ================================================== */}

              <div className="edit-account__field edit-account__field--calendar">
                <label className="edit-account__label">
                  Date of Birth
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarOpen(
                      (current) =>
                        !current,
                    );

                    setGenderOpen(false);
                  }}
                  className={`edit-account__select ${
                    calendarOpen
                      ? "edit-account__select--open"
                      : ""
                  }`}
                >
                  <span
                    className={
                      form.dateOfBirth
                        ? "edit-account__select-value"
                        : "edit-account__select-placeholder"
                    }
                  >
                    {form.dateOfBirth
                      ? new Intl.DateTimeFormat(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        ).format(
                          new Date(
                            `${form.dateOfBirth}T00:00:00`,
                          ),
                        )
                      : "Select date of birth"}
                  </span>

                  <CalendarDays
                    size={16}
                    strokeWidth={1.7}
                    className="edit-account__select-icon"
                  />
                </button>

                {calendarOpen && (
                  <div className="edit-account__calendar">
                    <CustomCalendar
                      value={
                        form.dateOfBirth
                      }
                      onChange={(value) => {
                        updateField(
                          "dateOfBirth",
                          value,
                        );
                      }}
                      onClose={() => {
                        setCalendarOpen(
                          false,
                        );
                      }}
                      maxDate={new Date()
                        .toISOString()
                        .slice(0, 10)}
                    />
                  </div>
                )}
              </div>

              {/* =================================================
                  AVATAR URL
              ================================================== */}

              <div className="edit-account__field">
                <label
                  htmlFor="account-avatar"
                  className="edit-account__label"
                >
                  Profile Image URL
                </label>

                <input
                  id="account-avatar"
                  name="avatarUrl"
                  type="url"
                  value={form.avatarUrl}
                  onChange={(event) => {
                    updateField(
                      "avatarUrl",
                      event.target.value,
                    );
                  }}
                  placeholder="https://..."
                  className="edit-account__input edit-account__input--standalone"
                />

                <p className="edit-account__help">
                  Enter a publicly accessible image
                  URL.
                </p>
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="edit-account__actions">
              <Link
                href="/account"
                className="edit-account__secondary-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="edit-account__primary-button edit-account__save-button"
              >
                {isSaving ? (
                  <Loader2
                    size={16}
                    strokeWidth={1.8}
                    className="edit-account__button-icon edit-account__button-icon--loading"
                  />
                ) : (
                  <Save
                    size={16}
                    strokeWidth={1.8}
                    className="edit-account__button-icon"
                  />
                )}

                <span>
                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* =====================================================
            SECURITY NOTE
        ====================================================== */}

        <div className="edit-account__note">
          <Check
            size={17}
            strokeWidth={1.8}
            className="edit-account__note-icon"
          />

          <p>
            Your account information is securely
            saved to your Aayesha Fashion customer
            profile. Changes take effect after you
            save your account.
          </p>
        </div>
      </div>
    </section>
  );
}