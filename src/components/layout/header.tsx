"use client";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-[var(--z-header)]
        w-full
        border-b
        transition-all
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          isScrolled
            ? `
              border-[var(--color-border-light)]
              bg-[rgba(255,255,255,0.94)]
              shadow-[0_8px_30px_rgba(23,21,20,0.06)]
              backdrop-blur-xl
            `
            : `
              border-[rgba(23,21,20,0.06)]
              bg-[rgba(255,255,255,0.88)]
              backdrop-blur-lg
            `
        }
      `}
    >
      {/* Refined champagne accent */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[var(--color-champagne)]
          to-transparent
          opacity-50
        "
      />

      <div
        className={`
          relative
          mx-auto
          flex
          w-full
          max-w-[1600px]
          items-center
          px-5
          transition-[height]
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
          ${
            isScrolled
              ? "h-[72px] sm:h-[74px] lg:h-[76px]"
              : "h-[82px] sm:h-[86px] lg:h-[90px]"
          }
        `}
      >
        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <div className="relative z-[120] lg:hidden">
          <MobileMenu
            isOpen={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div
          className="
            hidden
            lg:flex
            lg:items-center
          "
        >
          <DesktopNavigation />
        </div>

        {/* =====================================================
            CENTER BRAND
        ====================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[10]
            -translate-x-1/2
            -translate-y-1/2
          "
        >
          <div
            className="
              transform-gpu
              transition-transform
              duration-500
              ease-[cubic-bezier(.22,1,.36,1)]
            "
          >
            <BrandLogo />
          </div>
        </div>

        {/* =====================================================
            HEADER ACTIONS
        ====================================================== */}

        <div
          className="
            relative
            z-[20]
            ml-auto
            flex
            items-center
          "
        >
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}