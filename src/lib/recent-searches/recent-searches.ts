const STORAGE_KEY = "aayesha-recent-searches";

const MAX_ITEMS = 8;

/* =========================================================
   GET RECENT SEARCHES
========================================================= */

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (query): query is string =>
          typeof query === "string" &&
          query.trim().length > 0,
      )
      .map((query) => query.trim());
  } catch (error) {
    console.error(
      "Failed to read recent searches:",
      error,
    );

    return [];
  }
}

/* =========================================================
   ADD RECENT SEARCH
========================================================= */

export function addRecentSearch(
  query: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedQuery =
    query.trim();

  if (!normalizedQuery) {
    return;
  }

  try {
    const existing =
      getRecentSearches();

    const updated = [
      normalizedQuery,
      ...existing.filter(
        (item) =>
          item.toLowerCase() !==
          normalizedQuery.toLowerCase(),
      ),
    ].slice(0, MAX_ITEMS);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    );
  } catch (error) {
    console.error(
      "Failed to save recent search:",
      error,
    );
  }
}

/* =========================================================
   REMOVE SINGLE SEARCH
========================================================= */

export function removeRecentSearch(
  query: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const updated =
      getRecentSearches().filter(
        (item) =>
          item.toLowerCase() !==
          query.trim().toLowerCase(),
      );

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    );
  } catch (error) {
    console.error(
      "Failed to remove recent search:",
      error,
    );
  }
}

/* =========================================================
   CLEAR ALL SEARCHES
========================================================= */

export function clearRecentSearches(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Failed to clear recent searches:",
      error,
    );
  }
}