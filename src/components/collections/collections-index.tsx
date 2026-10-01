"use client";

import { ProductInsightsProvider } from "@/components/listing-sales/insights-context";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";
import {
  PageSearch,
  matchesQuery,
} from "@/components/common/page-search";

import "./CollectionsIndex.css";
import "@/components/home/HomeCta.css";

export interface CollectionSummary {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  href: string;
  image: string;
  count: number | null;
}

interface CollectionsIndexProps {
  collections: CollectionSummary[];
  featured: Product[];
}

export function CollectionsIndex({
  collections,
  featured,
}: CollectionsIndexProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim();

  const visibleCollections = collections.filter((collection) =>
    matchesQuery(
      trimmed,
      collection.label,
      collection.eyebrow,
      collection.description,
    ),
  );

  const visibleFeatured = featured.filter((product) =>
    matchesQuery(trimmed, product.name),
  );

  const status = trimmed
    ? `${visibleCollections.length} of ${collections.length} collections · ${visibleFeatured.length} of ${featured.length} featured pieces`
    : undefined;

  const nothing =
    trimmed &&
    visibleCollections.length === 0 &&
    visibleFeatured.length === 0;

  return (
    <div className="collections-index">
      {/* =====================================================
          HERO + SEARCH
      ===================================================== */}

      <section className="collections-index__hero">
        <div className="collections-index__container">
          <div className="collections-index__eyebrow-row">
            <span
              className="collections-index__eyebrow-line"
              aria-hidden="true"
            />

            <span className="collections-index__eyebrow">
              Aayesha Fashion
            </span>
          </div>

          <h1 className="collections-index__title">
            The <em>collections.</em>
          </h1>

          <p className="collections-index__lead">
            Curated edits for every mood and occasion. Start
            with a collection, or search by name.
          </p>

          <PageSearch
            value={query}
            onChange={setQuery}
            label="Search collections and featured pieces"
            placeholder="Search collections or pieces…"
            status={status}
          />
        </div>
      </section>

      {/* =====================================================
          COLLECTION CARDS
      ===================================================== */}

      {visibleCollections.length > 0 && (
        <section
          className="collections-index__section"
          aria-labelledby="collections-index-list-title"
        >
          <div className="collections-index__container">
            <header className="collections-index__section-header">
              <h2
                id="collections-index-list-title"
                className="collections-index__section-label"
              >
                Shop by collection
              </h2>

              <span className="collections-index__section-count">
                {String(visibleCollections.length).padStart(2, "0")}{" "}
                {visibleCollections.length === 1
                  ? "collection"
                  : "collections"}
              </span>
            </header>

            <ul
              className={[
                "collections-index__grid",
                visibleCollections.length >= 3
                  ? "collections-index__grid--feature"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {visibleCollections.map((collection, index) => (
                <li key={collection.slug}>
                  <Link
                    href={collection.href}
                    className="collections-index__card"
                  >
                    {collection.image ? (
                      <Image
                        src={collection.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                        className="collections-index__card-image"
                        priority={index === 0}
                      />
                    ) : null}

                    <span
                      className="collections-index__card-shade"
                      aria-hidden="true"
                    />

                    <span className="collections-index__card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="collections-index__card-body">
                      <span className="collections-index__card-eyebrow">
                        {collection.eyebrow}
                        {collection.count !== null
                          ? ` · ${collection.count} ${
                              collection.count === 1
                                ? "piece"
                                : "pieces"
                            }`
                          : ""}
                      </span>

                      <span className="collections-index__card-title">
                        {collection.label}
                      </span>

                      <span className="collections-index__card-description">
                        {collection.description}
                      </span>

                      <span className="collections-index__card-link">
                        Explore
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.6}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* =====================================================
          FEATURED PIECES
      ===================================================== */}

      {visibleFeatured.length > 0 && (
        <section
          className="collections-index__section collections-index__section--featured"
          aria-labelledby="collections-index-featured-title"
        >
          <div className="collections-index__container">
            <header className="collections-index__section-header">
              <h2
                id="collections-index-featured-title"
                className="collections-index__section-label"
              >
                Featured pieces
              </h2>

              <Link
                href="/shop"
                className="collections-index__text-link"
              >
                View all
              </Link>
            </header>

            <ProductInsightsProvider
              productIds={visibleFeatured.map((product) => product._id)}
            >
              <div className="collections-index__products">
                {visibleFeatured.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </ProductInsightsProvider>
          </div>
        </section>
      )}

      {/* =====================================================
          NOTHING FOUND
      ===================================================== */}

      {nothing && (
        <section className="collections-index__section">
          <div className="collections-index__container collections-index__none">
            <p className="collections-index__eyebrow">
              No matches
            </p>

            <h2>Nothing here matches “{trimmed}”</h2>

            <div className="collections-index__actions">
              <button
                type="button"
                onClick={() => setQuery("")}
                className="home-cta"
              >
                Clear search
              </button>

              <Link
                href={`/search?q=${encodeURIComponent(trimmed)}`}
                className="collections-index__text-link"
              >
                Search the whole site
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="collections-index__closing">
        <div className="collections-index__container">
          <p className="collections-index__closing-eyebrow">
            Aayesha Fashion
          </p>

          <h2 className="collections-index__closing-title">
            Style that feels distinctly yours.
          </h2>

          <Link
            href="/shop"
            className="home-cta home-cta--light"
          >
            Shop all pieces
          </Link>
        </div>
      </section>
    </div>
  );
}
