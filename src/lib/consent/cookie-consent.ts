export const COOKIE_CONSENT_STORAGE_KEY =
  "aayesha-cookie-consent";

export const COOKIE_CONSENT_VERSION =
  "1.0";

export type CookieConsentCategory =
  | "essential"
  | "analytics"
  | "marketing";

export interface CookieConsentPreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  version: string;
  preferences: CookieConsentPreferences;
  decidedAt: string;
}

const DEFAULT_PREFERENCES: CookieConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

/* =========================================================
   DEFAULT STATE
========================================================= */

export function getDefaultCookieConsent():
  CookieConsentState {
  return {
    version:
      COOKIE_CONSENT_VERSION,

    preferences: {
      ...DEFAULT_PREFERENCES,
    },

    decidedAt: "",
  };
}

/* =========================================================
   READ CONSENT
========================================================= */

export function getCookieConsent():
  | CookieConsentState
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const stored =
      window.localStorage.getItem(
        COOKIE_CONSENT_STORAGE_KEY,
      );

    if (!stored) {
      return null;
    }

    const parsed: unknown =
      JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !==
        "object"
    ) {
      return null;
    }

    const value =
      parsed as Partial<CookieConsentState>;

    if (
      typeof value.version !==
        "string" ||
      typeof value.decidedAt !==
        "string" ||
      !value.preferences ||
      typeof value.preferences !==
        "object"
    ) {
      return null;
    }

    return {
      version: value.version,

      preferences: {
        essential: true,

        analytics:
          Boolean(
            value.preferences
              .analytics,
          ),

        marketing:
          Boolean(
            value.preferences
              .marketing,
          ),
      },

      decidedAt:
        value.decidedAt,
    };
  } catch {
    return null;
  }
}

/* =========================================================
   SAVE CONSENT
========================================================= */

export function saveCookieConsent(
  preferences: Omit<
    CookieConsentPreferences,
    "essential"
  >,
): CookieConsentState {
  const state: CookieConsentState =
    {
      version:
        COOKIE_CONSENT_VERSION,

      preferences: {
        essential: true,

        analytics:
          Boolean(
            preferences.analytics,
          ),

        marketing:
          Boolean(
            preferences.marketing,
          ),
      },

      decidedAt:
        new Date().toISOString(),
    };

  if (
    typeof window !==
    "undefined"
  ) {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_STORAGE_KEY,
        JSON.stringify(state),
      );
    } catch {
      // Storage can be unavailable
      // in private/restricted browsing.
    }
  }

  return state;
}

/* =========================================================
   ACCEPT ALL
========================================================= */

export function acceptAllCookies():
  CookieConsentState {
  return saveCookieConsent({
    analytics: true,
    marketing: true,
  });
}

/* =========================================================
   REJECT OPTIONAL
========================================================= */

export function rejectOptionalCookies():
  CookieConsentState {
  return saveCookieConsent({
    analytics: false,
    marketing: false,
  });
}

/* =========================================================
   CHECK WHETHER A DECISION EXISTS
========================================================= */

export function hasCookieConsent():
  boolean {
  const consent =
    getCookieConsent();

  if (!consent) {
    return false;
  }

  return (
    consent.version ===
    COOKIE_CONSENT_VERSION
  );
}

/* =========================================================
   CHECK CATEGORY
========================================================= */

export function hasCookieCategoryConsent(
  category: CookieConsentCategory,
): boolean {
  const consent =
    getCookieConsent();

  if (!consent) {
    return category === "essential";
  }

  if (
    consent.version !==
    COOKIE_CONSENT_VERSION
  ) {
    return category === "essential";
  }

  return Boolean(
    consent.preferences[
      category
    ],
  );
}

/* =========================================================
   CLEAR CONSENT
========================================================= */

export function clearCookieConsent():
  void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.removeItem(
      COOKIE_CONSENT_STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}