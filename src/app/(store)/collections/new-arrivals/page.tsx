import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import {
  getAvailableCollections,
  getCollectionDefinition,
  heroImageOf,
} from "@/lib/collections";
import type { ProductSort } from "@/types/product";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { CollectionLanding } from "@/components/collections/collection-landing";

type NewArrivalsPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
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

function parseNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Discover the latest arrivals from Aayesha Fashion — refined Indian silhouettes, contemporary styles, and fresh seasonal edits.",
  alternates: {
    canonical: "/collections/new-arrivals",
  },
  openGraph: {
    title: "New Arrivals | Aayesha Fashion",
    description:
      "Discover the latest fashion arrivals designed for effortless elegance.",
    url: "/collections/new-arrivals",
    type: "website",
  },
};

export default async function NewArrivalsPage({
  searchParams,
}: NewArrivalsPageProps) {
  const params = await searchParams;

  const definition = getCollectionDefinition("new-arrivals");

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "newest";

  const response = await getProducts({
    page: 1,
    limit: 48,
    isNew: true,
    categoryId,
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    inStockOnly:
      params.availability === "in-stock" ? true : undefined,
    search: params.search,
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
        description={definition.description}
        mood="Fresh silhouettes, added every season."
        heroImage={heroImageOf(response.products)}
        collections={collections}
        products={response.products}
        sort={sort}
        categoryId={categoryId}
      />
    </>
  );
}
