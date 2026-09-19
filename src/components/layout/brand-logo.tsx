"use client";

import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Aayesha Fashion — Home"
      className="
        group
        relative
        z-[70]
        inline-flex
        items-center
        justify-center
        leading-none
        text-[var(--color-text)]
        transition-transform
        duration-500
        ease-[var(--ease-luxury)]
        hover:-translate-y-px
      "
    >
      {/* =====================================================
          LOGO MARK
      ====================================================== */}

      <span
        className="
          relative
          flex
          h-[42px]
          w-[42px]
          shrink-0
          items-center
          justify-center
          sm:h-[46px]
          sm:w-[46px]
          md:h-[48px]
          md:w-[48px]
        "
      >
        {/* Subtle champagne halo */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[-5px]
            rounded-full
            bg-[var(--color-champagne)]
            opacity-0
            blur-xl
            transition-all
            duration-500
            ease-[var(--ease-luxury)]
            group-hover:scale-110
            group-hover:opacity-15
          "
        />

        <Image
          src="/images/logo.png"
          alt="Aayesha Fashion"
          width={56}
          height={56}
          priority
          className="
            relative
            z-10
            pointer-events-none
            h-[42px]
            w-[42px]
            object-contain
            transition-transform
            duration-500
            ease-[var(--ease-luxury)]
            group-hover:scale-[1.035]
            sm:h-[46px]
            sm:w-[46px]
            md:h-[48px]
            md:w-[48px]
          "
        />
      </span>

      {/* =====================================================
          BRAND WORDMARK
      ====================================================== */}

      <span
        className="
          pointer-events-none
          ml-3
          flex
          flex-col
          items-start
          justify-center
          sm:ml-3.5
        "
      >
        {/* AAYESHA */}

        <span
          className="
            font-display
            text-[29px]
            font-medium
            leading-[0.88]
            tracking-[-0.035em]
            text-[var(--color-text)]
            transition-all
            duration-500
            ease-[var(--ease-luxury)]
            group-hover:tracking-[-0.02em]
            sm:text-[31px]
            md:text-[33px]
          "
        >
          Aayesha
        </span>

        {/* FASHION */}

        <span
          className="
            relative
            mt-[6px]
            pl-[0.18em]
            font-body
            text-[8px]
            font-semibold
            uppercase
            leading-none
            tracking-[0.36em]
            text-[var(--color-text-secondary)]
            transition-all
            duration-500
            ease-[var(--ease-luxury)]
            group-hover:text-[var(--color-accent-dark)]
            group-hover:tracking-[0.42em]
            sm:text-[8.5px]
            md:text-[9px]
          "
        >
          Fashion

          {/* Editorial accent line */}
          <span
            aria-hidden="true"
            className="
              absolute
              -bottom-[6px]
              left-[0.18em]
              h-px
              w-0
              bg-[var(--color-champagne)]
              transition-all
              duration-500
              ease-[var(--ease-luxury)]
              group-hover:w-[calc(100%-0.18em)]
            "
          />
        </span>
      </span>
    </Link>
  );
}