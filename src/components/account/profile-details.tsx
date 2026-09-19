"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Edit3,
  Home,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/lib/api/customer";
import { deleteCustomerAccount } from "@/lib/customer-api";
import { useAuthStore } from "@/store/auth-store";

import {
  AccountConfirmDialog,
} from "@/components/account/account-confirm-dialog";

import type {
  CustomerGender,
  CustomerProfile,
  UpdateCustomerProfilePayload,
} from "@/types/customer";

/* =========================================================
   CONSTANTS
========================================================= */

const availableSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

const availableColors = [
  "Black",
  "Ivory",
  "Beige",
  "Blush",
  "Rose",
  "Navy",
  "Olive",
];

/* =========================================================
   TYPES
========================================================= */

type FormState = {
  name: string;
  phone: string;
  avatarUrl: string;
  dateOfBirth: string;
  gender: CustomerGender;
  preferredSizes: string[];
  preferredColors: string[];
  marketingEmails: boolean;
  marketingWhatsapp: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function createFormState(
  profile: CustomerProfile,
): FormState {
  const date = profile.customer.dateOfBirth
    ? new Date(profile.customer.dateOfBirth)
    : null;

  const formattedDate = date
    ? `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`
    : "";

  return {
    name: profile.user.name ?? "",
    phone:
      profile.user.phone ||
      profile.customer.phone ||
      "",
    avatarUrl:
      profile.user.avatarUrl ?? "",
    dateOfBirth: formattedDate,
    gender:
      profile.customer.gender ?? null,
    preferredSizes: [
      ...(profile.customer.preferredSizes ?? []),
    ],
    preferredColors: [
      ...(profile.customer.preferredColors ?? []),
    ],
    marketingEmails:
      profile.customer.marketingEmails ?? false,
    marketingWhatsapp:
      profile.customer.marketingWhatsapp ?? false,
  };
}

function getInitials(name: string) {
  const value = name.trim();

  if (!value) {
    return "AF";
  }

  const parts = value.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not added";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProfileDetails() {
  const router = useRouter();

  /* =======================================================
     AUTH
  ======================================================= */

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  /* =======================================================
     PROFILE STATE
  ======================================================= */

  const [profile, setProfile] =
    useState<CustomerProfile | null>(null);

  const [form, setForm] =
    useState<FormState | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [confirmType, setConfirmType] =
    useState<"delete" | "logout" | null>(
      null,
    );

  const [
    isProcessingAccountAction,
    setIsProcessingAccountAction,
  ] = useState(false);

  /* =======================================================
     LOAD PROFILE
  ======================================================= */

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
          createFormState(response),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your profile.";

        setErrorMessage(message);
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

  /* =======================================================
     FORM HELPERS
  ======================================================= */

  const updateForm = <
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

    setShowSuccess(false);
  };

  const toggleSize = (size: string) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.preferredSizes.includes(size);

      return {
        ...current,
        preferredSizes: exists
          ? current.preferredSizes.filter(
              (item) => item !== size,
            )
          : [
              ...current.preferredSizes,
              size,
            ],
      };
    });

    setShowSuccess(false);
  };

  const toggleColor = (color: string) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.preferredColors.includes(
          color,
        );

      return {
        ...current,
        preferredColors: exists
          ? current.preferredColors.filter(
              (item) => item !== color,
            )
          : [
              ...current.preferredColors,
              color,
            ],
      };
    });

    setShowSuccess(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    if (
      !accessToken ||
      !form ||
      !profile
    ) {
      return;
    }

    setErrorMessage("");
    setShowSuccess(false);

    const name = form.name.trim();
    const phone = form.phone.trim();

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
        preferredSizes: [
          ...form.preferredSizes,
        ],
        preferredColors: [
          ...form.preferredColors,
        ],
        marketingEmails:
          form.marketingEmails,
        marketingWhatsapp:
          form.marketingWhatsapp,
      };

    try {
      const response =
        await updateCustomerProfile(
          accessToken,
          payload,
        );

      setProfile(response);
      setForm(
        createFormState(response),
      );

      setIsEditing(false);
      setShowSuccess(true);

      toast.success(
        "Profile updated successfully.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update your profile.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setForm(
      createFormState(profile),
    );

    setIsEditing(false);
    setErrorMessage("");
    setShowSuccess(false);
  };

  /* =======================================================
     ACCOUNT CONFIRM
  ======================================================= */

  const closeConfirmDialog = () => {
    if (isProcessingAccountAction) {
      return;
    }

    setConfirmType(null);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogoutConfirm = async () => {
    if (isProcessingAccountAction) {
      return;
    }

    setIsProcessingAccountAction(true);

    try {
      await logout();

      toast.success(
        "You have been signed out.",
      );

      setConfirmType(null);

      router.replace("/");
      router.refresh();
    } catch {
      toast.error(
        "Unable to sign out. Please try again.",
      );
    } finally {
      setIsProcessingAccountAction(false);
    }
  };

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const handleDeleteConfirm = async () => {
    if (isProcessingAccountAction) {
      return;
    }

    if (!accessToken) {
      toast.error(
        "Your session has expired. Please sign in again.",
      );

      setConfirmType(null);
      router.replace("/login");

      return;
    }

    setIsProcessingAccountAction(true);

    try {
      await deleteCustomerAccount(
        accessToken,
      );

      try {
        await logout();
      } catch {
        // Account deletion already succeeded.
      }

      toast.success(
        "Your account has been deleted.",
      );

      setConfirmType(null);

      router.replace(
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
      setIsProcessingAccountAction(false);
    }
  };

  /* =======================================================
     DERIVED
  ======================================================= */

  const initials = useMemo(
    () =>
      getInitials(
        profile?.user.name ?? "",
      ),
    [profile?.user.name],
  );

  /* =======================================================
     AUTH GUARD
  ======================================================= */

  if (!isAuthenticated) {
    return (
      <section className="profile-details profile-details--state">
        <div className="profile-details__state-inner">
          <div className="profile-details__state-icon">
            <UserRound
              size={22}
              strokeWidth={1.4}
            />
          </div>

          <p className="profile-details__eyebrow">
            My Account
          </p>

          <h1 className="profile-details__state-title">
            Sign in to view your account
          </h1>

          <p className="profile-details__state-copy">
            Please sign in to access your
            profile, preferences and account
            settings.
          </p>

          <div className="profile-details__state-actions">
            <Link
              href="/login?callbackUrl=/account"
              className="profile-details__button profile-details__button--primary"
            >
              Sign In
            </Link>

            <Link
              href="/"
              className="profile-details__button profile-details__button--secondary"
            >
              <Home size={15} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <section className="profile-details profile-details--state">
        <div className="profile-details__loading">
          <Loader2
            size={19}
            className="profile-details__spin"
          />

          <span>
            Loading your profile...
          </span>
        </div>
      </section>
    );
  }

  /* =======================================================
     PROFILE UNAVAILABLE
  ======================================================= */

  if (!profile || !form) {
    return (
      <section className="profile-details profile-details--state">
        <div className="profile-details__state-inner">
          <div className="profile-details__state-icon">
            <UserRound
              size={22}
              strokeWidth={1.4}
            />
          </div>

          <p className="profile-details__eyebrow">
            My Account
          </p>

          <h1 className="profile-details__state-title">
            Profile unavailable
          </h1>

          <p className="profile-details__state-copy">
            {errorMessage ||
              "We could not load your account details."}
          </p>

          <div className="profile-details__state-actions">
            <button
              type="button"
              onClick={() => {
                void loadProfile();
              }}
              className="profile-details__button profile-details__button--primary"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="profile-details__button profile-details__button--secondary"
            >
              <Home size={15} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <>
      <section className="profile-details">
        <div className="profile-details__container">
          {/* TOP NAV */}

          <div className="profile-details__topbar">
            <Link
              href="/"
              className="profile-details__back-link"
            >
              <Home size={15} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/account"
              className="profile-details__overview-link"
            >
              Account Overview
            </Link>
          </div>

          {/* HEADER */}

          <header className="profile-details__header">
            <div>
              <p className="profile-details__eyebrow">
                My Account
              </p>

              <h1 className="profile-details__page-title">
                Profile Details
              </h1>

              <p className="profile-details__page-copy">
                Manage your personal details,
                style preferences and communication
                settings from one place.
              </p>
            </div>

            <div className="profile-details__header-actions">
              {!isEditing ? (
                <Link
                  href="/account/edit"
                  className="profile-details__button profile-details__button--primary"
                >
                  <Edit3 size={15} />
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="profile-details__button profile-details__button--secondary"
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void handleSave();
                    }}
                    disabled={isSaving}
                    className="profile-details__button profile-details__button--primary"
                  >
                    {isSaving ? (
                      <Loader2
                        size={15}
                        className="profile-details__spin"
                      />
                    ) : (
                      <Save size={15} />
                    )}

                    {isSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </header>

          {/* FEEDBACK */}

          {errorMessage ? (
            <div
              role="alert"
              className="profile-details__feedback profile-details__feedback--error"
            >
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {showSuccess ? (
            <div className="profile-details__feedback profile-details__feedback--success">
              <Check size={17} />
              <span>
                Your profile has been updated
                successfully.
              </span>
            </div>
          ) : null}

          {/* CONTENT GRID */}

          <div className="profile-details__layout">
            {/* ACCOUNT SUMMARY */}

            <aside className="profile-details__sidebar">
              <div className="profile-details__summary">
                <div className="profile-details__profile-head">
                  <div className="profile-details__avatar">
                    {form.avatarUrl ? (
                      <img
                        src={form.avatarUrl}
                        alt={
                          profile.user.name ||
                          "Profile"
                        }
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="profile-details__profile-identity">
                    <h2>
                      {profile.user.name ||
                        "Your Account"}
                    </h2>

                    <p>
                      {profile.user.email}
                    </p>
                  </div>
                </div>

                <div className="profile-details__summary-details">
                  <div className="profile-details__summary-item">
                    <Mail size={17} />

                    <div>
                      <span className="profile-details__meta-label">
                        Email
                      </span>

                      <span className="profile-details__meta-value">
                        {profile.user.email}
                      </span>
                    </div>
                  </div>

                  <div className="profile-details__summary-item">
                    <Phone size={17} />

                    <div>
                      <span className="profile-details__meta-label">
                        Phone
                      </span>

                      <span className="profile-details__meta-value">
                        {profile.user.phone ||
                          profile.customer.phone ||
                          "Not added"}
                      </span>
                    </div>
                  </div>

                  <div className="profile-details__verification">
                    <BadgeCheck size={17} />

                    <span>
                      {profile.user.emailVerified
                        ? "Email verified"
                        : "Email not verified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-details__quick-links">
                <Link
                  href="/account/orders"
                  className="profile-details__quick-link"
                >
                  <ShoppingBagIcon />

                  <span>
                    <strong>Your Orders</strong>
                    <small>
                      View and track your orders
                    </small>
                  </span>

                  <ChevronRight size={16} />
                </Link>

                <Link
                  href="/account/addresses"
                  className="profile-details__quick-link"
                >
                  <span className="profile-details__quick-icon">
                    <MapPin size={15} />
                  </span>

                  <span>
                    <strong>
                      Saved Addresses
                    </strong>
                    <small>
                      Manage delivery addresses
                    </small>
                  </span>

                  <ChevronRight size={16} />
                </Link>
              </div>
            </aside>

            {/* DETAILS */}

            <div className="profile-details__content">
              {/* PERSONAL INFORMATION */}

              <section className="profile-details__section">
                <SectionHeader
                  eyebrow="Account"
                  title="Personal Information"
                  icon={
                    <UserRound size={20} />
                  }
                />

                <div className="profile-details__fields">
                  <ProfileField
                    label="Full Name"
                    editing={isEditing}
                    value={
                      profile.user.name ||
                      "Not added"
                    }
                    input={
                      <input
                        value={form.name}
                        onChange={(event) =>
                          updateForm(
                            "name",
                            event.target.value,
                          )
                        }
                        autoComplete="name"
                      />
                    }
                  />

                  <ProfileField
                    label="Email Address"
                    value={profile.user.email}
                    suffix={
                      profile.user.emailVerified
                        ? "Verified"
                        : "Unverified"
                    }
                    help="Email address is managed separately from profile editing."
                  />

                  <ProfileField
                    label="Phone Number"
                    editing={isEditing}
                    value={
                      profile.user.phone ||
                      profile.customer.phone ||
                      "Not added"
                    }
                    input={
                      <input
                        value={form.phone}
                        onChange={(event) =>
                          updateForm(
                            "phone",
                            event.target.value,
                          )
                        }
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    }
                  />

                  <ProfileField
                    label="Gender"
                    editing={isEditing}
                    value={
                      profile.customer.gender ||
                      "Not added"
                    }
                    input={
                      <div className="profile-details__select-wrap">
                        <select
                          value={
                            form.gender ?? ""
                          }
                          onChange={(event) => {
                            const value =
                              event.target
                                .value;

                            updateForm(
                              "gender",
                              value === ""
                                ? null
                                : (value as CustomerGender),
                            );
                          }}
                        >
                          <option value="">
                            Prefer not to say
                          </option>
                          <option value="female">
                            Female
                          </option>
                          <option value="male">
                            Male
                          </option>
                          <option value="other">
                            Other
                          </option>
                        </select>

                        <ChevronDown size={16} />
                      </div>
                    }
                  />

                  <ProfileField
                    label="Date of Birth"
                    editing={isEditing}
                    value={formatDate(
                      profile.customer
                        .dateOfBirth,
                    )}
                    input={
                      <div className="profile-details__date-wrap">
                        <input
                          type="date"
                          value={
                            form.dateOfBirth
                          }
                          onChange={(event) =>
                            updateForm(
                              "dateOfBirth",
                              event.target.value,
                            )
                          }
                        />

                        <CalendarDays
                          size={16}
                        />
                      </div>
                    }
                    icon={
                      <CalendarDays
                        size={16}
                      />
                    }
                  />

                  <ProfileField
                    label="Account Status"
                    value={profile.user.status}
                    status
                  />
                </div>
              </section>

              {/* STYLE PREFERENCES */}

              <section className="profile-details__section">
                <SectionHeader
                  eyebrow="Personalisation"
                  title="Style Preferences"
                  description="Choose your preferred sizes and colours. These preferences are saved to your account."
                  icon={<Ruler size={20} />}
                />

                <div className="profile-details__preference-body">
                  <PreferenceGroup
                    label="Preferred Sizes"
                    items={availableSizes}
                    selected={
                      form.preferredSizes
                    }
                    disabled={!isEditing}
                    onToggle={toggleSize}
                  />

                  <PreferenceGroup
                    label="Preferred Colours"
                    items={availableColors}
                    selected={
                      form.preferredColors
                    }
                    disabled={!isEditing}
                    onToggle={toggleColor}
                  />
                </div>
              </section>

              {/* COMMUNICATION */}

              <section className="profile-details__section">
                <SectionHeader
                  eyebrow="Communication"
                  title="Communication Preferences"
                  description="Control which brand communications you would like to receive."
                />

                <div className="profile-details__communication-grid">
                  <PreferenceToggle
                    title="Email Updates"
                    description="Collection launches, offers and account updates."
                    checked={
                      form.marketingEmails
                    }
                    disabled={!isEditing}
                    onChange={() =>
                      updateForm(
                        "marketingEmails",
                        !form.marketingEmails,
                      )
                    }
                  />

                  <PreferenceToggle
                    title="WhatsApp Updates"
                    description="Selected brand communication and important updates."
                    checked={
                      form.marketingWhatsapp
                    }
                    disabled={!isEditing}
                    onChange={() =>
                      updateForm(
                        "marketingWhatsapp",
                        !form.marketingWhatsapp,
                      )
                    }
                  />
                </div>
              </section>

              {/* ACCOUNT ACTIONS */}

              <section className="profile-details__section profile-details__section--actions">
                <SectionHeader
                  eyebrow="Account Management"
                  title="Account Actions"
                  description="Manage your active session or permanently remove your Aayesha Fashion account."
                />

                <div className="profile-details__account-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmType(
                        "logout",
                      )
                    }
                    disabled={
                      isProcessingAccountAction
                    }
                    className="profile-details__account-action"
                  >
                    <span className="profile-details__account-action-icon">
                      {isProcessingAccountAction &&
                      confirmType ===
                        "logout" ? (
                        <Loader2
                          size={17}
                          className="profile-details__spin"
                        />
                      ) : (
                        <LogOut size={17} />
                      )}
                    </span>

                    <span>
                      <strong>
                        {isProcessingAccountAction &&
                        confirmType ===
                          "logout"
                          ? "Signing Out..."
                          : "Sign Out"}
                      </strong>

                      <small>
                        Sign out from this device
                        and return to the home
                        page.
                      </small>
                    </span>

                    <ChevronRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmType(
                        "delete",
                      )
                    }
                    disabled={
                      isProcessingAccountAction
                    }
                    className="profile-details__account-action profile-details__account-action--danger"
                  >
                    <span className="profile-details__account-action-icon">
                      {isProcessingAccountAction &&
                      confirmType ===
                        "delete" ? (
                        <Loader2
                          size={17}
                          className="profile-details__spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </span>

                    <span>
                      <strong>
                        {isProcessingAccountAction &&
                        confirmType ===
                          "delete"
                          ? "Deleting Account..."
                          : "Delete Account"}
                      </strong>

                      <small>
                        Permanently remove your
                        account and associated
                        customer profile.
                      </small>
                    </span>

                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* BOTTOM ACTIONS */}

              <div className="profile-details__footer-actions">
                <div>
                  <p>
                    Aayesha Fashion Account
                  </p>

                  <span>
                    Keep your information current
                    for a smoother shopping
                    experience.
                  </span>
                </div>

                <div className="profile-details__footer-buttons">
                  <Link
                    href="/"
                    className="profile-details__button profile-details__button--secondary"
                  >
                    <Home size={15} />
                    Back to Home
                  </Link>

                  {!isEditing ? (
                    <Link
                      href="/account/edit"
                      className="profile-details__button profile-details__button--primary"
                    >
                      <Edit3 size={15} />
                      Edit Account
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        void handleSave();
                      }}
                      disabled={isSaving}
                      className="profile-details__button profile-details__button--primary"
                    >
                      {isSaving ? (
                        <Loader2
                          size={15}
                          className="profile-details__spin"
                        />
                      ) : (
                        <Save size={15} />
                      )}

                      {isSaving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AccountConfirmDialog
        open={confirmType !== null}
        type={
          confirmType === "delete"
            ? "delete"
            : "logout"
        }
        loading={
          isProcessingAccountAction
        }
        onCancel={
          closeConfirmDialog
        }
        onConfirm={() => {
          if (
            confirmType === "delete"
          ) {
            void handleDeleteConfirm();
            return;
          }

          if (
            confirmType === "logout"
          ) {
            void handleLogoutConfirm();
          }
        }}
      />
    </>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="profile-details__section-header">
      <div>
        <p className="profile-details__section-eyebrow">
          {eyebrow}
        </p>

        <h2 className="profile-details__section-title">
          {title}
        </h2>

        {description ? (
          <p className="profile-details__section-description">
            {description}
          </p>
        ) : null}
      </div>

      {icon ? (
        <span className="profile-details__section-icon">
          {icon}
        </span>
      ) : null}
    </div>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  value,
  editing = false,
  input,
  suffix,
  help,
  status = false,
  icon,
}: {
  label: string;
  value: string;
  editing?: boolean;
  input?: React.ReactNode;
  suffix?: string;
  help?: string;
  status?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="profile-details__field">
      <label>
        {label}
      </label>

      {editing && input ? (
        <div className="profile-details__field-control">
          {input}
        </div>
      ) : (
        <div className="profile-details__field-value">
          {status ? (
            <span className="profile-details__status">
              <span />
              {value}
            </span>
          ) : (
            <>
              <span className="profile-details__field-text">
                {value}
              </span>

              {suffix ? (
                <span className="profile-details__field-suffix">
                  {suffix}
                </span>
              ) : null}

              {icon}
            </>
          )}
        </div>
      )}

      {help ? (
        <p className="profile-details__field-help">
          {help}
        </p>
      ) : null}
    </div>
  );
}

/* =========================================================
   PREFERENCE GROUP
========================================================= */

function PreferenceGroup({
  label,
  items,
  selected,
  disabled,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string[];
  disabled: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="profile-details__preference-group">
      <p className="profile-details__preference-label">
        {label}
      </p>

      <div className="profile-details__preference-options">
        {items.map((item) => {
          const isSelected =
            selected.includes(item);

          return (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() =>
                onToggle(item)
              }
              className={`profile-details__preference-option ${
                isSelected
                  ? "profile-details__preference-option--selected"
                  : ""
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function PreferenceToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`profile-details__toggle-card ${
        checked
          ? "profile-details__toggle-card--active"
          : ""
      }`}
    >
      <span className="profile-details__toggle-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <span
        className={`profile-details__switch ${
          checked
            ? "profile-details__switch--active"
            : ""
        }`}
        aria-hidden="true"
      >
        <span />
      </span>
    </button>
  );
}

/* =========================================================
   SHOPPING BAG ICON
========================================================= */

function ShoppingBagIcon() {
  return (
    <span className="profile-details__quick-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 8H18L19 21H5L6 8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        <path
          d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}