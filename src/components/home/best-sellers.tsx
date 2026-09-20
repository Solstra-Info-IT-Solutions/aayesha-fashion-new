import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";

import "./BestSellers.css";

export async function BestSellers() {
  const response = await getProducts({
    page: 1,
    limit: 8,
    isBestSeller: true,
    status: "active",
    sort: "best-selling",
  });

  const bestSellers = response.products;

  return (
    <section
      id="best-sellers"
      className="best-sellers"
      aria-labelledby="best-sellers-title"
    >
      <Container>
        <div className="best-sellers__inner">
          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <header className="best-sellers__header">
            <div className="best-sellers__heading-group">
              <p className="best-sellers__eyebrow">
                Curated Selection
              </p>

              <h2
                id="best-sellers-title"
                className="best-sellers__title"
              >
                Best{" "}
                <span> Sellers.</span>
              </h2>
            </div>

            <p className="best-sellers__description">
              Discover the silhouettes our
              customers return to time and
              again.
            </p>
          </header>

          {/* =================================================
              PRODUCT CAROUSEL
          ================================================= */}

          {bestSellers.length > 0 ? (
            <div className="best-sellers__products">
              <ProductCarousel
                products={bestSellers}
                ariaLabel="Best selling products"
              />
            </div>
          ) : (
            <div className="best-sellers__empty">
              <p className="best-sellers__empty-eyebrow">
                Coming soon
              </p>

              <p className="best-sellers__empty-title">
                Our most-loved edit is
                being curated.
              </p>
            </div>
          )}

          {/* =================================================
              CTA
          ================================================= */}

          <div className="best-sellers__footer">
            <span className="best-sellers__footer-line" />

            <Link
              href="/collections/best-sellers"
              className="best-sellers__cta"
            >
              <span>
                View All Best Sellers
              </span>

              <span className="best-sellers__cta-icon">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.3}
                />
              </span>
            </Link>

            <span className="best-sellers__footer-line" />
          </div>
        </div>
      </Container>
    </section>
  );
}