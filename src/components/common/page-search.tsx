"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";

import "./PageSearch.css";

interface PageSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;

  /* Shown under the field while something is typed. */
  status?: string;
}

/*
 * In-page filter field shared by the Categories and Collections
 * pages. It filters what is already on the page; a link hands the
 * same words to the full-site search.
 */
export function PageSearch({
  value,
  onChange,
  placeholder,
  label,
  status,
}: PageSearchProps) {
  const id = useId();
  const trimmed = value.trim();

  return (
    <div className="page-search">
      <div role="search" className="page-search__field">
        <label htmlFor={id} className="page-search__sr">
          {label}
        </label>

        <Search
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="page-search__icon"
        />

        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value) {
              event.preventDefault();
              onChange("");
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="page-search__input"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="page-search__clear"
          >
            <X size={17} strokeWidth={1.6} />
          </button>
        )}
      </div>

      <p className="page-search__status" aria-live="polite">
        {trimmed ? (
          <>
            {status ? <span>{status}</span> : null}

            <Link
              href={`/search?q=${encodeURIComponent(trimmed)}`}
              className="page-search__global"
            >
              Search the whole site for “{trimmed}”
              <ArrowUpRight
                size={13}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

/* Shared matcher: every typed word must appear somewhere. */
export function matchesQuery(
  query: string,
  ...fields: Array<string | undefined | null>
): boolean {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const haystack = fields.join(" ").toLowerCase();

  return terms.every((term) => haystack.includes(term));
}
