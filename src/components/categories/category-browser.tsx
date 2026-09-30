"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import {
  PageSearch,
  matchesQuery,
} from "@/components/common/page-search";

import "./CategoryBrowser.css";
import "@/components/home/HomeCta.css";

interface CategoryBrowserProps {
  categories: Category[];
  selectedCategoryId?: string;
  products: Product[];
}

export function CategoryBrowser({
  categories,
  selectedCategoryId,
  products,
}: CategoryBrowserProps) {
  const [query, setQuery] = useState("");

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

  const visibleProducts = products.filter((product) =>
    matchesQuery(trimmed, product.name),
  );

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

          {visibleProducts.length > 0 ? (
            <div className="category-browser__product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
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
    </main>
  );
}
