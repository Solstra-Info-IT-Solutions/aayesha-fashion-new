import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopProductGrid } from "@/components/shop/shop-product-grid";

/* =========================================================
   TYPES
========================================================= */

type CollectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  categoryId?: string;
  products: Product[];
  sort: ProductSort;
  mood?: string;
};

/* =========================================================
   COLLECTION LINKS
========================================================= */

const collectionLinks = [
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
] as const;

/* =========================================================
   COMPONENT
========================================================= */

export function CollectionPage({
  title,
  eyebrow,
  description,
  categoryId,
  products,
  sort,
  mood,
}: CollectionPageProps) {
  const currentSlug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <>
      {/* =====================================================
          BREADCRUMB JSON-LD
      ===================================================== */}

      <BreadcrumbJsonLd
        items={[
          {
            name: "Home",
            url: "/",
          },
          {
            name: "Collections",
            url: "/collections",
          },
          {
            name: title,
            url: `/collections/${currentSlug}`,
          },
        ]}
      />

      <main className="collection-page">
        {/* =====================================================
            COLLECTION HERO
        ===================================================== */}

        <section className="collection-page__hero">
          <div className="collection-page__container">
            <div className="collection-page__hero-inner">
              {/* HERO COPY */}

              <div className="collection-page__intro">
                <div className="collection-page__eyebrow">
                  <span className="collection-page__eyebrow-line" />

                  <span className="eyebrow">
                    {eyebrow}
                  </span>
                </div>

                <h1 className="collection-page__title">
                  {title}
                </h1>

                <p className="collection-page__description">
                  {description}
                </p>

                {mood && (
                  <p className="collection-page__mood">
                    {mood}
                  </p>
                )}
              </div>

              {/* COLLECTION NAVIGATION */}

              <div className="collection-page__navigation">
                <p className="collection-page__navigation-label">
                  Explore collections
                </p>

                <div className="collection-page__links">
                  {collectionLinks.map((item) => {
                    const isActive =
                      item.href ===
                      `/collections/${currentSlug}`;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={
                          isActive
                            ? "page"
                            : undefined
                        }
                        className={[
                          "collection-page__link",
                          isActive
                            ? "collection-page__link--active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span>{item.label}</span>

                        <ArrowUpRight
                          className="collection-page__link-icon"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            COLLECTION TOOLBAR
        ===================================================== */}

        <section className="collection-page__toolbar">
          <div className="collection-page__container">
            <div className="collection-page__toolbar-inner">
              <div className="collection-page__count">
                <span className="collection-page__count-title">
                  {title}
                </span>

                <span
                  className="collection-page__count-divider"
                  aria-hidden="true"
                >
                  /
                </span>

                <span className="collection-page__count-value">
                  {products.length}{" "}
                  {products.length === 1
                    ? "piece"
                    : "pieces"}
                </span>
              </div>

              <Link
                href="/shop"
                className="collection-page__shop-link"
              >
                <span>Shop all</span>

                <ArrowRight
                  className="collection-page__shop-icon"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT AREA
        ===================================================== */}

        <section className="collection-page__products">
          <div className="collection-page__container">
            <div className="collection-page__product-layout">
              {/* FILTERS */}

              <aside className="collection-page__filters">
                <div className="collection-page__filters-inner">
                  <ShopFilters
                    products={products}
                    selectedCategory={categoryId}
                  />
                </div>
              </aside>

              {/* PRODUCT GRID */}

              <div className="collection-page__grid">
                <ShopProductGrid
                  products={products}
                  category={categoryId}
                  sort={sort}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTINUE EXPLORING
        ===================================================== */}

        <section className="collection-page__continue">
          <div className="collection-page__container">
            <div className="collection-page__continue-inner">
              <div className="collection-page__continue-copy">
                <p className="collection-page__continue-eyebrow">
                  Continue exploring
                </p>

                <h2 className="collection-page__continue-title">
                  Discover more from Aayesha Fashion.
                </h2>
              </div>

              <div className="collection-page__continue-actions">
                <Link
                  href="/collections/new-arrivals"
                  className="collection-page__action collection-page__action--primary"
                >
                  <span>New Arrivals</span>

                  <ArrowUpRight
                    className="collection-page__action-icon"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/collections/best-sellers"
                  className="collection-page__action collection-page__action--secondary"
                >
                  <span>Best Sellers</span>

                  <ArrowUpRight
                    className="collection-page__action-icon"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}