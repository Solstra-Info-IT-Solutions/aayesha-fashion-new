import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/services/category.service";
import {
  getPrimaryProductMedia,
  type Product,
} from "@/types/product";
import type { Category } from "@/types/category";
import { collectionDefinitions } from "@/lib/collections";

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

  for (const item of collectionDefinitions) {
    let summary: { image: string; count: number | null };
    let image = "";

    if (item.kind === "flag") {
      summary = await summarise(
        item.slug === "new-arrivals"
          ? { isNew: true }
          : { isBestSeller: true },
      );
    } else {
      const category = categories.find(
        (entry) => entry.slug === item.slug && entry.isActive,
      );

      if (!category) {
        continue;
      }

      summary = await summarise({ categoryId: category.id });
      image = category.image;
    }

    collections.push({
      slug: item.slug,
      label: item.label,
      eyebrow: item.eyebrow,
      description: item.description,
      href: item.href,
      image: image || summary.image || fallbackImage,
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
