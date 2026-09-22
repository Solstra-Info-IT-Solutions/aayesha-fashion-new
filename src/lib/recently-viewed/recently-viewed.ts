const STORAGE_KEY = "aayesha-recently-viewed";
const MAX_ITEMS = 12;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string =>
        typeof id === "string" && id.trim().length > 0,
    );
  } catch (error) {
    console.error(
      "Failed to read recently viewed products:",
      error,
    );

    return [];
  }
}

export function addRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!productId) {
    return;
  }

  try {
    const existing = getRecentlyViewed();

    const updated = [
      productId,
      ...existing.filter((id) => id !== productId),
    ].slice(0, MAX_ITEMS);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated),
    );
  } catch (error) {
    console.error(
      "Failed to save recently viewed product:",
      error,
    );
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(
      "Failed to clear recently viewed products:",
      error,
    );
  }
}