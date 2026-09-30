/* =========================================================
   SITE SEARCH INDEX
   Static, non-product destinations that the search page can
   match: collections, help pages and account areas.
========================================================= */

export type SiteEntryType = "collection" | "page";

export interface SiteEntry {
  type: SiteEntryType;
  title: string;
  description: string;
  href: string;
  keywords: string[];
}

export const siteEntries: SiteEntry[] = [
  /* ---------------- Collections ---------------- */

  {
    type: "collection",
    title: "New Arrivals",
    description: "The latest pieces added to the Aayesha collection.",
    href: "/collections/new-arrivals",
    keywords: ["new", "latest", "new in", "just in", "fresh", "arrivals"],
  },
  {
    type: "collection",
    title: "Best Sellers",
    description: "The pieces our customers return to again and again.",
    href: "/collections/best-sellers",
    keywords: ["best", "popular", "trending", "top", "favourite", "bestseller"],
  },
  {
    type: "collection",
    title: "Festive Edit",
    description: "Rich fabrics and hand finished detail for the season.",
    href: "/collections/festive",
    keywords: ["festive", "festival", "wedding", "occasion", "celebration", "eid", "diwali"],
  },
  {
    type: "collection",
    title: "Ethnic Wear",
    description: "Timeless Indian silhouettes, thoughtfully made.",
    href: "/collections/ethnic",
    keywords: ["ethnic", "traditional", "indian", "kurta", "salwar"],
  },
  {
    type: "collection",
    title: "Contemporary",
    description: "Modern takes on Indian womenswear.",
    href: "/collections/contemporary",
    keywords: ["contemporary", "modern", "fusion", "western", "casual"],
  },
  {
    type: "collection",
    title: "All Collections",
    description: "Browse every curated edit in one place.",
    href: "/collections",
    keywords: ["collections", "edits", "browse", "curated"],
  },
  {
    type: "collection",
    title: "Shop All",
    description: "Every piece from Aayesha Fashion.",
    href: "/shop",
    keywords: ["shop", "all", "products", "store", "catalogue", "catalog"],
  },
  {
    type: "collection",
    title: "Shop by Category",
    description: "Garara, suits, frocks and more, by category.",
    href: "/categories",
    keywords: ["category", "categories", "garara", "suit", "suits", "frock", "gown", "dress"],
  },

  /* ---------------- Help & information ---------------- */

  {
    type: "page",
    title: "Our Story",
    description: "The house of Aayesha and the people behind it.",
    href: "/our-story",
    keywords: ["about", "story", "brand", "who", "atelier", "craft", "house"],
  },
  {
    type: "page",
    title: "Contact Us",
    description: "Write to us or chat with customer care.",
    href: "/contact",
    keywords: ["contact", "help", "support", "customer care", "email", "phone", "whatsapp", "enquiry", "call"],
  },
  {
    type: "page",
    title: "Shipping & Delivery",
    description: "Delivery times, charges and where we ship.",
    href: "/shipping",
    keywords: ["shipping", "delivery", "deliver", "courier", "dispatch", "pincode", "charges"],
  },
  {
    type: "page",
    title: "Returns & Exchange",
    description: "How to return or exchange a piece.",
    href: "/returns",
    keywords: ["return", "returns", "exchange", "replace", "size exchange"],
  },
  {
    type: "page",
    title: "Shipping Policy",
    description: "The full shipping policy.",
    href: "/shipping-policy",
    keywords: ["shipping policy", "policy", "delivery policy"],
  },
  {
    type: "page",
    title: "Refund Policy",
    description: "How and when refunds are issued.",
    href: "/refund-policy",
    keywords: ["refund", "refunds", "money back", "cancel", "cancellation", "policy"],
  },
  {
    type: "page",
    title: "Privacy Policy",
    description: "How we collect and protect your information.",
    href: "/privacy-policy",
    keywords: ["privacy", "data", "cookies", "policy", "personal information"],
  },
  {
    type: "page",
    title: "Terms & Conditions",
    description: "The terms of using Aayesha Fashion.",
    href: "/terms",
    keywords: ["terms", "conditions", "legal", "tnc"],
  },

  /* ---------------- Your account ---------------- */

  {
    type: "page",
    title: "Track an Order",
    description: "Check the status of your order.",
    href: "/account/orders",
    keywords: ["track", "order", "orders", "status", "my orders", "tracking"],
  },
  {
    type: "page",
    title: "My Wishlist",
    description: "Pieces you have saved.",
    href: "/wishlist",
    keywords: ["wishlist", "saved", "favourites", "favorites", "hearts"],
  },
  {
    type: "page",
    title: "Shopping Bag",
    description: "Review what is in your bag.",
    href: "/cart",
    keywords: ["cart", "bag", "basket", "checkout", "buy"],
  },
  {
    type: "page",
    title: "My Account",
    description: "Profile, addresses and account details.",
    href: "/account",
    keywords: ["account", "profile", "address", "addresses", "login", "sign in", "password"],
  },
];

/* Searches shown when there is nothing typed yet. */
export const popularSearches = [
  "Garara",
  "Suit set",
  "Festive",
  "Kurta",
  "Frock",
  "Gown",
  "Pakistani",
  "Embroidered",
];

/* =========================================================
   MATCHING
========================================================= */

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function scoreEntry(entry: SiteEntry, terms: string[]): number {
  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const keywords = entry.keywords.map(normalize);

  let total = 0;

  for (const term of terms) {
    let best = 0;

    if (title === term) best = 100;
    else if (title.startsWith(term)) best = 80;
    else if (title.includes(term)) best = 60;
    else if (keywords.some((keyword) => keyword === term)) best = 55;
    else if (keywords.some((keyword) => keyword.includes(term) || (term.length > 3 && term.includes(keyword)))) best = 40;
    else if (description.includes(term)) best = 20;

    if (best === 0) {
      return 0;
    }

    total += best;
  }

  return total;
}

export function searchSiteEntries(query: string): SiteEntry[] {
  const terms = normalize(query)
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return siteEntries
    .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry);
}

export function searchCategories<T extends { name: string; slug: string; description?: string }>(
  categories: T[],
  query: string,
): T[] {
  const terms = normalize(query)
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return categories.filter((category) => {
    const haystack = normalize(
      `${category.name} ${category.slug} ${category.description ?? ""}`,
    );

    return terms.every((term) => haystack.includes(term));
  });
}
