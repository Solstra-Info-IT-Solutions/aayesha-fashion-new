import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryBySlug } from "@/services/category.service";
import { getProducts } from "@/lib/api/products";
import {
  getAvailableCollections,
  getCollectionDefinition,
  heroImageOf,
} from "@/lib/collections";

import type { ProductSort } from "@/types/product";
import type { Category } from "@/types/category";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { CollectionLanding } from "@/components/collections/collection-landing";

type EthnicPageProps = {
  searchParams: Promise<{
    sort?: string;
  }>;
};

const validSorts: ProductSort[] = [
  "relevance",
  "newest",
  "price-low",
  "price-high",
  "rating",
  "best-selling",
  "featured",
];

export const metadata: Metadata = {
  title: "Ethnic Collection",
  description:
    "Discover refined ethnic wear by Aayesha Fashion, blending Indian craftsmanship, graceful silhouettes, and modern styling.",
  alternates: {
    canonical: "/collections/ethnic",
  },
};

export default async function EthnicPage({
  searchParams,
}: EthnicPageProps) {
  const params = await searchParams;

  const definition = getCollectionDefinition("ethnic");

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "featured";

  let category: Category;

  try {
    category = await getCategoryBySlug("ethnic");
  } catch {
    notFound();
  }

  const response = await getProducts({
    page: 1,
    limit: 48,
    categoryId: category.id,
    sort,
  });

  const collections = await getAvailableCollections();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Collections", url: "/collections" },
          {
            name: definition.label,
            url: definition.href,
          },
        ]}
      />

      <CollectionLanding
        slug={definition.slug}
        title={definition.label}
        eyebrow={definition.eyebrow}
        description="A refined interpretation of Indian wardrobe classics, balancing familiar craftsmanship and modern ease for pieces that feel rooted, graceful and beautifully wearable."
        mood="Heritage-inspired. Modern in spirit."
        heroImage={category.image || heroImageOf(response.products)}
        collections={collections}
        products={response.products}
        sort={sort}
        categoryId={category.id}
      />
    </>
  );
}
