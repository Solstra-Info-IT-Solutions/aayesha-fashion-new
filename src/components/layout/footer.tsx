import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";

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

  collections: [
    {
      label: "Festive",
      href: "/collections/festive",
    },
    {
      label: "Ethnic",
      href: "/collections/ethnic",
    },
    {
      label: "Contemporary",
      href: "/collections/contemporary",
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
   LEGAL
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
    <footer
      className="
        relative
        overflow-hidden
        bg-[var(--color-charcoal)]
        text-white
      "
    >
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[420px]
          w-[420px]
          rounded-full
          bg-[var(--color-accent)]
          opacity-[0.07]
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-48
          left-[-120px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[var(--color-rose)]
          opacity-[0.045]
          blur-[140px]
        "
      />

      <Container>
        <div className="relative py-16 sm:py-20 lg:py-24 xl:py-28">
          {/* ====================================================
              TOP BRAND STATEMENT
          ==================================================== */}

          <div
            className="
              border-t
              border-white/10
              pt-7
              sm:pt-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-[760px]">
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.32em]
                    text-[var(--color-rose-light)]
                  "
                >
                  Aayesha Fashion
                </p>

                <h2
                  className="
                    mt-5
                    max-w-[760px]
                    font-display
                    text-[clamp(2.8rem,6vw,6.5rem)]
                    font-light
                    leading-[0.88]
                    tracking-[-0.045em]
                    text-white
                  "
                >
                  Designed for
                  <br />
                  <span className="italic text-white/80">
                    every occasion.
                  </span>
                </h2>
              </div>

              <div className="max-w-[320px] lg:pb-2">
                <p
                  className="
                    font-body
                    text-[12px]
                    leading-6
                    text-white/50
                    sm:text-[13px]
                    sm:leading-7
                  "
                >
                  {siteConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              BRAND + NAVIGATION
          ==================================================== */}

          <div
            className="
              mt-16
              grid
              gap-14
              border-y
              border-white/10
              py-12
              sm:mt-20
              sm:py-14
              lg:grid-cols-12
              lg:gap-16
              lg:py-16
            "
          >
            {/* ==================================================
                BRAND
            ================================================== */}

            <div className="lg:col-span-5">
              <Link
                href="/"
                aria-label={`${siteConfig.name} home`}
                className="
                  group
                  inline-flex
                  flex-col
                  items-start
                  leading-none
                "
              >
                {/* Logo */}
                <span
                  className="
                    relative
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-[var(--color-accent)]
                      opacity-0
                      blur-xl
                      transition-all
                      duration-700
                      group-hover:scale-125
                      group-hover:opacity-20
                    "
                  />

                  <img
                    src="/images/logo.png"
                    alt="Aayesha Fashion"
                    className="
                      relative
                      z-10
                      h-10
                      w-auto
                      object-contain
                      opacity-95
                      transition-all
                      duration-700
                      group-hover:scale-105
                      group-hover:opacity-100
                    "
                  />
                </span>

                {/* Brand */}
                <span
                  className="
                    mt-5
                    font-display
                    text-[3.2rem]
                    font-medium
                    leading-[0.85]
                    tracking-[-0.045em]
                    text-white
                    transition-all
                    duration-700
                    group-hover:tracking-[-0.025em]
                    sm:text-[3.7rem]
                  "
                >
                  {siteConfig.name.split(" ")[0]}
                </span>

                {/* Sub brand */}
                <span
                  className="
                    mt-3
                    pl-[0.32em]
                    font-body
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.44em]
                    text-white/40
                    transition-colors
                    duration-500
                    group-hover:text-[var(--color-rose-light)]
                  "
                >
                  Fashion
                </span>
              </Link>

              {/* Social */}
              {socialLinks.length > 0 && (
                <div className="mt-9">
                  <p
                    className="
                      font-body
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.28em]
                      text-white/35
                    "
                  >
                    Follow Aayesha
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    {socialLinks.map(
                      (social) => {
                        const Icon =
                          social.icon;

                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                              social.label
                            }
                            className="
                              group
                              relative
                              flex
                              h-11
                              w-11
                              items-center
                              justify-center
                              overflow-hidden
                              border
                              border-white/15
                              text-white/55
                              transition-all
                              duration-500
                              hover:-translate-y-1
                              hover:border-[var(--color-rose)]
                              hover:text-[var(--color-charcoal)]
                            "
                          >
                            <span
                              aria-hidden="true"
                              className="
                                absolute
                                inset-0
                                translate-y-full
                                bg-[var(--color-rose)]
                                transition-transform
                                duration-500
                                ease-[var(--ease-luxury)]
                                group-hover:translate-y-0
                              "
                            />

                            <Icon
                              size={16}
                              strokeWidth={1.25}
                              className="
                                relative
                                z-10
                                transition-transform
                                duration-500
                                group-hover:scale-110
                              "
                            />
                          </a>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-12
                sm:grid-cols-3
                lg:col-span-7
                lg:gap-12
              "
            >
              <FooterColumn
                number="01"
                title="Shop"
                links={footerNavigation.shop}
              />

              <FooterColumn
                number="02"
                title="Collections"
                links={
                  footerNavigation.collections
                }
              />

              <FooterColumn
                number="03"
                title="Information"
                links={
                  footerNavigation.information
                }
              />
            </div>
          </div>

          {/* ====================================================
              CUSTOMER CARE
          ==================================================== */}

          <div
            className="
              grid
              border-b
              border-white/10
              sm:grid-cols-2
            "
          >
            {/* EMAIL */}

            {siteConfig.contact.email && (
              <div
                className="
                  border-b
                  border-white/10
                  py-7
                  sm:border-b-0
                  sm:border-r
                  sm:pr-10
                  lg:py-8
                "
              >
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-white/35
                  "
                >
                  Customer Care
                </p>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="
                    group
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    font-body
                    text-[13px]
                    text-white/70
                    transition-colors
                    duration-500
                    hover:text-white
                  "
                >
                  {siteConfig.contact.email}

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.25}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              </div>
            )}

            {/* WHATSAPP / PHONE */}

            <div
              className={`
                py-7
                lg:py-8
                ${
                  siteConfig.contact.email
                    ? "sm:pl-10"
                    : "sm:col-span-2"
                }
              `}
            >
              <p
                className="
                  font-body
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-white/35
                "
              >
                WhatsApp
              </p>

              {siteConfig.social.whatsapp ? (
                <a
                  href={
                    siteConfig.social.whatsapp
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    font-body
                    text-[13px]
                    text-white/70
                    transition-colors
                    duration-500
                    hover:text-white
                  "
                >
                  Chat with us

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.25}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              ) : siteConfig.contact.phone ? (
                <a
                  href={`tel:+${siteConfig.contact.phone}`}
                  className="
                    group
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    font-body
                    text-[13px]
                    text-white/70
                    transition-colors
                    duration-500
                    hover:text-white
                  "
                >
                  +{siteConfig.contact.phone}

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.25}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              ) : null}
            </div>
          </div>

          {/* ====================================================
              NEWSLETTER / EDITORIAL CTA
          ==================================================== */}

          <div
            className="
              relative
              mt-12
              overflow-hidden
              border
              border-white/10
              bg-white/[0.025]
              px-6
              py-8
              sm:px-8
              sm:py-10
              lg:px-10
              lg:py-12
            "
          >
            {/* Decorative glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-20
                -top-24
                h-64
                w-64
                rounded-full
                bg-[var(--color-rose)]
                opacity-[0.05]
                blur-[80px]
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                justify-between
                gap-8
                lg:flex-row
                lg:items-end
              "
            >
              <div>
                <p
                  className="
                    font-body
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[var(--color-rose-light)]
                  "
                >
                  Stay in the know
                </p>

                <h3
                  className="
                    mt-4
                    max-w-[650px]
                    font-display
                    text-[clamp(2rem,4vw,3.6rem)]
                    font-light
                    leading-[0.95]
                    tracking-[-0.035em]
                    text-white
                  "
                >
                  Discover the next
                  <br />
                  <span className="italic text-white/70">
                    Aayesha edit.
                  </span>
                </h3>
              </div>

              <Link
                href="#newsletter"
                className="
                  group
                  inline-flex
                  w-fit
                  items-center
                  gap-3
                  border-b
                  border-white/25
                  pb-2
                  font-body
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/65
                  transition-all
                  duration-500
                  hover:border-white
                  hover:text-white
                "
              >
                Join the newsletter

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.25}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>

          {/* ====================================================
              LEGAL
          ==================================================== */}

          <div className="pt-8">
            <div
              className="
                flex
                flex-col
                gap-6
                font-body
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white/30
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p>
                © {currentYear}{" "}
                {siteConfig.name}. All rights
                reserved.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="
                      relative
                      transition-colors
                      duration-500
                      hover:text-white
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/* ============================================================
   FOOTER COLUMN
============================================================ */

function FooterColumn({
  number,
  title,
  links,
}: {
  number: string;
  title: string;
  links: readonly {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className="
            font-body
            text-[7px]
            tracking-[0.12em]
            text-[var(--color-rose-light)]
            opacity-70
          "
        >
          {number}
        </span>

        <p
          className="
            font-body
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.28em]
            text-white/35
          "
        >
          {title}
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="
              group
              flex
              w-fit
              items-center
              gap-2
              font-body
              text-[12px]
              leading-5
              text-white/60
              transition-all
              duration-500
              hover:translate-x-1
              hover:text-white
              sm:text-[13px]
            "
          >
            <span>{link.label}</span>

            <ArrowUpRight
              size={12}
              strokeWidth={1.2}
              className="
                opacity-0
                transition-all
                duration-500
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
                group-hover:opacity-70
              "
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}