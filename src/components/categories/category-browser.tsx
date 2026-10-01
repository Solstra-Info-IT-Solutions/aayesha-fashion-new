"use client";

import { ProductInsightsProvider } from "@/components/listing-sales/insights-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import type { Category } from "@/types/category";
import {
  getInventoryStatus,
  type Product,
} from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import {
  PageSearch,
  matchesQuery,
} from "@/components/common/page-search";

import "./CategoryBrowser.css";
import "@/components/shop/ShopFilters.css";
import "@/components/home/HomeCta.css";

interface CategoryBrowserProps {
  categories: Category[];
  selectedCategoryId?: string;
  products: Product[];
}

const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹8,000", min: 5000, max: 8000 },
  { label: "₹8,000 – ₹12,000", min: 8000, max: 12000 },
  { label: "Above ₹12,000", min: 12000, max: Infinity },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export function CategoryBrowser({
  categories,
  selectedCategoryId,
  products,
}: CategoryBrowserProps) {
  const [query, setQuery] = useState("");

  /* Piece filters for the selected category */
  const [sort, setSort] = useState<SortValue>("featured");
  const [priceIndex, setPriceIndex] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilters =
    (priceIndex !== null ? 1 : 0) + (inStockOnly ? 1 : 0);

  /* Bottom sheet: lock page scroll and close on Escape. */
  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  const trimmed = query.trim();

  const visibleCategories = categories.filter((category) =>
    matchesQuery(
      trimmed,
      category.name,
      category.slug,
      category.description,
    ),
  );

  const range = priceIndex !== null ? priceRanges[priceIndex] : null;

  const visibleProducts = products
    .filter((product) => matchesQuery(trimmed, product.name))
    .filter((product) => {
      const price = product.pricing.sellingPrice;

      if (range && (price < range.min || price >= range.max)) {
        return false;
      }

      if (inStockOnly && getInventoryStatus(product) === "out-of-stock") {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.pricing.sellingPrice - b.pricing.sellingPrice;
        case "price-high":
          return b.pricing.sellingPrice - a.pricing.sellingPrice;
        case "newest":
          return (
            Date.parse(b.createdAt ?? "") -
              Date.parse(a.createdAt ?? "") || 0
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const status = trimmed
    ? `${visibleCategories.length} of ${categories.length} ${
        categories.length === 1 ? "category" : "categories"
      } · ${visibleProducts.length} of ${products.length} ${
        products.length === 1 ? "piece" : "pieces"
      } in ${selectedCategory?.name ?? "this category"}`
    : undefined;

  /* =========================================================
     EMPTY CATEGORIES
  ========================================================= */

  if (categories.length === 0) {
    return (
      <section className="category-browser category-browser--empty">
        <div className="category-browser__empty">
          <p className="category-browser__eyebrow">
            Aayesha Fashion
          </p>

          <h1 className="category-browser__empty-title">
            Categories
          </h1>

          <p className="category-browser__empty-description">
            Categories are currently unavailable.
          </p>

          <Link href="/shop" className="home-cta">
            Shop all pieces
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="category-browser">
      {/* =====================================================
          HERO + SEARCH
      ===================================================== */}

      <section className="category-browser__hero">
        <div className="category-browser__container">
          <div className="category-browser__eyebrow-row">
            <span
              className="category-browser__eyebrow-line"
              aria-hidden="true"
            />

            <span className="category-browser__eyebrow">
              Aayesha Fashion
            </span>
          </div>

          <div className="category-browser__title-row">
            <h1 className="category-browser__title">
              Shop by <em>category.</em>
            </h1>

            <p className="category-browser__count">
              {categories.length}{" "}
              {categories.length === 1
                ? "category"
                : "categories"}
            </p>
          </div>

          <p className="category-browser__lead">
            Every silhouette in one place. Pick a category,
            or search by name.
          </p>

          <PageSearch
            value={query}
            onChange={setQuery}
            label="Search categories and pieces"
            placeholder="Search categories or pieces…"
            status={status}
          />
        </div>
      </section>

      {/* =====================================================
          CATEGORY TILES
      ===================================================== */}

      <section
        className="category-browser__atlas"
        aria-labelledby="category-browser-atlas-title"
      >
        <div className="category-browser__container">
          <header className="category-browser__section-header">
            <h2
              id="category-browser-atlas-title"
              className="category-browser__section-label"
            >
              Categories
            </h2>
          </header>

          {visibleCategories.length > 0 ? (
            <ul className="category-browser__tiles">
              {visibleCategories.map((category) => {
                const isSelected =
                  category.id === selectedCategoryId;

                return (
                  <li key={category.id}>
                    <Link
                      href={`/categories?category=${encodeURIComponent(
                        category.id,
                      )}`}
                      scroll={false}
                      aria-current={
                        isSelected ? "page" : undefined
                      }
                      className={[
                        "category-browser__tile",
                        isSelected
                          ? "category-browser__tile--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="category-browser__tile-media">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt=""
                            fill
                            sizes="(max-width: 639px) 40vw, (max-width: 1023px) 25vw, 16vw"
                            className="category-browser__tile-image"
                          />
                        ) : (
                          <Sparkles
                            size={22}
                            strokeWidth={1}
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      <span className="category-browser__tile-name">
                        {category.name}
                      </span>

                      <span
                        className="category-browser__tile-mark"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="category-browser__muted">
              No category matches “{trimmed}”.
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          SELECTED CATEGORY PRODUCTS
      ===================================================== */}

      <section
        className="category-browser__products"
        aria-labelledby="category-browser-products-title"
      >
        <div className="category-browser__container">
          <header className="category-browser__products-header">
            <div>
              <p className="category-browser__eyebrow">
                Now viewing
              </p>

              <h2
                id="category-browser-products-title"
                className="category-browser__products-title"
              >
                {selectedCategory?.name ?? "Collection"}
              </h2>

              {selectedCategory?.description ? (
                <p className="category-browser__products-description">
                  {selectedCategory.description}
                </p>
              ) : null}
            </div>

            {products.length > 0 && (
              <p className="category-browser__product-count">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1
                  ? "piece"
                  : "pieces"}
              </p>
            )}
          </header>

          {products.length > 0 && (
            <div className="category-browser__toolbar">
              <label className="category-browser__sort">
                <span>Sort</span>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as SortValue)
                  }
                  aria-label="Sort pieces"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-haspopup="dialog"
                className="category-browser__filters-button"
              >
                <SlidersHorizontal
                  size={17}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                Filters
                {activeFilters > 0 && (
                  <span className="category-browser__filters-badge">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          )}

          {visibleProducts.length > 0 ? (
            <ProductInsightsProvider
              productIds={visibleProducts.map((product) => product._id)}
            >
              <div className="category-browser__product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </ProductInsightsProvider>
          ) : products.length > 0 ? (
            <div className="category-browser__no-products">
              <p className="category-browser__no-products-eyebrow">
                No matches
              </p>

              <h3 className="category-browser__no-products-title">
                Nothing in {selectedCategory?.name ?? "this category"}{" "}
                matches “{trimmed}”
              </h3>

              <div className="category-browser__actions">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="home-cta"
                >
                  Clear search
                </button>

                <Link
                  href={`/search?q=${encodeURIComponent(
                    trimmed,
                  )}`}
                  className="category-browser__text-link"
                >
                  Search the whole site
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="category-browser__no-products">
              <p className="category-browser__no-products-eyebrow">
                Coming soon
              </p>

              <h3 className="category-browser__no-products-title">
                No products available yet
              </h3>

              <p className="category-browser__muted">
                New pieces for this category will be added
                soon.
              </p>

              <div className="category-browser__actions">
                <Link href="/shop" className="home-cta">
                  Shop all pieces
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FILTERS SHEET
      ===================================================== */}

      {filtersOpen && (
        <div
          className="category-browser__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="category-browser__sheet-backdrop"
          />

          <div className="category-browser__sheet-panel">
            <header className="category-browser__sheet-header">
              <h2>Filters</h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="category-browser__sheet-close"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </header>

            <div className="category-browser__sheet-body">
              <section>
                <h3 className="category-browser__sheet-label">Price</h3>

                <div className="shop-filters__chips">
                  {priceRanges.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      aria-pressed={priceIndex === index}
                      onClick={() =>
                        setPriceIndex(priceIndex === index ? null : index)
                      }
                      className={[
                        "shop-filters__chip",
                        priceIndex === index
                          ? "shop-filters__chip--selected"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="category-browser__sheet-label">
                  Availability
                </h3>

                <div className="shop-filters__chips">
                  <button
                    type="button"
                    aria-pressed={!inStockOnly}
                    onClick={() => setInStockOnly(false)}
                    className={[
                      "shop-filters__chip",
                      !inStockOnly ? "shop-filters__chip--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    aria-pressed={inStockOnly}
                    onClick={() => setInStockOnly(true)}
                    className={[
                      "shop-filters__chip",
                      inStockOnly ? "shop-filters__chip--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    In stock
                  </button>
                </div>
              </section>
            </div>

            <footer className="category-browser__sheet-footer">
              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPriceIndex(null);
                    setInStockOnly(false);
                  }}
                  className="category-browser__sheet-clear"
                >
                  Clear all
                </button>
              )}

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="home-cta"
              >
                Show {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "piece" : "pieces"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
