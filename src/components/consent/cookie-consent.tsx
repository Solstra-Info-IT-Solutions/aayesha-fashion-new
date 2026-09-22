"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  acceptAllCookies,
  getCookieConsent,
  rejectOptionalCookies,
  type CookieConsentState,
} from "@/lib/consent/cookie-consent";

import { CookiePreferences } from "./cookie-preferences";

import "./CookieConsent.css";

export function CookieConsent() {
  const [
    visible,
    setVisible,
  ] = useState(false);

  const [
    preferencesOpen,
    setPreferencesOpen,
  ] = useState(false);

  const [
    consent,
    setConsent,
  ] =
    useState<CookieConsentState | null>(
      null,
    );

  /* =========================================================
     INITIALISE
  ========================================================= */

  useEffect(() => {
    const existingConsent =
      getCookieConsent();

    if (existingConsent) {
      setConsent(existingConsent);
      setVisible(false);
      return;
    }

    setVisible(true);
  }, []);

  /* =========================================================
     ACCEPT ALL
  ========================================================= */

  const handleAcceptAll =
    useCallback(() => {
      const nextConsent =
        acceptAllCookies();

      setConsent(nextConsent);

      setVisible(false);
      setPreferencesOpen(false);
    }, []);

  /* =========================================================
     REJECT OPTIONAL
  ========================================================= */

  const handleRejectOptional =
    useCallback(() => {
      const nextConsent =
        rejectOptionalCookies();

      setConsent(nextConsent);

      setVisible(false);
      setPreferencesOpen(false);
    }, []);

  /* =========================================================
     OPEN PREFERENCES
  ========================================================= */

  const handleManagePreferences =
    useCallback(() => {
      setPreferencesOpen(true);
    }, []);

  /* =========================================================
     CLOSE PREFERENCES
  ========================================================= */

  const handleClosePreferences =
    useCallback(() => {
      setPreferencesOpen(false);
    }, []);

  /* =========================================================
     PREFERENCES SAVED
  ========================================================= */

  const handlePreferencesSaved =
    useCallback(() => {
      const updatedConsent =
        getCookieConsent();

      setConsent(
        updatedConsent,
      );

      setVisible(false);
      setPreferencesOpen(false);
    }, []);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (
      !visible &&
      !preferencesOpen
    ) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    visible,
    preferencesOpen,
  ]);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    if (
      !visible &&
      !preferencesOpen
    ) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key !== "Escape"
      ) {
        return;
      }

      if (preferencesOpen) {
        setPreferencesOpen(false);
        return;
      }

      handleRejectOptional();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    visible,
    preferencesOpen,
    handleRejectOptional,
  ]);

  /* =========================================================
     PREFERENCES MODAL
  ========================================================= */

  if (preferencesOpen) {
    return (
      <CookiePreferences
        open={preferencesOpen}
        onClose={
          handleClosePreferences
        }
        onSaved={
          handlePreferencesSaved
        }
      />
    );
  }

  /* =========================================================
     NOTHING TO RENDER
  ========================================================= */

  if (!visible) {
    return null;
  }

  return (
    <aside
      className="cookie-consent"
      aria-label="Cookie preferences"
      aria-live="polite"
    >
      <div className="cookie-consent__inner">
        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="cookie-consent__content">
          <div className="cookie-consent__eyebrow">
            <span className="cookie-consent__eyebrow-line" />

            <span>
              Your Privacy, Considered
            </span>
          </div>

          <h2 className="cookie-consent__title">
            A more considered
            browsing experience.
          </h2>

          <p className="cookie-consent__description">
            We use essential cookies to
            keep Aayesha Fashion working
            smoothly. With your permission,
            optional cookies may help us
            understand how the website is
            used and improve your shopping
            experience.
          </p>

          <p className="cookie-consent__note">
            Essential cookies remain
            enabled because they are
            required for core website
            functionality.
          </p>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="cookie-consent__actions">
          <button
            type="button"
            className="cookie-consent__button cookie-consent__button--text"
            onClick={
              handleManagePreferences
            }
          >
            Manage Preferences
          </button>

          <button
            type="button"
            className="cookie-consent__button cookie-consent__button--secondary"
            onClick={
              handleRejectOptional
            }
          >
            Reject Optional
          </button>

          <button
            type="button"
            className="cookie-consent__button cookie-consent__button--primary"
            onClick={
              handleAcceptAll
            }
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}