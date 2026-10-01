"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

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

  /* Breadcrumb parent. Defaults to Collections; pass null for none. */
  parent?: { label: string; href: string } | null;

  /* Pre-fills the in-page search (for example from ?search=). */
  initialQuery?: string;
}

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

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
  parent = { label: "Collections", href: "/collections" },
  initialQuery = "",
}: CollectionLandingProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const activeFilters = ["category", "minPrice", "availability"].filter(
    (key) => searchParams.get(key),
  ).length;

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
    <div className="collection-landing">
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
                {parent ? (
                  <>
                    <Link href={parent.href}>{parent.label}</Link>
                    <span aria-hidden="true">/</span>
                  </>
                ) : null}
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
          <div className="collection-landing__toolbar-row">
            <PageSearch
              value={query}
              onChange={setQuery}
              label={`Search within ${title}`}
              placeholder={`Search ${title}…`}
              status={status}
            />

            <label className="collection-landing__sort">
              <span className="collection-landing__sort-label">
                Sort
              </span>

              <select
                value={sort}
                onChange={(event) => handleSort(event.target.value)}
                aria-label="Sort pieces"
                className="collection-landing__sort-select"
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
              className="collection-landing__filters-button"
            >
              <SlidersHorizontal
                size={17}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              Filters
              {activeFilters > 0 && (
                <span className="collection-landing__filters-badge">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
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
          FILTERS — BOTTOM SHEET (phones and tablets)
      ===================================================== */}

      {filtersOpen && (
        <div
          className="collection-landing__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="collection-landing__sheet-backdrop"
          />

          <div className="collection-landing__sheet-panel">
            <header className="collection-landing__sheet-header">
              <h2>Filters</h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="collection-landing__sheet-close"
              >
                <X size={20} strokeWidth={1.6} />
              </button>
            </header>

            <div className="collection-landing__sheet-body">
              <ShopFilters
                products={products}
                selectedCategory={categoryId}
                mobile
                onClose={() => setFiltersOpen(false)}
              />
            </div>

            <footer className="collection-landing__sheet-footer">
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
    </div>
  );
}
