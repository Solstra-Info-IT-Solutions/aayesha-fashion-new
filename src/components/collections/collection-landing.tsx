"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Product, ProductSort } from "@/types/product";

import {
  PageSearch,
  matchesQuery,
} from "@/components/common/page-search";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

import "./CollectionLanding.css";
import "@/components/home/HomeCta.css";

export interface CollectionSwitchItem {
  slug: string;
  label: string;
  href: string;
}

interface CollectionLandingProps {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  mood?: string;

  heroImage: string;

  collections: CollectionSwitchItem[];

  products: Product[];
  sort: ProductSort;
  categoryId?: string;
}

export function CollectionLanding({
  slug,
  title,
  eyebrow,
  description,
  mood,
  heroImage,
  collections,
  products,
  sort,
  categoryId,
}: CollectionLandingProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim();

  const visibleProducts = products.filter((product) =>
    matchesQuery(trimmed, product.name),
  );

  const status = trimmed
    ? `${visibleProducts.length} of ${products.length} ${
        products.length === 1 ? "piece" : "pieces"
      } in ${title}`
    : undefined;

  const others = collections.filter((item) => item.slug !== slug);

  return (
    <main className="collection-landing">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="collection-landing__hero">
        <div className="collection-landing__container">
          <div className="collection-landing__hero-grid">
            <div className="collection-landing__intro">
              <nav
                aria-label="Breadcrumb"
                className="collection-landing__crumbs"
              >
                <Link href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link href="/collections">Collections</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{title}</span>
              </nav>

              <div className="collection-landing__eyebrow">
                <span aria-hidden="true" />
                {eyebrow}
              </div>

              <h1 className="collection-landing__title">
                {title}
              </h1>

              <p className="collection-landing__description">
                {description}
              </p>

              {mood ? (
                <p className="collection-landing__mood">{mood}</p>
              ) : null}

              <p className="collection-landing__count">
                {products.length}{" "}
                {products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            {heroImage ? (
              <div className="collection-landing__media">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 899px) 100vw, 44vw"
                  className="collection-landing__media-image"
                />
              </div>
            ) : null}
          </div>

          {/* Collection switcher */}

          {collections.length > 1 && (
            <nav
              aria-label="Collections"
              className="collection-landing__switcher"
            >
              {collections.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  aria-current={
                    item.slug === slug ? "page" : undefined
                  }
                  className="collection-landing__pill"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section
        className="collection-landing__toolbar"
        aria-label={`Search ${title}`}
      >
        <div className="collection-landing__container">
          <PageSearch
            value={query}
            onChange={setQuery}
            label={`Search within ${title}`}
            placeholder={`Search ${title}…`}
            status={status}
          />
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="collection-landing__products">
        <div className="collection-landing__container">
          <div className="collection-landing__layout">
            <aside
              className="collection-landing__filters"
              aria-label="Filters"
            >
              <div className="collection-landing__filters-card">
                <ShopFilters
                  products={products}
                  selectedCategory={categoryId}
                />
              </div>
            </aside>

            <div className="collection-landing__grid">
              {visibleProducts.length > 0 ? (
                <ShopProductGrid
                  products={visibleProducts}
                  category={categoryId}
                  sort={sort}
                />
              ) : (
                <div className="collection-landing__empty">
                  <p className="collection-landing__empty-eyebrow">
                    {products.length > 0
                      ? "No matches"
                      : "Coming soon"}
                  </p>

                  <h2>
                    {products.length > 0
                      ? `Nothing in ${title} matches “${trimmed}”`
                      : `New pieces for ${title} are on their way`}
                  </h2>

                  <div className="collection-landing__empty-actions">
                    {products.length > 0 ? (
                      <>
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
                          className="collection-landing__text-link"
                        >
                          Search the whole site
                        </Link>
                      </>
                    ) : (
                      <Link href="/shop" className="home-cta">
                        Shop all pieces
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTINUE EXPLORING
      ===================================================== */}

      <section className="collection-landing__continue">
        <div className="collection-landing__container">
          <p className="collection-landing__continue-eyebrow">
            Continue exploring
          </p>

          <h2 className="collection-landing__continue-title">
            Discover more from Aayesha Fashion.
          </h2>

          <div className="collection-landing__continue-actions">
            {others.slice(0, 2).map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="home-cta home-cta--light"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/collections"
              className="collection-landing__continue-link"
            >
              All collections
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
