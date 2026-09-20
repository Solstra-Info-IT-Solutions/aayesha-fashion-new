"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import "./Header.css";

interface HeaderProps {
  transparent?: boolean;
}

const navigation = [
  {
    label: "New In",
    href: "/collections/new-arrivals",
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Garara",
    href: "/collections/garara",
  },
  {
    label: "Suits",
    href: "/collections/suits",
  },
  {
    label: "Festive Edit",
    href: "/collections/festive",
  },
];

export default function Header({
  transparent = false,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={[
          "aayesha-header",
          transparent && !isScrolled
            ? "aayesha-header--transparent"
            : "",
          isScrolled
            ? "aayesha-header--scrolled"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="aayesha-header__inner">

          {/* Mobile Menu */}
          <button
            type="button"
            className="aayesha-header__mobile-menu"
            aria-label={
              isMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? (
              <X size={18} strokeWidth={1.5} />
            ) : (
              <Menu size={19} strokeWidth={1.5} />
            )}
          </button>


          {/* Logo */}
          <Link
            href="/"
            className="aayesha-header__logo"
            aria-label="Aayesha home"
          >
            <span className="aayesha-header__logo-main">
              AAYESHA
            </span>

            <span className="aayesha-header__logo-sub">
              WOMENSWEAR
            </span>
          </Link>


          {/* Desktop Navigation */}
          <nav
            className="aayesha-header__nav"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="aayesha-header__nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>


          {/* Actions */}
          <div className="aayesha-header__actions">

            <button
              type="button"
              className="aayesha-header__action"
              aria-label="Search"
            >
              <Search
                size={17}
                strokeWidth={1.45}
              />
            </button>

            <Link
              href="/wishlist"
              className="aayesha-header__action aayesha-header__wishlist"
              aria-label="Wishlist"
            >
              <Heart
                size={17}
                strokeWidth={1.45}
              />
            </Link>

            <Link
              href="/cart"
              className="aayesha-header__action"
              aria-label="Shopping bag"
            >
              <ShoppingBag
                size={17}
                strokeWidth={1.45}
              />

              <span className="aayesha-header__cart-count">
                0
              </span>
            </Link>

          </div>
        </div>
      </header>


      {/* Mobile Navigation */}
      <div
        className={[
          "aayesha-mobile-menu",
          isMenuOpen
            ? "aayesha-mobile-menu--open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <div className="aayesha-mobile-menu__inner">

          <div className="aayesha-mobile-menu__top">
            <span>EXPLORE</span>

            <span>
              AAYESHA
            </span>
          </div>


          <nav
            className="aayesha-mobile-menu__nav"
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="aayesha-mobile-menu__link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="aayesha-mobile-menu__number">
                  0{index + 1}
                </span>

                <span>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>


          <div className="aayesha-mobile-menu__bottom">

            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About Aayesha
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
            >
              My Account
            </Link>

          </div>

        </div>
      </div>
    </>
  );
}