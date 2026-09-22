"use client";

import { useEffect } from "react";

import { addRecentSearch } from "@/lib/recent-searches/recent-searches";

interface RecentSearchTrackerProps {
  query: string;
}

export function RecentSearchTracker({
  query,
}: RecentSearchTrackerProps) {
  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    addRecentSearch(normalizedQuery);
  }, [query]);

  return null;
}