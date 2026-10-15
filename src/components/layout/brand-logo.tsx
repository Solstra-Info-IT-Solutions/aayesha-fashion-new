"use client";

import Link from "next/link";

import "./BrandLogo.css";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Aayesha Fashion — Home"
      className="brand-logo group"
    >
      {/* Wordmark */}
      <span className="brand-logo__wordmark">
        <span className="brand-logo__name">
          Aayesha
        </span>

        <span className="brand-logo__tagline">
          Fashion

          <span
            aria-hidden="true"
            className="brand-logo__accent"
          />
        </span>
      </span>
    </Link>
  );
}