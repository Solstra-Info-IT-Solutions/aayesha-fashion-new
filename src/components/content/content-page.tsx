import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import "./ContentPage.css";

type ContentSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

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
  backHref?: string;
  backLabel?: string;
};

export function ContentPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
  highlights = [],
  backHref = "/",
  backLabel = "Back to home",
}: ContentPageProps) {
  return (
    <main className="content-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="content-page__hero">
        <div className="content-page__container">
          <div className="content-page__hero-inner">
            <Link
              href={backHref}
              className="content-page__back"
            >
              <ArrowLeft
                size={13}
                strokeWidth={1.3}
              />

              <span>{backLabel}</span>
            </Link>

            <div className="content-page__hero-copy">
              <div className="content-page__eyebrow">
                <span className="content-page__eyebrow-line" />

                <span>
                  {eyebrow}
                </span>
              </div>

              <h1 className="content-page__title">
                {title}
              </h1>

              <p className="content-page__description">
                {description}
              </p>

              {updatedAt && (
                <div className="content-page__updated">
                  <span />

                  <p>
                    Last updated{" "}
                    {updatedAt}
                  </p>
                </div>
              )}
            </div>

            <div
              className="content-page__hero-mark"
              aria-hidden="true"
            >
              <span>AA</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHTS
      ===================================================== */}

      {highlights.length > 0 && (
        <section className="content-page__highlights">
          <div className="content-page__container">
            <div
              className={`content-page__highlight-grid content-page__highlight-grid--${Math.min(
                highlights.length,
                3,
              )}`}
            >
              {highlights.map(
                (
                  highlight,
                  index,
                ) => (
                  <div
                    key={`${highlight.label}-${index}`}
                    className="content-page__highlight"
                  >
                    <span className="content-page__highlight-number">
                      0{index + 1}
                    </span>

                    <div>
                      <p className="content-page__highlight-label">
                        {highlight.label}
                      </p>

                      <p className="content-page__highlight-value">
                        {highlight.value}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="content-page__body">
        <div className="content-page__container">
          <div className="content-page__body-grid">
            <aside className="content-page__aside">
              <div className="content-page__aside-inner">
                <p className="content-page__aside-brand">
                  AAYESHA
                </p>

                <span className="content-page__aside-line" />

                <p className="content-page__aside-copy">
                  Contemporary Indian
                  fashion shaped by
                  considered details,
                  thoughtful service and
                  timeless elegance.
                </p>

                <p className="content-page__aside-caption">
                  Aayesha Fashion
                  <br />
                  Contemporary Indian
                  Fashion
                </p>
              </div>
            </aside>

            <div className="content-page__sections">
              {sections.map(
                (section, index) => (
                  <article
                    key={`${section.title}-${index}`}
                    className="content-page__section"
                  >
                    <div className="content-page__section-header">
                      <span className="content-page__section-number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <div className="content-page__section-rule" />

                      <h2 className="content-page__section-title">
                        {section.title}
                      </h2>
                    </div>

                    <div className="content-page__section-content">
                      {section.paragraphs?.map(
                        (
                          paragraph,
                          paragraphIndex,
                        ) => (
                          <p
                            key={
                              paragraphIndex
                            }
                            className="content-page__paragraph"
                          >
                            {paragraph}
                          </p>
                        ),
                      )}

                      {section.items &&
                        section.items.length >
                          0 && (
                          <div className="content-page__items">
                            {section.items.map(
                              (
                                item,
                                itemIndex,
                              ) => (
                                <div
                                  key={
                                    itemIndex
                                  }
                                  className="content-page__item"
                                >
                                  <span className="content-page__item-mark">
                                    —
                                  </span>

                                  <p>
                                    {item}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="content-page__cta">
        <div className="content-page__container">
          <div className="content-page__cta-inner">
            <div className="content-page__cta-copy">
              <p className="content-page__cta-eyebrow">
                Continue exploring
              </p>

              <h2 className="content-page__cta-title">
                Discover the
                <br />
                Aayesha Fashion edit.
              </h2>
            </div>

            <Link
              href="/shop"
              className="content-page__cta-button"
            >
              <span>
                Explore collection
              </span>

              <span className="content-page__cta-icon">
                <ArrowRight
                  size={14}
                  strokeWidth={1.3}
                />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}