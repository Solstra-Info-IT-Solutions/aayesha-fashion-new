import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Mail,
  MessageCircle,
  PackageSearch,
  Phone,
  RotateCcw,
  Ruler,
  Truck,
  UserRound,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { contentGroups } from "@/config/content-pages";

import "@/components/home/HomeCta.css";
import "./ContactPage.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Aayesha Fashion for product, order, shipping, returns, and general enquiries.",
  alternates: {
    canonical: "/contact",
  },
};

/* =========================================================
   TOPICS
   Quick routes to the right place before writing in.
========================================================= */

const topics = [
  {
    icon: PackageSearch,
    title: "Track an order",
    description:
      "See where your order is and what has happened so far.",
    href: "/account/orders",
  },
  {
    icon: Truck,
    title: "Shipping & delivery",
    description:
      "Dispatch, tracking, delivery addresses and delays.",
    href: "/shipping",
  },
  {
    icon: RotateCcw,
    title: "Returns & exchange",
    description:
      "How to raise a return or exchange, and what to expect.",
    href: "/returns",
  },
  {
    icon: CreditCard,
    title: "Payments & refunds",
    description:
      "When refunds are issued and how they reach you.",
    href: "/refund-policy",
  },
  {
    icon: Ruler,
    title: "Sizing & product help",
    description:
      "Ask about fit, measurements, fabric or styling.",
    href: "mailto",
  },
  {
    icon: UserRound,
    title: "Your account",
    description:
      "Profile, saved addresses and sign-in help.",
    href: "/account",
  },
] as const;

const checklist = [
  "Your order number, if the question is about an order",
  "The email address or phone number used on the order",
  "The product name, and the size or colour you chose",
  "A clear photo, if you are reporting damage or a defect",
];

/* =========================================================
   PAGE
========================================================= */

export default function ContactPage() {
  const { phone, email } = siteConfig.contact;
  const whatsapp = siteConfig.social.whatsapp;

  const methods = [
    phone
      ? {
          icon: Phone,
          label: "Call us",
          value: `+${phone}`,
          href: `tel:+${phone}`,
          action: "Call customer care",
        }
      : null,
    whatsapp
      ? {
          icon: MessageCircle,
          label: "WhatsApp",
          value: "Chat with us",
          href: whatsapp,
          action: "Open WhatsApp",
          external: true,
        }
      : null,
    email
      ? {
          icon: Mail,
          label: "Email",
          value: email,
          href: `mailto:${email}`,
          action: "Send an enquiry",
        }
      : null,
  ].filter(
    (method): method is NonNullable<typeof method> =>
      method !== null,
  );

  /* "Sizing & product help" writes to email when there is one,
     otherwise it opens WhatsApp. */
  const helpHref = email
    ? `mailto:${email}?subject=Product%20question`
    : whatsapp || "/shop";

  return (
    <div className="contact">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact__hero">
        <div className="contact__container">
          <nav
            aria-label="Breadcrumb"
            className="contact__crumbs"
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Contact Us</span>
          </nav>

          <div className="contact__eyebrow">
            <span aria-hidden="true" />
            Customer Care
          </div>

          <h1 className="contact__title">
            We&apos;re here <em>to help.</em>
          </h1>

          <p className="contact__lead">
            Whether it is an order, sizing, delivery, a return or
            simply finding the right piece, our customer care
            team is happy to guide you.
          </p>

          <nav
            aria-label={contentGroups.information.label}
            className="contact__switcher"
          >
            {contentGroups.information.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  link.href === "/contact" ? "page" : undefined
                }
                className="contact__pill"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* =====================================================
          CONTACT METHODS
      ===================================================== */}

      <section
        className="contact__section"
        aria-labelledby="contact-methods-title"
      >
        <div className="contact__container">
          <header className="contact__section-head">
            <h2
              id="contact-methods-title"
              className="contact__section-label"
            >
              Reach us directly
            </h2>
          </header>

          <ul className="contact__methods">
            {methods.map((method) => {
              const Icon = method.icon;

              return (
                <li key={method.label}>
                  <a
                    href={method.href}
                    {...("external" in method && method.external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="contact__method"
                  >
                    <span
                      className="contact__method-icon"
                      aria-hidden="true"
                    >
                      <Icon size={22} strokeWidth={1.5} />
                    </span>

                    <span className="contact__method-label">
                      {method.label}
                    </span>

                    <span className="contact__method-value">
                      {method.value}
                    </span>

                    <span className="contact__method-action">
                      {method.action}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* =====================================================
          TOPICS
      ===================================================== */}

      <section
        className="contact__section"
        aria-labelledby="contact-topics-title"
      >
        <div className="contact__container">
          <header className="contact__section-head">
            <h2
              id="contact-topics-title"
              className="contact__section-label"
            >
              What do you need help with?
            </h2>
          </header>

          <ul className="contact__topics">
            {topics.map((topic) => {
              const Icon = topic.icon;

              const href =
                topic.href === "mailto" ? helpHref : topic.href;

              return (
                <li key={topic.title}>
                  <Link href={href} className="contact__topic">
                    <span
                      className="contact__topic-icon"
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </span>

                    <span className="contact__topic-copy">
                      <strong>{topic.title}</strong>
                      <span>{topic.description}</span>
                    </span>

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="contact__topic-arrow"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* =====================================================
          BEFORE YOU WRITE
      ===================================================== */}

      <section className="contact__section contact__section--last">
        <div className="contact__container">
          <div className="contact__prepare">
            <div>
              <p className="contact__eyebrow contact__eyebrow--plain">
                Helps us help you
              </p>

              <h2 className="contact__prepare-title">
                Before you get in touch
              </h2>

              <p className="contact__prepare-copy">
                Good service starts with clear information. Having
                these ready means we can answer faster.
              </p>
            </div>

            <ul className="contact__checklist">
              {checklist.map((item) => (
                <li key={item}>
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="contact__closing">
        <div className="contact__container">
          <p className="contact__closing-eyebrow">
            Aayesha Fashion
          </p>

          <h2 className="contact__closing-title">
            Style that feels distinctly yours.
          </h2>

          <Link
            href="/shop"
            className="home-cta home-cta--light"
          >
            Shop all pieces
          </Link>
        </div>
      </section>
    </div>
  );
}
