/* =========================================================
   ANALYTICS / MARKETING EVENTS

   Thin, consent-aware wrapper over Google Analytics 4 (gtag) and
   the Meta Pixel (fbq). Nothing is sent unless the matching script
   was loaded, which only happens after the visitor consents (see
   components/analytics/analytics-scripts.tsx).
========================================================= */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export interface TrackedItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

const toGaItems = (items: TrackedItem[]) =>
  items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity ?? 1,
    ...(item.category ? { item_category: item.category } : {}),
  }));

const toFbContents = (items: TrackedItem[]) =>
  items.map((item) => ({
    id: item.id,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }));

const value = (items: TrackedItem[]) =>
  items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);

function send(
  ga: [string, Record<string, unknown>],
  fb?: [string, string, Record<string, unknown>?],
) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", ga[0], ga[1]);

    if (fb) {
      window.fbq?.(fb[0], fb[1], fb[2]);
    }
  } catch {
    /* analytics must never break the page */
  }
}

export function trackViewItem(item: TrackedItem) {
  send(
    ["view_item", { currency: "INR", value: item.price, items: toGaItems([item]) }],
    [
      "track",
      "ViewContent",
      {
        content_ids: [item.id],
        content_name: item.name,
        content_type: "product",
        value: item.price,
        currency: "INR",
      },
    ],
  );
}

export function trackAddToCart(item: TrackedItem) {
  const total = value([item]);

  send(
    ["add_to_cart", { currency: "INR", value: total, items: toGaItems([item]) }],
    [
      "track",
      "AddToCart",
      {
        content_ids: [item.id],
        content_name: item.name,
        content_type: "product",
        value: total,
        currency: "INR",
      },
    ],
  );
}

export function trackBeginCheckout(items: TrackedItem[]) {
  send(
    [
      "begin_checkout",
      { currency: "INR", value: value(items), items: toGaItems(items) },
    ],
    [
      "track",
      "InitiateCheckout",
      {
        contents: toFbContents(items),
        value: value(items),
        currency: "INR",
        num_items: items.length,
      },
    ],
  );
}

/** Fires once per order (guarded with sessionStorage). */
export function trackPurchase(
  orderNumber: string,
  total: number,
  items: TrackedItem[],
) {
  if (typeof window === "undefined") return;

  const key = `aayesha-purchase-tracked:${orderNumber}`;

  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* continue without the guard */
  }

  send(
    [
      "purchase",
      {
        transaction_id: orderNumber,
        currency: "INR",
        value: total,
        items: toGaItems(items),
      },
    ],
    [
      "track",
      "Purchase",
      {
        contents: toFbContents(items),
        value: total,
        currency: "INR",
        num_items: items.length,
      },
    ],
  );
}

export function trackSearch(query: string) {
  send(
    ["search", { search_term: query }],
    ["track", "Search", { search_string: query }],
  );
}
