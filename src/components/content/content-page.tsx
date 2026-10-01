import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  contentGroups,
  type ContentGroup,
} from "@/config/content-pages";

import {
  ContentBody,
  type ContentSection,
} from "./content-body";

import "./ContentPage.css";
import "@/components/home/HomeCta.css";

type ContentHighlight = {
  label: string;
  value: string;
};

type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt?: string;
  sections: ContentSection[];
  highlights?: ContentHighlight[];

  /* Which set of pages this belongs to, and which one it is. */
  group?: ContentGroup;
  currentHref?: string;

  /* "policy" reads like a document, "info" like a guide. */
  variant?: "policy" | "info";

  /* Skip the hero when the page supplies its own. */
  embedded?: boolean;

  /* Hide the closing help card (the contact page has its own). */
  hideHelp?: boolean;

  /* Extra content rendered after the sections (contact cards…). */
  children?: React.ReactNode;
};

function readingMinutes(sections: ContentSection[]): number {
  const words = sections
    .flatMap((section) => [
      section.title,
      ...(section.paragraphs ?? []),
      ...(section.items ?? []),
    ])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200));
}

export function ContentPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
  highlights = [],
  group = "policies",
  currentHref,
  variant = "policy",
  embedded = false,
  hideHelp = false,
  children,
}: ContentPageProps) {
  const links = contentGroups[group].links;

  return (
    <div
      className={[
        "content-page",
        `content-page--${variant}`,
        embedded ? "content-page--embedded" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      {!embedded && (
        <section className="content-page__hero">
          <div className="content-page__container">
            <nav
              aria-label="Breadcrumb"
              className="content-page__crumbs"
            >
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>

            <div className="content-page__eyebrow">
              <span aria-hidden="true" />
              {eyebrow}
            </div>

            <h1 className="content-page__title">{title}</h1>

            <p className="content-page__description">
              {description}
            </p>

            <ul className="content-page__meta">
              {updatedAt && <li>Last updated {updatedAt}</li>}

              <li>
                {sections.length}{" "}
                {sections.length === 1 ? "section" : "sections"}
              </li>

              <li>{readingMinutes(sections)} min read</li>
            </ul>

            <nav
              aria-label={contentGroups[group].label}
              className="content-page__switcher"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    link.href === currentHref ? "page" : undefined
                  }
                  className="content-page__pill"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}

      {/* =====================================================
          AT A GLANCE
      ===================================================== */}

      {highlights.length > 0 && (
        <section
          className="content-page__glance"
          aria-label="At a glance"
        >
          <div className="content-page__container">
            <p className="content-page__glance-label">
              At a glance
            </p>

            <ul className="content-page__glance-grid">
              {highlights.map((highlight, index) => (
                <li
                  key={`${highlight.label}-${index}`}
                  className="content-page__glance-card"
                >
                  <span className="content-page__glance-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="content-page__glance-title">
                    {highlight.label}
                  </p>

                  <p className="content-page__glance-value">
                    {highlight.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="content-page__body">
        <div className="content-page__container">
          <ContentBody sections={sections} variant={variant} />
        </div>
      </section>

      {children}

      {/* =====================================================
          HELP
      ===================================================== */}

      {!embedded && !hideHelp && (
        <section className="content-page__help">
          <div className="content-page__container">
            <div className="content-page__help-card">
              <div className="content-page__help-copy">
                <p className="content-page__help-eyebrow">
                  Still need help?
                </p>

                <h2 className="content-page__help-title">
                  Our customer care team is happy to assist.
                </h2>
              </div>

              <div className="content-page__help-actions">
                <Link
                  href="/contact"
                  className="home-cta home-cta--light"
                >
                  Contact us
                </Link>

                {siteConfig.contact.email && (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="content-page__help-link"
                  >
                    <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
                    {siteConfig.contact.email}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
