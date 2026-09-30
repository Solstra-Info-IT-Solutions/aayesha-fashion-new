"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ListTree } from "lucide-react";

export interface ContentSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

interface ContentBodyProps {
  sections: ContentSection[];

  /* "policy": every section stays open, like a document.
     "info": sections are collapsible, like a guide. */
  variant: "policy" | "info";
}

/* Titles arrive as "1. Scope of this policy" — the number is
   shown separately, so drop it from the text. */
function cleanTitle(title: string): string {
  return title.replace(/^\d+\.\s*/, "");
}

function sectionId(index: number): string {
  return `section-${index + 1}`;
}

export function ContentBody({
  sections,
  variant,
}: ContentBodyProps) {
  const collapsible = variant === "info";

  const [open, setOpen] = useState<Set<number>>(
    () => new Set(collapsible ? [0] : []),
  );

  const [active, setActive] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  const allOpen = open.size === sections.length;

  /* Open the section named in the URL hash, if any. */
  useEffect(() => {
    const match = window.location.hash.match(/^#section-(\d+)$/);

    if (!match) {
      return;
    }

    const index = Number(match[1]) - 1;

    if (index >= 0 && index < sections.length) {
      window.setTimeout(() => {
        setOpen((current) => new Set(current).add(index));

        window.setTimeout(() => {
          document
            .getElementById(sectionId(index))
            ?.scrollIntoView({ block: "start" });
        }, 60);
      }, 0);
    }
  }, [sections.length]);

  /* Highlight the section currently being read. */
  useEffect(() => {
    const elements = sections
      .map((_, index) =>
        document.getElementById(sectionId(index)),
      )
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0 || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        if (visible) {
          const index = elements.indexOf(
            visible.target as HTMLElement,
          );

          if (index >= 0) {
            setActive(index);
          }
        }
      },
      { rootMargin: "-110px 0px -65% 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  const toggle = (index: number) => {
    setOpen((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const goTo = (index: number) => {
    setTocOpen(false);

    if (collapsible) {
      setOpen((current) => new Set(current).add(index));
    }

    window.setTimeout(() => {
      document
        .getElementById(sectionId(index))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });

      window.history.replaceState(null, "", `#${sectionId(index)}`);
    }, 40);
  };

  const toc = (
    <ol className="content-page__toc-list">
      {sections.map((section, index) => (
        <li key={`${section.title}-${index}`}>
          <a
            href={`#${sectionId(index)}`}
            onClick={(event) => {
              event.preventDefault();
              goTo(index);
            }}
            aria-current={active === index ? "true" : undefined}
            className="content-page__toc-link"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {cleanTitle(section.title)}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="content-page__body-grid">
      {/* Table of contents */}

      <aside className="content-page__toc" aria-label="On this page">
        {/* Mobile: collapsible */}

        <button
          type="button"
          onClick={() => setTocOpen((value) => !value)}
          aria-expanded={tocOpen}
          className="content-page__toc-toggle"
        >
          <ListTree size={16} strokeWidth={1.6} aria-hidden="true" />
          On this page
          <ChevronDown
            size={16}
            strokeWidth={1.6}
            aria-hidden="true"
            className="content-page__toc-chevron"
          />
        </button>

        <div
          className={[
            "content-page__toc-panel",
            tocOpen ? "content-page__toc-panel--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <p className="content-page__toc-title">On this page</p>

          {toc}
        </div>
      </aside>

      {/* Sections */}

      <div className="content-page__sections">
        {collapsible && (
          <div className="content-page__sections-bar">
            <p>
              {sections.length}{" "}
              {sections.length === 1 ? "section" : "sections"}
            </p>

            <button
              type="button"
              onClick={() =>
                setOpen(
                  allOpen
                    ? new Set()
                    : new Set(sections.map((_, index) => index)),
                )
              }
              className="content-page__expand-all"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        )}

        {sections.map((section, index) => {
          const isOpen = !collapsible || open.has(index);

          return (
            <article
              key={`${section.title}-${index}`}
              id={sectionId(index)}
              className={[
                "content-page__section",
                collapsible ? "content-page__section--collapsible" : "",
                isOpen ? "content-page__section--open" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <h2 className="content-page__section-heading">
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`${sectionId(index)}-panel`}
                    className="content-page__section-trigger"
                  >
                    <span className="content-page__section-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="content-page__section-title">
                      {cleanTitle(section.title)}
                    </span>

                    <ChevronDown
                      size={18}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className="content-page__section-chevron"
                    />
                  </button>
                ) : (
                  <>
                    <span className="content-page__section-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="content-page__section-title">
                      {cleanTitle(section.title)}
                    </span>
                  </>
                )}
              </h2>

              <div
                id={`${sectionId(index)}-panel`}
                hidden={!isOpen}
                className="content-page__section-content"
              >
                {section.paragraphs?.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className="content-page__paragraph"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items && section.items.length > 0 && (
                  <ul className="content-page__items">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
