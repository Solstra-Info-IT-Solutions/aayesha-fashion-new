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
        transition-all
        duration-700
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          isScrolled
            ? `
              border-b
              border-[var(--color-border-light)]
              bg-[rgba(247,243,238,0.82)]
              shadow-[0_12px_40px_rgba(33,31,29,0.06)]
              backdrop-blur-xl
            `
            : `
              border-b
              border-transparent
              bg-[rgba(247,243,238,0.35)]
              backdrop-blur-md
            `
        }
      `}
    >
      {/* Subtle luxury highlight */}
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
          via-[var(--color-accent-soft)]
          to-transparent
          opacity-60
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
          transition-all
          duration-700
          ease-[cubic-bezier(.22,1,.36,1)]
          sm:px-8
          md:px-10
          lg:px-12
          xl:px-16
          ${
            isScrolled
              ? "h-[68px] sm:h-[72px] md:h-[76px]"
              : "h-[76px] sm:h-[80px] md:h-[84px]"
          }
        `}
      >
        {/* Mobile Menu */}
        <div className="relative z-[120] lg:hidden">
          <MobileMenu
            isOpen={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Desktop Navigation */}
        <div
          className="
            hidden
            lg:block
          "
        >
          <DesktopNavigation />
        </div>

        {/* Center Logo */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            z-[10]
            -translate-x-1/2
            [perspective:1000px]
          "
        >
          <div
            className="
              transform-gpu
              transition-all
              duration-700
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:[transform:translateZ(8px)]
            "
          >
            <BrandLogo />
          </div>
        </div>

        {/* Header Actions */}
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