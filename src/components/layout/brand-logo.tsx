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
        transition-all
        duration-700
        ease-[var(--ease-luxury)]
        hover:-translate-y-px
      "
    >
      {/* =====================================================
          LOGO MARK
      ===================================================== */}

      <span
        className="
          relative
          flex
          h-[36px]
          w-[36px]
          shrink-0
          items-center
          justify-center
          sm:h-[40px]
          sm:w-[40px]
          md:h-[42px]
          md:w-[42px]
        "
      >
        {/* Soft luxury halo */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-full
            bg-[var(--color-accent-soft)]
            opacity-0
            blur-xl
            transition-all
            duration-700
            ease-[var(--ease-luxury)]
            group-hover:scale-125
            group-hover:opacity-25
          "
        />

        <Image
          src="/images/logo.png"
          alt="Aayesha Fashion"
          width={46}
          height={46}
          priority
          className="
            relative
            z-10
            pointer-events-none
            h-[36px]
            w-[36px]
            object-contain
            transition-transform
            duration-700
            ease-[var(--ease-luxury)]
            group-hover:scale-[1.04]
            group-hover:[transform:translateZ(8px)_rotate(-1deg)]
            sm:h-[40px]
            sm:w-[40px]
            md:h-[42px]
            md:w-[42px]
          "
        />
      </span>

      {/* =====================================================
          BRAND WORDMARK
      ===================================================== */}

      <span
        className="
          pointer-events-none
          ml-2.5
          flex
          flex-col
          items-start
          justify-center
          sm:ml-3
        "
      >
        {/* AAYESHA */}

        <span
          className="
            font-display
            text-[25px]
            font-medium
            leading-[0.88]
            tracking-[-0.035em]
            text-[var(--color-text)]
            transition-all
            duration-700
            ease-[var(--ease-luxury)]
            group-hover:tracking-[-0.02em]
            sm:text-[28px]
            md:text-[30px]
          "
        >
          Aayesha
        </span>

        {/* FASHION */}

        <span
          className="
            relative
            mt-[5px]
            pl-[0.2em]
            font-body
            text-[6px]
            font-medium
            uppercase
            leading-none
            tracking-[0.42em]
            text-[var(--color-text-muted)]
            transition-all
            duration-700
            ease-[var(--ease-luxury)]
            group-hover:text-[var(--color-accent-dark)]
            group-hover:tracking-[0.48em]
            sm:text-[6.5px]
          "
        >
          Fashion

          {/* Editorial accent line */}
          <span
            aria-hidden="true"
            className="
              absolute
              -bottom-2
              left-[0.2em]
              h-px
              w-0
              bg-[var(--color-accent)]
              transition-all
              duration-700
              ease-[var(--ease-luxury)]
              group-hover:w-[calc(100%-0.2em)]
            "
          />
        </span>
      </span>
    </Link>
  );
}