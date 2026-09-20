"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ProductAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ProductAccordion({
  title,
  children,
  defaultOpen = false,
}: ProductAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="product-accordion">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="product-accordion__trigger"
        aria-expanded={open}
      >
        <span className="product-accordion__title">
          {title}
        </span>

        <ChevronDown
          className={[
            "product-accordion__icon",
            open ? "product-accordion__icon--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="product-accordion__content">
          {children}
        </div>
      )}
    </div>
  );
}