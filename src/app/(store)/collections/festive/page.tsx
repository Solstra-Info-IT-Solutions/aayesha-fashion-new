import { ApiError } from "@/lib/api";
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

type FestivePageProps = {
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
  title: "Festive Collection",
  description:
    "Explore elegant festive fashion from Aayesha Fashion, crafted for celebrations, special occasions, and memorable evenings.",
  alternates: {
    canonical: "/collections/festive",
  },
};

export default async function FestivePage({
  searchParams,
}: FestivePageProps) {
  const params = await searchParams;

  const definition = getCollectionDefinition("festive");

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "featured";

  let category: Category;

  try {
    category = await getCategoryBySlug("festive");
  } catch (error) {
    // Only a genuinely missing category is a 404. An unreachable API must not look like a
    // deleted page (search engines would drop it): let the error page handle it.
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
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
        description="Occasion dressing with a quieter confidence — luminous colours, graceful silhouettes and considered details designed for celebrations, intimate gatherings and unforgettable evenings."
        mood="For celebrations, ceremonies and everything worth dressing for."
        heroImage={category.image || heroImageOf(response.products)}
        collections={collections}
        products={response.products}
        sort={sort}
        categoryId={category.id}
      />
    </>
  );
}
