"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HeaderActions } from "./header-actions";
import { MobileMenu } from "./mobile-menu";

import "./Header.css";

interface HeaderProps {
  transparent?: boolean;
}

/* =========================================================
   DESKTOP NAVIGATION
========================================================= */

const navigation = [
  {
    label: "New In",
    href: "/collections/new-arrivals",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Header({
  transparent = false,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  /* =======================================================
     SCROLL STATE
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU ON DESKTOP
  ======================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  /* =======================================================
     HEADER CLASS
  ======================================================= */

  const headerClassName = [
    "aayesha-header",

    transparent && !isScrolled
      ? "aayesha-header--transparent"
      : "",

    isScrolled
      ? "aayesha-header--scrolled"
      : "",

    isMenuOpen
      ? "aayesha-header--menu-open"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClassName}>
        <div className="aayesha-header__inner">

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <div className="aayesha-header__mobile">
            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() =>
                setIsMenuOpen(false)
              }
              onOpen={() =>
                setIsMenuOpen(true)
              }
            />
          </div>

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="aayesha-header__logo"
            aria-label="Aayesha Fashion home"
          >
            <span
              className="aayesha-header__logo-mark"
              aria-hidden="true"
            >
              <Image
                src="/images/logo.png"
                alt=""
                width={64}
                height={64}
                priority
                className="aayesha-header__logo-image"
              />
            </span>

            <span className="aayesha-header__logo-text">
              <span className="aayesha-header__logo-main">
                AAYESHA
              </span>

              <span className="aayesha-header__logo-sub">
                WOMENSWEAR
              </span>
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="aayesha-header__nav"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="aayesha-header__nav-link"
              >
                <span>
                  {item.label}
                </span>

                <span
                  aria-hidden="true"
                  className="aayesha-header__nav-line"
                />
              </Link>
            ))}
          </nav>

          {/* =================================================
              HEADER ACTIONS
          ================================================= */}

          <div className="aayesha-header__actions">
            <HeaderActions />
          </div>
        </div>
      </header>
    </>
  );
}