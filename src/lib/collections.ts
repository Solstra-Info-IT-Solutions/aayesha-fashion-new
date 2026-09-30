import { getCategories } from "@/services/category.service";
import {
  getPrimaryProductMedia,
  type Product,
} from "@/types/product";

/* =========================================================
   COLLECTION DEFINITIONS
   Shared by the collections index, the collection pages and
   the collection switcher.

   New Arrivals and Best Sellers are product flags and always
   exist. The others are backed by a category and are listed
   only when that category exists and is active, so nothing
   ever links to a missing page.
========================================================= */

export interface CollectionDefinition {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  href: string;
  kind: "flag" | "category";
}

export const collectionDefinitions: CollectionDefinition[] = [
  {
    slug: "new-arrivals",
    label: "New Arrivals",
    eyebrow: "Just introduced",
    description:
      "Discover the latest pieces added to the Aayesha Fashion collection.",
    href: "/collections/new-arrivals",
    kind: "flag",
  },
  {
    slug: "best-sellers",
    label: "Best Sellers",
    eyebrow: "Most loved",
    description:
      "Explore the pieces our customers return to time and again.",
    href: "/collections/best-sellers",
    kind: "flag",
  },
  {
    slug: "festive",
    label: "Festive Edit",
    eyebrow: "For celebrations",
    description:
      "Luminous colours and graceful silhouettes for ceremonies and evenings worth dressing for.",
    href: "/collections/festive",
    kind: "category",
  },
  {
    slug: "ethnic",
    label: "Ethnic Wear",
    eyebrow: "Timeless",
    description:
      "Indian silhouettes, thoughtfully made and finished by hand.",
    href: "/collections/ethnic",
    kind: "category",
  },
  {
    slug: "contemporary",
    label: "Contemporary",
    eyebrow: "Modern",
    description:
      "Fresh, easy takes on Indian womenswear for everyday.",
    href: "/collections/contemporary",
    kind: "category",
  },
];

export function getCollectionDefinition(
  slug: string,
): CollectionDefinition {
  const definition = collectionDefinitions.find(
    (item) => item.slug === slug,
  );

  if (!definition) {
    throw new Error(`Unknown collection: ${slug}`);
  }

  return definition;
}

/* The collections that can actually be opened right now. */
export async function getAvailableCollections(): Promise<
  CollectionDefinition[]
> {
  let slugs = new Set<string>();

  try {
    const categories = await getCategories();

    slugs = new Set(
      categories
        .filter((category) => category.isActive)
        .map((category) => category.slug),
    );
  } catch {
    slugs = new Set();
  }

  return collectionDefinitions.filter(
    (item) => item.kind === "flag" || slugs.has(item.slug),
  );
}

/* Hero artwork: the first piece in the collection. */
export function heroImageOf(products: Product[]): string {
  const first = products[0];

  return (first && getPrimaryProductMedia(first)?.src) || "";
}
