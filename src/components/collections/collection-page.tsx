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

import "./CollectionPage.css";

type CollectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  categoryId?: string;
  products: Product[];
  sort: ProductSort;
  mood?: string;
};

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
            HERO
        ===================================================== */}

        <section className="collection-page__hero">
          <div className="collection-page__container">
            <div className="collection-page__hero-inner">
              <div className="collection-page__intro">
                <div className="collection-page__eyebrow">
                  <span className="collection-page__eyebrow-line" />

                  <span>
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

              <div className="collection-page__navigation">
                <p className="collection-page__navigation-label">
                  Explore collections
                </p>

                <div className="collection-page__links">
                  {collectionLinks.map(
                    (item) => {
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
                          className={`collection-page__link ${
                            isActive
                              ? "collection-page__link--active"
                              : ""
                          }`}
                        >
                          <span>
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.3}
                            className="collection-page__link-icon"
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    },
                  )}
                </div>
              </div>

              <span
                className="collection-page__hero-mark"
                aria-hidden="true"
              >
                AA
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            TOOLBAR
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
                  size={14}
                  strokeWidth={1.3}
                  className="collection-page__shop-icon"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section className="collection-page__products">
          <div className="collection-page__container">
            <div className="collection-page__product-layout">
              <aside className="collection-page__filters">
                <div className="collection-page__filters-inner">
                  <ShopFilters
                    products={products}
                    selectedCategory={categoryId}
                  />
                </div>
              </aside>

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
                  Discover more from
                  Aayesha Fashion.
                </h2>
              </div>

              <div className="collection-page__continue-actions">
                <Link
                  href="/collections/new-arrivals"
                  className="collection-page__action collection-page__action--primary"
                >
                  <span>
                    New Arrivals
                  </span>

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.3}
                    className="collection-page__action-icon"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  href="/collections/best-sellers"
                  className="collection-page__action collection-page__action--secondary"
                >
                  <span>
                    Best Sellers
                  </span>

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.3}
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