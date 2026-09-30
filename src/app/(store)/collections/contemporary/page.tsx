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

type ContemporaryPageProps = {
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
  title: "Contemporary Collection",
  description:
    "Explore contemporary women's fashion by Aayesha Fashion, designed with clean silhouettes, modern details, and effortless elegance.",
  alternates: {
    canonical: "/collections/contemporary",
  },
};

export default async function ContemporaryPage({
  searchParams,
}: ContemporaryPageProps) {
  const params = await searchParams;

  const definition = getCollectionDefinition("contemporary");

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "featured";

  let category: Category;

  try {
    category = await getCategoryBySlug("contemporary");
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
        description="Modern Indian dressing distilled into clean silhouettes, easy layers and elevated essentials designed to move naturally through everyday life."
        mood="Clean lines. Soft structure. Everyday sophistication."
        heroImage={category.image || heroImageOf(response.products)}
        collections={collections}
        products={response.products}
        sort={sort}
        categoryId={category.id}
      />
    </>
  );
}
