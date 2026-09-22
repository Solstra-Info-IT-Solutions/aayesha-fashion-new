import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import "./CollectionsPage.css";

/* =========================================================
   COLLECTIONS
========================================================= */

const collectionLinks = [
  {
    label: "New Arrivals",
    eyebrow: "Just introduced",
    description:
      "Discover the latest pieces added to the Aayesha Fashion collection.",
    href: "/collections/new-arrivals",
  },
  {
    label: "Best Sellers",
    eyebrow: "Most loved",
    description:
      "Explore the pieces our customers return to time and again.",
    href: "/collections/best-sellers",
  },
] as const;

/* =========================================================
   PAGE
========================================================= */

export default async function CollectionsPage() {
  let featured: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 6,
      isFeatured: true,
      status: "active",
      sort: "featured",
    });

    featured = response.products ?? [];
  } catch {
    featured = [];
  }

  return (
  <main className="collections-page">
    {/* =====================================================
        INTRO
    ===================================================== */}

    <section className="collections-page__intro">
      <div className="collections-page__container">
        <div className="collections-page__intro-content">
          <div className="collections-page__eyebrow-row">
            <span className="collections-page__eyebrow-line" />

            <p className="collections-page__eyebrow">
              Aayesha Fashion
            </p>
          </div>

          <h1 className="collections-page__title">
            Collections
          </h1>

          <p className="collections-page__description">
            Explore the latest arrivals and the pieces loved
            most by our customers.
          </p>

          <Link
            href="/shop"
            className="collections-page__text-link"
          >
            <span>Shop everything</span>

            <ArrowRight
              size={13}
              strokeWidth={1.3}
            />
          </Link>
        </div>
      </div>
    </section>

    {/* =====================================================
        COLLECTIONS
    ===================================================== */}

    <section className="collections-page__collection-section">
      <div className="collections-page__container">
        <div className="collections-page__section-header">
          <div>
            <p className="collections-page__section-eyebrow">
              Explore
            </p>

            <h2 className="collections-page__section-title">
              Shop by collection
            </h2>
          </div>

          <span className="collections-page__section-count">
            02 collections
          </span>
        </div>

        <div className="collections-page__collection-grid">
          {collectionLinks.map((collection, index) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="collections-page__collection-card"
            >
              <div className="collections-page__collection-top">
                <span className="collections-page__collection-number">
                  0{index + 1}
                </span>

                <span className="collections-page__collection-icon">
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.25}
                  />
                </span>
              </div>

              <div className="collections-page__collection-content">
                <p className="collections-page__collection-eyebrow">
                  {collection.eyebrow}
                </p>

                <h3 className="collections-page__collection-title">
                  {collection.label}
                </h3>

                <p className="collections-page__collection-description">
                  {collection.description}
                </p>

                <span className="collections-page__collection-link">
                  <span>Explore</span>

                  <ArrowRight
                    size={12}
                    strokeWidth={1.3}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* =====================================================
        FEATURED PRODUCTS
    ===================================================== */}

    {featured.length > 0 && (
      <section className="collections-page__featured">
        <div className="collections-page__container">
          <div className="collections-page__section-header">
            <div>
              <p className="collections-page__section-eyebrow">
                The Aayesha edit
              </p>

              <h2 className="collections-page__section-title">
                Featured pieces
              </h2>
            </div>

            <Link
              href="/shop"
              className="collections-page__view-all"
            >
              <span>View all</span>

              <ArrowUpRight
                size={13}
                strokeWidth={1.3}
              />
            </Link>
          </div>

          <p className="collections-page__featured-description">
            A considered selection of pieces from the
            Aayesha collection.
          </p>

          <div className="collections-page__product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    )}

    {/* =====================================================
        CLOSING
    ===================================================== */}

    <section className="collections-page__closing">
      <div className="collections-page__closing-inner">
        <p className="collections-page__closing-eyebrow">
          Aayesha Fashion
        </p>

        <h2 className="collections-page__closing-title">
          Style that feels distinctly yours.
        </h2>

        <Link
          href="/shop"
          className="collections-page__closing-button"
        >
          <span>Shop now</span>

          <ArrowRight
            size={13}
            strokeWidth={1.3}
          />
        </Link>
      </div>
    </section>
  </main>
);
}