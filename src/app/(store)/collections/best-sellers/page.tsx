import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

import "./BestSellersPage.css";

type BestSellersPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
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
    title: "Best Sellers | Aayesha Fashion",
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

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "best-selling";

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock"
      ? true
      : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,
    isBestSeller: true,
    categoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    search: params.search,
    sort,
  });

  return (
    <main className="best-sellers-page">
      {/* PAGE HEADER */}

      <section className="best-sellers-page__header">
        <div className="best-sellers-page__container">
          <div className="best-sellers-page__heading">
            <div className="best-sellers-page__eyebrow-row">
              <span className="best-sellers-page__eyebrow-line" />

              <span className="best-sellers-page__eyebrow">
                Collection
              </span>
            </div>

            <h1 className="best-sellers-page__title">
              Best Sellers
            </h1>
          </div>
        </div>
      </section>

      {/* PRODUCT CONTENT */}

      <section className="best-sellers-page__content">
        <div className="best-sellers-page__container">
          <div className="best-sellers-page__layout">
            {/* FILTERS */}

            <aside className="best-sellers-page__filters">
              <div className="best-sellers-page__filters-sticky">
                <div className="best-sellers-page__filters-card">
                  <div className="best-sellers-page__filters-header">
                    <span className="best-sellers-page__filters-title">
                      Filters
                    </span>

                    <span className="best-sellers-page__filters-label">
                      Refine
                    </span>
                  </div>

                  <div className="best-sellers-page__filters-body">
                    <ShopFilters
                      products={response.products}
                      selectedCategory={categoryId}
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* PRODUCTS */}

            <div className="best-sellers-page__products">
              <ShopProductGrid
                products={response.products}
                category={categoryId}
                sort={sort}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}