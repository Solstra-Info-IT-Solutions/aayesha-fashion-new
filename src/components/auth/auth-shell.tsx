"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import "./AuthShell.css";

/* =========================================================
   TYPES
========================================================= */

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  footer?: ReactNode;
};

/* =========================================================
   COMPONENT
========================================================= */

export function AuthShell({
  children,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to home",
  footer,
}: AuthShellProps) {
  return (
    <main className="auth-shell">
      <div className="auth-shell__layout">

        {/* =====================================================
            BRAND PANEL
        ===================================================== */}

        <section
          className="auth-shell__brand-panel"
          aria-label="Aayesha Fashion"
        >
          <div
            className="auth-shell__brand-decoration"
            aria-hidden="true"
          />

          <div
            className="auth-shell__brand-pattern"
            aria-hidden="true"
          />

          <div className="auth-shell__brand-content">

            {/* =================================================
                BRAND HEADER
            ================================================= */}

            <header className="auth-shell__brand-top">

              <div className="auth-shell__brand-logo">
                <BrandLogo />
              </div>

              <div
                className="auth-shell__brand-badge"
                aria-hidden="true"
              >
                <Sparkles
                  size={14}
                  strokeWidth={1.5}
                />

                <span>EST. 2026</span>
              </div>

            </header>


            {/* =================================================
                BRAND MESSAGE
            ================================================= */}

            <div className="auth-shell__brand-copy">

              <div className="auth-shell__eyebrow">

                <span
                  className="auth-shell__eyebrow-line"
                  aria-hidden="true"
                />

                <span className="auth-shell__eyebrow-text">
                  Aayesha Fashion
                </span>

              </div>


              <h2 className="auth-shell__brand-title">
                Elegance,
                <br />
                made personal.
              </h2>


              <p className="auth-shell__brand-description">
                Discover contemporary Indian fashion crafted
                for confidence, celebration, and everyday
                beauty.
              </p>


              <div className="auth-shell__brand-highlights">

                <div className="auth-shell__highlight">
                  <span className="auth-shell__highlight-dot" />
                  <span>Curated Collections</span>
                </div>

                <div className="auth-shell__highlight">
                  <span className="auth-shell__highlight-dot" />
                  <span>Designed for Every Moment</span>
                </div>

              </div>

            </div>


            {/* =================================================
                BRAND FOOTER
            ================================================= */}

            <div className="auth-shell__brand-footer">

              <span className="auth-shell__copyright">
                © {new Date().getFullYear()} Aayesha Fashion
              </span>

              <span
                className="auth-shell__footer-line"
                aria-hidden="true"
              />

              <span className="auth-shell__brand-region">
                Contemporary Indian Womenswear
              </span>

            </div>

          </div>
        </section>


        {/* =====================================================
            AUTH CONTENT PANEL
        ===================================================== */}

        <section className="auth-shell__content-panel">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="auth-shell__header">

            <Link
              href={backHref}
              className="auth-shell__back-link"
              aria-label={backLabel}
            >
              <span className="auth-shell__back-icon-wrapper">
                <ArrowLeft
                  className="auth-shell__back-icon"
                  aria-hidden="true"
                />
              </span>

              <span>{backLabel}</span>
            </Link>


            <div className="auth-shell__mobile-logo">
              <BrandLogo />
            </div>

          </header>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="auth-shell__content">

            <div className="auth-shell__content-inner">

              {/* =================================================
                  HEADING
              ================================================= */}

              <div className="auth-shell__heading">

                <div className="auth-shell__content-eyebrow">

                  <span
                    className="auth-shell__content-eyebrow-line"
                    aria-hidden="true"
                  />

                  <span>
                    Aayesha Fashion
                  </span>

                </div>


                <h1 className="auth-shell__title">
                  {title}
                </h1>


                {subtitle ? (
                  <p className="auth-shell__subtitle">
                    {subtitle}
                  </p>
                ) : null}

              </div>


              {/* =================================================
                  FORM
              ================================================= */}

              <div className="auth-shell__form">
                {children}
              </div>


              {/* =================================================
                  FOOTER
              ================================================= */}

              {footer ? (
                <div className="auth-shell__footer">
                  {footer}
                </div>
              ) : null}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

export type { AuthShellProps };