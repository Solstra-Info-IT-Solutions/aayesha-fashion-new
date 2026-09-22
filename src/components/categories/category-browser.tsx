"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

import "./CategoryBrowser.css";

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
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

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
        </div>
      </section>
    );
  }

  return (
    <main className="category-browser">
      {/* PAGE HEADER */}
      <section className="category-browser__header">
        <div className="category-browser__container">
          <div className="category-browser__header-content">
            <div className="category-browser__eyebrow-row">
              <span className="category-browser__eyebrow-line" />

              <span className="category-browser__eyebrow">
                Aayesha Fashion
              </span>
            </div>

            <div className="category-browser__title-row">
              <h1 className="category-browser__title">
                Categories
              </h1>

              <p className="category-browser__count">
                {categories.length}{" "}
                {categories.length === 1
                  ? "category"
                  : "categories"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}
      <section className="category-browser__navigation">
        <div className="category-browser__container">
          <nav
            className="category-browser__nav"
            aria-label="Product categories"
          >
            {categories.map((category) => {
              const isSelected =
                category.id === selectedCategoryId;

              return (
                <Link
                  key={category.id}
                  href={`/categories?category=${encodeURIComponent(
                    category.id,
                  )}`}
                  scroll={false}
                  className={`category-browser__nav-item ${
                    isSelected
                      ? "category-browser__nav-item--active"
                      : ""
                  }`}
                  aria-current={
                    isSelected ? "page" : undefined
                  }
                >
                  <span>{category.name}</span>

                  {isSelected && (
                    <span className="category-browser__nav-indicator" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* SELECTED CATEGORY */}
      <section className="category-browser__products">
        <div className="category-browser__container">
          <header className="category-browser__section-header">
            <div className="category-browser__section-heading">
              <p className="category-browser__eyebrow">
                Selected category
              </p>

              <h2 className="category-browser__section-title">
                {selectedCategory?.name ?? "Collection"}
              </h2>
            </div>

            {products.length > 0 && (
              <p className="category-browser__product-count">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}
              </p>
            )}
          </header>

          {/* PRODUCTS */}
          {products.length > 0 ? (
            <div className="category-browser__product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="category-browser__no-products">
              <div className="category-browser__no-products-inner">
                <p className="category-browser__no-products-eyebrow">
                  Coming soon
                </p>

                <h3 className="category-browser__no-products-title">
                  No products available
                </h3>

                <p className="category-browser__no-products-description">
                  New pieces for this category will be
                  added soon.
                </p>

                <Link
                  href="/shop"
                  className="category-browser__shop-link"
                >
                  <span>Shop all products</span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.35}
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}