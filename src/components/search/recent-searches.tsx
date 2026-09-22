"use client";

import {
  Clock3,
  Search,
  X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
} from "@/lib/recent-searches/recent-searches";

import "./RecentSearches.css";

export function RecentSearches() {
  const [searches, setSearches] =
    useState<string[]>([]);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setSearches(getRecentSearches());
    setMounted(true);
  }, []);

  if (!mounted || searches.length === 0) {
    return null;
  }

  function handleRemove(query: string) {
    removeRecentSearch(query);

    setSearches((current) =>
      current.filter(
        (item) =>
          item.toLowerCase() !==
          query.toLowerCase(),
      ),
    );
  }

  function handleClear() {
    clearRecentSearches();
    setSearches([]);
  }

  return (
    <section
      className="recent-searches"
      aria-labelledby="recent-searches-title"
    >
      <div className="recent-searches__header">
        <div className="recent-searches__heading">
          <span
            className="recent-searches__icon"
            aria-hidden="true"
          >
            <Clock3
              size={15}
              strokeWidth={1.5}
            />
          </span>

          <div>
            <p className="recent-searches__eyebrow">
              Your Search History
            </p>

            <h2
              id="recent-searches-title"
              className="recent-searches__title"
            >
              Recent Searches
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="recent-searches__clear"
        >
          Clear All
        </button>
      </div>

      <div className="recent-searches__list">
        {searches.map((query) => (
          <div
            key={query}
            className="recent-searches__item"
          >
            <Link
              href={`/search?q=${encodeURIComponent(
                query,
              )}`}
              className="recent-searches__query"
            >
              <Search
                size={14}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span>{query}</span>
            </Link>

            <button
              type="button"
              onClick={() =>
                handleRemove(query)
              }
              aria-label={`Remove ${query} from recent searches`}
              className="recent-searches__remove"
            >
              <X
                size={14}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}