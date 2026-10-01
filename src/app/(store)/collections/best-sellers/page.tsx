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

type BestSellersPageProps = {
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
  title: "Best Sellers",
  description:
    "Shop Aayesha Fashion's best-selling Indian and contemporary styles, loved for their elegant silhouettes and timeless appeal.",
  alternates: {
    canonical: "/collections/best-sellers",
  },
  openGraph: {
    title: "Best Sellers",
    description:
      "Discover the pieces our customers love most.",
    url: "/collections/best-sellers",
    type: "website",
  },
};

export default async function BestSellersPage({
  searchParams,
}: BestSellersPageProps) {
  const params = await searchParams;

  const definition = getCollectionDefinition("best-sellers");

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "best-selling";

  const response = await getProducts({
    page: 1,
    limit: 48,
    isBestSeller: true,
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
        mood="The pieces that sell out first."
        heroImage={heroImageOf(response.products)}
        collections={collections}
        products={response.products}
        sort={sort}
        categoryId={categoryId}
      />
    </>
  );
}
