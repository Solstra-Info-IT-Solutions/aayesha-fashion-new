import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/services/category.service";
import {
  getPrimaryProductMedia,
  type Product,
} from "@/types/product";
import type { Category } from "@/types/category";

import {
  CollectionsIndex,
  type CollectionSummary,
} from "@/components/collections/collections-index";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Aayesha Fashion collections — new arrivals, best sellers and curated edits for every occasion.",
  alternates: {
    canonical: "/collections",
  },
};

/* =========================================================
   COLLECTION DEFINITIONS
   New Arrivals and Best Sellers are always available. The
   others exist only when the matching category does, so no
   card ever links to a missing page.
========================================================= */

const fixedCollections = [
  {
    slug: "new-arrivals",
    label: "New Arrivals",
    eyebrow: "Just introduced",
    description:
      "Discover the latest pieces added to the Aayesha Fashion collection.",
    href: "/collections/new-arrivals",
    filter: { isNew: true },
  },
  {
    slug: "best-sellers",
    label: "Best Sellers",
    eyebrow: "Most loved",
    description:
      "Explore the pieces our customers return to time and again.",
    href: "/collections/best-sellers",
    filter: { isBestSeller: true },
  },
] as const;

const categoryCollections = [
  {
    slug: "festive",
    label: "Festive Edit",
    eyebrow: "For celebrations",
    description:
      "Luminous colours and graceful silhouettes for ceremonies and evenings worth dressing for.",
  },
  {
    slug: "ethnic",
    label: "Ethnic Wear",
    eyebrow: "Timeless",
    description:
      "Indian silhouettes, thoughtfully made and finished by hand.",
  },
  {
    slug: "contemporary",
    label: "Contemporary",
    eyebrow: "Modern",
    description:
      "Fresh, easy takes on Indian womenswear for everyday.",
  },
] as const;

function imageOf(product?: Product): string {
  return (product && getPrimaryProductMedia(product)?.src) || "";
}

async function summarise(params: {
  isNew?: boolean;
  isBestSeller?: boolean;
  categoryId?: string;
}): Promise<{ image: string; count: number | null }> {
  try {
    const response = await getProducts({
      page: 1,
      limit: 1,
      status: "active",
      sort: "featured",
      ...params,
    });

    return {
      image: imageOf(response.products[0]),
      count:
        response.pagination?.total ?? response.products.length,
    };
  } catch {
    return { image: "", count: null };
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function CollectionsPage() {
  let featured: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 12,
      isFeatured: true,
      status: "active",
      sort: "featured",
    });

    featured = response.products ?? [];
  } catch {
    featured = [];
  }

  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  const fallbackImage = imageOf(featured[0]);

  const collections: CollectionSummary[] = [];

  for (const item of fixedCollections) {
    const summary = await summarise(item.filter);

    collections.push({
      slug: item.slug,
      label: item.label,
      eyebrow: item.eyebrow,
      description: item.description,
      href: item.href,
      image: summary.image || fallbackImage,
      count: summary.count,
    });
  }

  for (const item of categoryCollections) {
    const category = categories.find(
      (entry) => entry.slug === item.slug && entry.isActive,
    );

    if (!category) {
      continue;
    }

    const summary = await summarise({ categoryId: category.id });

    collections.push({
      slug: item.slug,
      label: item.label,
      eyebrow: item.eyebrow,
      description: item.description,
      href: `/collections/${item.slug}`,
      image: category.image || summary.image || fallbackImage,
      count: summary.count,
    });
  }

  return (
    <CollectionsIndex
      collections={collections}
      featured={featured}
    />
  );
}
