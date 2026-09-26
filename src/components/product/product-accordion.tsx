"use client";

import {
  ChevronDown,
} from "lucide-react";

import {
  useId,
  useState,
} from "react";

import "./ProductAccordion.css";

/* =========================================================
   TYPES
========================================================= */

interface ProductAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/* =========================================================
   COMPONENT
========================================================= */

export function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: ProductAccordionProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  const contentId = useId();

  /* =======================================================
     TOGGLE
  ======================================================= */

  const handleToggle = () => {
    setOpen((value) => !value);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className={[
        "product-accordion",
        open
          ? "product-accordion--open"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* =================================================
          TRIGGER
      ================================================= */}

      <button
        type="button"
        onClick={handleToggle}
        className="product-accordion__trigger"
        aria-expanded={open}
        aria-controls={contentId}
      >
        <span className="product-accordion__title">
          {title}
        </span>

        <span
          className="product-accordion__indicator"
          aria-hidden="true"
        >
          <ChevronDown
            className={[
              "product-accordion__icon",
              open
                ? "product-accordion__icon--open"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            size={18}
            strokeWidth={1.35}
          />
        </span>
      </button>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        id={contentId}
        className={[
          "product-accordion__content-wrapper",
          open
            ? "product-accordion__content-wrapper--open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!open}
      >
        <div className="product-accordion__content">
          {children}
        </div>
      </div>
    </section>
  );
}