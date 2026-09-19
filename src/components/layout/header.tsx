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
      className={`site-header ${
        isScrolled ? "site-header--scrolled" : ""
      }`}
    >
      {/* Champagne accent */}
      <span
        aria-hidden="true"
        className="site-header__accent"
      />

      <div
        className={`site-header__inner ${
          isScrolled ? "site-header__inner--scrolled" : ""
        }`}
      >
        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <div className="site-header__mobile-menu">
          <MobileMenu
            isOpen={mobileMenuOpen}
            onOpen={() => setMobileMenuOpen(true)}
            onClose={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav
          aria-label="Main navigation"
          className="site-header__navigation"
        >
          <DesktopNavigation />
        </nav>

        {/* =====================================================
            CENTER BRAND
        ====================================================== */}

        <div className="site-header__brand">
          <div className="site-header__brand-inner">
            <BrandLogo />
          </div>
        </div>

        {/* =====================================================
            HEADER ACTIONS
        ====================================================== */}

        <div className="site-header__actions">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}