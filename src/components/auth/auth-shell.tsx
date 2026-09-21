"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
            EDITORIAL BRAND PANEL
        ===================================================== */}

        <section className="auth-shell__brand-panel" aria-label="Aayesha Fashion">
          <div className="auth-shell__brand-frame" />

          <div className="auth-shell__brand-content">
            {/* Top */}
            <div className="auth-shell__brand-top">
              <div className="auth-shell__brand-logo">
                <BrandLogo />
              </div>
            </div>

            {/* Center */}
            <div className="auth-shell__brand-copy">
              <div className="auth-shell__eyebrow">
                <span className="auth-shell__eyebrow-line" />
                <span className="auth-shell__eyebrow-text">
                  Aayesha Fashion
                </span>
              </div>

              <h2 className="auth-shell__brand-title">
                Elegance,
                <br />
                made personal.
              </h2>

              <div className="auth-shell__brand-rule" />

              <p className="auth-shell__brand-description">
                Discover timeless Indian fashion crafted for confidence,
                celebration, and everyday beauty.
              </p>
            </div>

            {/* Bottom */}
            <div className="auth-shell__brand-footer">
              <span className="auth-shell__copyright">
                © {new Date().getFullYear()} Aayesha Fashion
              </span>

              <span className="auth-shell__footer-line" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* =====================================================
            AUTH CONTENT PANEL
        ===================================================== */}

        <section className="auth-shell__content-panel">
          {/* Header */}
          <header className="auth-shell__header">
            <Link
              href={backHref}
              className="auth-shell__back-link"
              aria-label={backLabel}
            >
              <ArrowLeft
                className="auth-shell__back-icon"
                aria-hidden="true"
              />

              <span>{backLabel}</span>
            </Link>

            <div className="auth-shell__mobile-logo">
              <BrandLogo />
            </div>
          </header>

          {/* Content */}
          <div className="auth-shell__content">
            <div className="auth-shell__content-inner">
              {/* Heading */}
              <div className="auth-shell__heading">
                <div className="auth-shell__content-eyebrow">
                  <span className="auth-shell__content-eyebrow-line" />
                  <span>Aayesha Fashion</span>
                </div>

                <h1 className="auth-shell__title">{title}</h1>

                {subtitle ? (
                  <p className="auth-shell__subtitle">{subtitle}</p>
                ) : null}
              </div>

              {/* Form */}
              <div className="auth-shell__form">{children}</div>

              {/* Footer */}
              {footer ? (
                <div className="auth-shell__footer">{footer}</div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export type { AuthShellProps };