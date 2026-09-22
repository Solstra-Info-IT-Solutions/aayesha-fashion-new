import type { Metadata } from "next";
import Link from "next/link";

import type { Product } from "@/types/product";

import { getProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/product/product-card";

import "./SearchPage.css";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search | Aayesha Fashion",
  description:
    "Explore Aayesha Fashion and discover contemporary Indian fashion, elegant silhouettes and pieces curated for the modern wardrobe.",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";

  let results: Product[] = [];

  if (query) {
    try {
      const response = await getProducts({
        page: 1,
        limit: 48,
        search: query,
        status: "active",
        sort: "relevance",
      });

      results = response.products;
    } catch {
      results = [];
    }
  }

  return (
    <main className="search-page">
      {/* =====================================================
          EDITORIAL SEARCH HERO
      ===================================================== */}

      <section className="search-page__hero">
        <div className="search-page__hero-inner">
          <div className="search-page__hero-main">
            <div className="search-page__eyebrow">
              <span className="search-page__eyebrow-line" />
              <span>Search Aayesha</span>
            </div>

            <h1 className="search-page__title">
              {query
                ? `Results for “${query}”`
                : "Find your next piece."}
            </h1>

            <p className="search-page__intro">
              {query
                ? "Explore pieces from the current Aayesha collection selected around your search."
                : "Discover contemporary Indian fashion, considered silhouettes and pieces designed for the modern wardrobe."}
            </p>
          </div>

          {query && (
            <div className="search-page__hero-note">
              <span className="search-page__hero-note-index">
                01
              </span>

              <div>
                <p className="search-page__hero-note-title">
                  Your search
                </p>

                <p className="search-page__hero-note-copy">
                  Curated around what you are
                  looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SEARCH CONTENT
      ===================================================== */}

      <section className="search-page__content">
        <div className="search-page__content-inner">
          {/* =================================================
              NO QUERY
          ================================================= */}

          {!query ? (
            <div className="search-page__empty search-page__empty--initial">
              <div className="search-page__empty-mark">
                <span>AA</span>
              </div>

              <p className="search-page__empty-eyebrow">
                Begin Exploring
              </p>

              <h2 className="search-page__empty-title">
                Discover something
                <br />
                made for you.
              </h2>

              <p className="search-page__empty-copy">
                Use the search field in the header
                to discover silhouettes, colours,
                collections and pieces from
                Aayesha Fashion.
              </p>

              <Link
                href="/shop"
                className="search-page__primary-button"
              >
                <span>Browse Collection</span>

                <span className="search-page__button-arrow">
                  →
                </span>
              </Link>
            </div>
          ) : results.length ? (
            /* ===============================================
               RESULTS
            =============================================== */

            <div className="search-page__results">
              <header className="search-page__results-header">
                <div className="search-page__results-heading">
                  <div className="search-page__results-eyebrow">
                    <span className="search-page__results-line" />
                    <span>Search Results</span>
                  </div>

                  <p className="search-page__results-count">
                    {results.length}{" "}
                    {results.length === 1
                      ? "piece"
                      : "pieces"}{" "}
                    found
                  </p>
                </div>

                <Link
                  href="/shop"
                  className="search-page__view-all"
                >
                  <span>View All Pieces</span>

                  <span className="search-page__view-all-arrow">
                    →
                  </span>
                </Link>
              </header>

              <div className="search-page__product-grid">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              <div className="search-page__results-footer">
                <p>
                  Explore more from the
                  Aayesha collection.
                </p>

                <Link
                  href="/shop"
                  className="search-page__footer-link"
                >
                  View Complete Collection
                  <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ===============================================
               NO RESULTS
            =============================================== */

            <div className="search-page__empty search-page__empty--no-results">
              <div className="search-page__empty-mark">
                <span>AA</span>
              </div>

              <p className="search-page__empty-eyebrow">
                Search Results
              </p>

              <h2 className="search-page__empty-title">
                Nothing found
                <br />
                for “{query}”
              </h2>

              <p className="search-page__empty-copy">
                We couldn't find a piece matching
                your search. Try a different
                keyword, explore a category or
                discover the latest additions to
                the collection.
              </p>

              <div className="search-page__empty-actions">
                <Link
                  href="/shop"
                  className="search-page__primary-button"
                >
                  <span>Explore Collection</span>

                  <span className="search-page__button-arrow">
                    →
                  </span>
                </Link>

                <Link
                  href="/collections/new-arrivals"
                  className="search-page__secondary-button"
                >
                  <span>New Arrivals</span>

                  <span>↗</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}