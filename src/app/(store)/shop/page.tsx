import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

import "./ShopPage.css";

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

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

export const metadata: Metadata = {
  title: "Shop Women's Fashion | Aayesha Fashion",

  description:
    "Explore Aayesha Fashion's curated collection of elegant Indian fashion, contemporary silhouettes, festive wear, and timeless everyday styles.",

  alternates: {
    canonical: "/shop",
  },

  openGraph: {
    title:
      "Shop Women's Fashion | Aayesha Fashion",

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

  const categoryId =
    params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(
      params.sort as ProductSort,
    )
      ? (params.sort as ProductSort)
      : "relevance";

  const minPrice = parseNumber(
    params.minPrice,
  );

  const maxPrice = parseNumber(
    params.maxPrice,
  );

  const inStockOnly =
    params.availability ===
    "in-stock"
      ? true
      : undefined;

  const response =
    await getProducts({
      page: 1,
      limit: 48,
      categoryId,
      minPrice,
      maxPrice,
      inStockOnly,
      search: params.search,
      sort,
    });

  return (
    <main className="shop-page">
      {/* =====================================================
          SHOP HEADER
      ===================================================== */}

      <section className="shop-page__header">
        <div className="shop-page__container">
          <ShopHeader
            products={response.products}
            selectedSort={sort}
          />
        </div>
      </section>

      {/* =====================================================
          PRODUCT COLLECTION
      ===================================================== */}

      <section className="shop-page__collection">
        <div className="shop-page__container">
          <div className="shop-page__collection-frame">
            <ShopProductGrid
              products={response.products}
              category={categoryId}
              sort={sort}
            />
          </div>
        </div>
      </section>
    </main>
  );
}