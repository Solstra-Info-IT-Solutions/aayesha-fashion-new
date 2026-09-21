"use client";

import type { ReactNode } from "react";

import { ChevronDown } from "lucide-react";

interface FilterSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function FilterSection({
  title,
  open,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <section
      className={`filter-section ${
        open
          ? "filter-section--open"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="filter-section__toggle"
      >
        <span className="filter-section__title">
          {title}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={1.3}
          className="filter-section__icon"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="filter-section__content">
          {children}
        </div>
      )}
    </section>
  );
}