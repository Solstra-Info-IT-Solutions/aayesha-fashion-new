"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getCookieConsent,
  getDefaultCookieConsent,
  saveCookieConsent,
} from "@/lib/consent/cookie-consent";

import "./CookiePreferences.css";

interface CookiePreferencesProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function CookiePreferences({
  open,
  onClose,
  onSaved,
}: CookiePreferencesProps) {
  const [
    analytics,
    setAnalytics,
  ] = useState(false);

  const [
    marketing,
    setMarketing,
  ] = useState(false);

  /* =========================================================
     LOAD EXISTING PREFERENCES
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const existing =
      getCookieConsent();

    if (existing) {
      setAnalytics(
        existing.preferences
          .analytics,
      );

      setMarketing(
        existing.preferences
          .marketing,
      );

      return;
    }

    const defaults =
      getDefaultCookieConsent();

    setAnalytics(
      defaults.preferences
        .analytics,
    );

    setMarketing(
      defaults.preferences
        .marketing,
    );
  }, [open]);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
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
  }, [open, onClose]);

  /* =========================================================
     BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (!open) {
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
  }, [open]);

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave =
    useCallback(() => {
      saveCookieConsent({
        analytics,
        marketing,
      });

      onSaved?.();

      onClose();
    }, [
      analytics,
      marketing,
      onClose,
      onSaved,
    ]);

  /* =========================================================
     ACCEPT ALL
  ========================================================= */

  const handleAcceptAll =
    useCallback(() => {
      saveCookieConsent({
        analytics: true,
        marketing: true,
      });

      setAnalytics(true);
      setMarketing(true);

      onSaved?.();

      onClose();
    }, [onClose, onSaved]);

  /* =========================================================
     BACKDROP
  ========================================================= */

  const handleBackdropClick =
    (
      event: React.MouseEvent<HTMLDivElement>,
    ) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        onClose();
      }
    };

  if (!open) {
    return null;
  }

  return (
    <div
      className="cookie-preferences"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
      onMouseDown={
        handleBackdropClick
      }
    >
      <div className="cookie-preferences__panel">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="cookie-preferences__header">
          <div>
            <div className="cookie-preferences__eyebrow">
              <span className="cookie-preferences__eyebrow-line" />

              <span>
                Privacy Preferences
              </span>
            </div>

            <h2
              id="cookie-preferences-title"
              className="cookie-preferences__title"
            >
              Your choices,
              your experience.
            </h2>

            <p className="cookie-preferences__intro">
              Choose which optional cookie
              categories you would like
              Aayesha Fashion to use. Your
              essential cookies remain
              enabled because they support
              core website functionality.
            </p>
          </div>

          <button
            type="button"
            className="cookie-preferences__close"
            onClick={onClose}
            aria-label="Close cookie preferences"
          >
            <span />
            <span />
          </button>
        </header>

        {/* ===================================================
            PREFERENCES
        =================================================== */}

        <div className="cookie-preferences__body">
          {/* =================================================
              ESSENTIAL
          ================================================= */}

          <section className="cookie-preferences__option">
            <div className="cookie-preferences__option-content">
              <div className="cookie-preferences__option-heading">
                <span className="cookie-preferences__option-number">
                  01
                </span>

                <div>
                  <h3>
                    Essential Cookies
                  </h3>

                  <span className="cookie-preferences__always-active">
                    Always active
                  </span>
                </div>
              </div>

              <p>
                These cookies are required
                for essential website
                functions such as account
                sessions, shopping bag,
                checkout and security.
              </p>
            </div>

            <div
              className="cookie-preferences__toggle cookie-preferences__toggle--locked"
              aria-label="Essential cookies are always active"
              aria-disabled="true"
            >
              <span />
            </div>
          </section>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <section className="cookie-preferences__option">
            <div className="cookie-preferences__option-content">
              <div className="cookie-preferences__option-heading">
                <span className="cookie-preferences__option-number">
                  02
                </span>

                <div>
                  <h3>
                    Analytics Cookies
                  </h3>

                  <span>
                    Optional
                  </span>
                </div>
              </div>

              <p>
                These cookies can help us
                understand how visitors use
                the website, which pages are
                useful and where we can
                improve the shopping
                experience.
              </p>
            </div>

            <button
              type="button"
              className={`cookie-preferences__toggle ${
                analytics
                  ? "cookie-preferences__toggle--active"
                  : ""
              }`}
              role="switch"
              aria-checked={analytics}
              aria-label="Analytics cookies"
              onClick={() =>
                setAnalytics(
                  (current) =>
                    !current,
                )
              }
            >
              <span />
            </button>
          </section>

          {/* =================================================
              MARKETING
          ================================================= */}

          <section className="cookie-preferences__option">
            <div className="cookie-preferences__option-content">
              <div className="cookie-preferences__option-heading">
                <span className="cookie-preferences__option-number">
                  03
                </span>

                <div>
                  <h3>
                    Marketing Cookies
                  </h3>

                  <span>
                    Optional
                  </span>
                </div>
              </div>

              <p>
                These cookies may be used
                to support relevant campaigns,
                promotional experiences and
                measurement of marketing
                activity where applicable.
              </p>
            </div>

            <button
              type="button"
              className={`cookie-preferences__toggle ${
                marketing
                  ? "cookie-preferences__toggle--active"
                  : ""
              }`}
              role="switch"
              aria-checked={marketing}
              aria-label="Marketing cookies"
              onClick={() =>
                setMarketing(
                  (current) =>
                    !current,
                )
              }
            >
              <span />
            </button>
          </section>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="cookie-preferences__footer">
          <p className="cookie-preferences__footer-note">
            You can change these preferences
            later through the cookie settings
            available on the website.
          </p>

          <div className="cookie-preferences__actions">
            <button
              type="button"
              className="cookie-preferences__button cookie-preferences__button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cookie-preferences__button cookie-preferences__button--secondary"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>

            <button
              type="button"
              className="cookie-preferences__button cookie-preferences__button--primary"
              onClick={handleSave}
            >
              Save Preferences
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}