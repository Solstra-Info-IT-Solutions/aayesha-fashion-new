"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Aayesha Fashion — Home"
      className="brand-logo group"
    >
      {/* Logo mark */}
      <span className="brand-logo__mark">
        <span
          aria-hidden="true"
          className="brand-logo__halo"
        />

        <Image
          src="/images/logo.png"
          alt="Aayesha Fashion"
          width={56}
          height={56}
          priority
          className="brand-logo__image"
        />
      </span>

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