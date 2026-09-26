import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";

import "./Footer.css";

/* ============================================================
   FOOTER NAVIGATION
============================================================ */

const footerNavigation = {
  shop: [
    {
      label: "New Arrivals",
      href: "/collections/new-arrivals",
    },
    {
      label: "Best Sellers",
      href: "/collections/best-sellers",
    },
    {
      label: "Shop All",
      href: "/shop",
    },
  ],

  information: [
    {
      label: "Our Story",
      href: "/our-story",
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
    {
      label: "Shipping & Delivery",
      href: "/shipping",
    },
    {
      label: "Returns & Exchange",
      href: "/returns",
    },
  ],
} as const;


/* ============================================================
   LEGAL / POLICIES
============================================================ */

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    label: "Refund Policy",
    href: "/refund-policy",
  },
] as const;


/* ============================================================
   SOCIAL LINKS
============================================================ */

const socialLinks = [
  siteConfig.social.instagram
    ? {
        label: "Instagram",
        href: siteConfig.social.instagram,
        icon: Instagram,
      }
    : null,

  siteConfig.social.facebook
    ? {
        label: "Facebook",
        href: siteConfig.social.facebook,
        icon: Facebook,
      }
    : null,

  siteConfig.social.whatsapp
    ? {
        label: "WhatsApp",
        href: siteConfig.social.whatsapp,
        icon: MessageCircle,
      }
    : null,
].filter(
  (
    social,
  ): social is NonNullable<typeof social> =>
    social !== null,
);


/* ============================================================
   FOOTER
============================================================ */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__inner">

          {/* =================================================
              BRAND INTRO
          ================================================= */}

          <section className="site-footer__intro">
            <div className="site-footer__intro-heading">

              <p className="site-footer__eyebrow">
                Aayesha Fashion
              </p>

              <h2 className="site-footer__intro-title">
                Designed for
                <br />
                <span>every occasion.</span>
              </h2>

            </div>

            <p className="site-footer__intro-description">
              {siteConfig.description}
            </p>
          </section>


          {/* =================================================
              MAIN FOOTER
          ================================================= */}

          <section className="site-footer__main">

            {/* ===============================================
                BRAND
            =============================================== */}

            <div className="site-footer__brand-column">

              <Link
                href="/"
                aria-label={`${siteConfig.name} home`}
                className="site-footer__brand"
              >

                <span className="site-footer__brand-image-wrap">
                  <img
                    src="/images/logo.png"
                    alt="Aayesha Fashion"
                    className="site-footer__brand-image"
                  />
                </span>

                <span className="site-footer__brand-name">
                  {siteConfig.name.split(" ")[0]}
                </span>

                <span className="site-footer__brand-tagline">
                  Fashion
                </span>

              </Link>


              {/* =========================================
                  SOCIAL
              ========================================= */}

              {socialLinks.length > 0 && (
                <div className="site-footer__social">

                  <p className="site-footer__micro-label">
                    Follow Aayesha
                  </p>

                  <div className="site-footer__social-list">

                    {socialLinks.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="site-footer__social-link"
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </a>
                      );
                    })}

                  </div>

                </div>
              )}

            </div>


            {/* ===============================================
                THREE NAVIGATION GRIDS

                1. Shop
                2. Information
                3. Policies
            =============================================== */}

            <div className="site-footer__columns">

              {/* =========================================
                  SHOP
              ========================================= */}

              <FooterColumn
                title="Shop"
                links={footerNavigation.shop}
              />


              {/* =========================================
                  INFORMATION
              ========================================= */}

              <FooterColumn
                title="Information"
                links={footerNavigation.information}
              />


              {/* =========================================
                  POLICIES
              ========================================= */}

              <FooterColumn
                title="Policies"
                links={legalLinks}
              />

            </div>

          </section>


          {/* =================================================
              CUSTOMER CARE
          ================================================= */}

          <section className="site-footer__customer-care">

            {siteConfig.contact.email && (
              <div className="site-footer__contact">

                <p className="site-footer__micro-label">
                  Customer Care
                </p>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="site-footer__contact-link"
                >

                  <span>
                    {siteConfig.contact.email}
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                  />

                </a>

              </div>
            )}


            {/* =============================================
                WHATSAPP / PHONE
            ============================================= */}

            <div className="site-footer__contact">

              <p className="site-footer__micro-label">
                WhatsApp
              </p>

              {siteConfig.social.whatsapp ? (

                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__contact-link"
                >

                  <span>
                    Chat with us
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                  />

                </a>

              ) : siteConfig.contact.phone ? (

                <a
                  href={`tel:+${siteConfig.contact.phone}`}
                  className="site-footer__contact-link"
                >

                  <span>
                    +{siteConfig.contact.phone}
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                  />

                </a>

              ) : null}

            </div>

          </section>


          {/* =================================================
              NEWSLETTER
          ================================================= */}

          <section className="site-footer__newsletter">

            <div>

              <p className="site-footer__eyebrow">
                Stay in the know
              </p>

              <h3 className="site-footer__newsletter-title">
                Discover the next
                <br />
                <span>Aayesha edit.</span>
              </h3>

            </div>


            <Link
              href="#newsletter"
              className="site-footer__newsletter-link"
            >

              <span>
                Join the newsletter
              </span>

              <span className="site-footer__newsletter-icon">

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                />

              </span>

            </Link>

          </section>


          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <section className="site-footer__legal">

            <p className="site-footer__copyright">
              © {currentYear} {siteConfig.name}.
              All rights reserved.
            </p>

          </section>

        </div>
      </Container>
    </footer>
  );
}


/* ============================================================
   FOOTER COLUMN
============================================================ */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div className="site-footer__column">

      <div className="site-footer__column-heading">

        <p className="site-footer__column-title">
          {title}
        </p>

      </div>


      <nav
        className="site-footer__column-links"
        aria-label={`${title} navigation`}
      >

        {links.map((link) => (

          <Link
            key={link.href}
            href={link.href}
            className="site-footer__column-link"
          >

            <span>
              {link.label}
            </span>

            <ArrowUpRight
              size={13}
              strokeWidth={1.4}
              className="site-footer__column-arrow"
              aria-hidden="true"
            />

          </Link>

        ))}

      </nav>

    </div>
  );
}