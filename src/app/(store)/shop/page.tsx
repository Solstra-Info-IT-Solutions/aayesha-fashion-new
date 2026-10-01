import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import {
  getAvailableCollections,
  heroImageOf,
} from "@/lib/collections";
import type { ProductSort } from "@/types/product";

import { CollectionLanding } from "@/components/collections/collection-landing";

type ShopPageProps = {
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
  title: "Shop Women's Fashion",

  description:
    "Explore Aayesha Fashion's curated collection of elegant Indian fashion, contemporary silhouettes, festive wear, and timeless everyday styles.",

  alternates: {
    canonical: "/shop",
  },

  openGraph: {
    title: "Shop Women's Fashion | Aayesha Fashion",

    description:
      "Explore elegant Indian fashion, festive silhouettes, and contemporary styles from Aayesha Fashion.",

    url: "/shop",

    type: "website",
  },
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "relevance";

  const response = await getProducts({
    page: 1,
    limit: 48,
    categoryId,
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    inStockOnly:
      params.availability === "in-stock" ? true : undefined,
    search: params.search,
    sort,
  });

  const collections = [
    { slug: "shop", label: "All pieces", href: "/shop" },
    ...(await getAvailableCollections()).map((item) => ({
      slug: item.slug,
      label: item.label,
      href: item.href,
    })),
  ];

  return (
    <CollectionLanding
      slug="shop"
      title="Shop"
      eyebrow="The full collection"
      description="Every piece from Aayesha Fashion in one place. Search by name, narrow by price or availability, or start from a collection."
      heroImage={heroImageOf(response.products)}
      collections={collections}
      products={response.products}
      sort={sort}
      categoryId={categoryId}
      parent={null}
      initialQuery={params.search ?? ""}
    />
  );
}
