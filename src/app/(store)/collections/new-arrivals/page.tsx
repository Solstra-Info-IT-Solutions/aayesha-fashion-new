import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import type { ProductSort } from "@/types/product";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";
import "./NewArrivalsPage.css";

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

  const categoryId = params.category || undefined;

  const sort =
    params.sort &&
    validSorts.includes(params.sort as ProductSort)
      ? (params.sort as ProductSort)
      : "newest";

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);

  const inStockOnly =
    params.availability === "in-stock"
      ? true
      : undefined;

  const response = await getProducts({
    page: 1,
    limit: 48,
    isNew: true,
    categoryId,
    minPrice,
    maxPrice,
    inStockOnly,
    search: params.search,
    sort,
  });

  return (
  <main className="new-arrivals-page">
    {/* =====================================================
        HEADER + TOOLBAR
    ===================================================== */}

    <section className="new-arrivals-page__hero">
      <div className="new-arrivals-page__container">
        <div className="new-arrivals-page__heading">
          <div className="new-arrivals-page__eyebrow-row">
            <span className="new-arrivals-page__eyebrow-line" />

            <span className="new-arrivals-page__eyebrow">
              Collection
            </span>
          </div>

          <h1 className="new-arrivals-page__title">
            New Arrivals
          </h1>
        </div>
      </div>
    </section>

    {/* =====================================================
        PRODUCT CONTENT
    ===================================================== */}

    <section className="new-arrivals-page__content">
      <div className="new-arrivals-page__container new-arrivals-page__content-container">
        <div className="new-arrivals-page__layout">

          {/* =================================================
              FILTERS
          ================================================= */}

          <aside className="new-arrivals-page__filters">
            <div className="new-arrivals-page__filters-sticky">
              <div className="new-arrivals-page__filters-card">

                <div className="new-arrivals-page__filters-header">
                  <span className="new-arrivals-page__filters-title">
                    Filters
                  </span>

                  <span className="new-arrivals-page__filters-label">
                    Refine
                  </span>
                </div>

                <div className="new-arrivals-page__filters-body">
                  <ShopFilters
                    products={response.products}
                    selectedCategory={categoryId}
                  />
                </div>

              </div>
            </div>
          </aside>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="new-arrivals-page__products">
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