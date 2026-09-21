import { ArrowUpRight } from "lucide-react";

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
      <Container className="best-sellers__container">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="best-sellers__header">
          <div className="best-sellers__heading">
            <p className="best-sellers__eyebrow">
              Best Sellers
            </p>

            <h2
              id="best-sellers-title"
              className="best-sellers__title"
            >
              Loved by our customers
              <span>.</span>
            </h2>
          </div>

          <p className="best-sellers__intro">
            Discover the pieces our customers return to
            time and again.
          </p>
        </header>

        {/* =========================================
            PRODUCTS
        ========================================= */}

        {bestSellers.length > 0 ? (
          <div className="best-sellers__products">
            <ProductCarousel
              products={bestSellers}
              ariaLabel="Best selling products"
            />
          </div>
        ) : (
          <div className="best-sellers__empty">
            <div className="best-sellers__empty-inner">

              <div
                className="best-sellers__empty-mark"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>

              <p className="best-sellers__empty-eyebrow">
                Best Sellers
              </p>

              <h3 className="best-sellers__empty-title">
                Our most-loved pieces
                <br />
                are coming soon.
              </h3>

              <p className="best-sellers__empty-description">
                We are preparing a curated selection of
                pieces our customers love most.
              </p>

            </div>
          </div>
        )}

        {/* =========================================
            VIEW ALL CTA
        ========================================= */}

        {bestSellers.length > 0 && (
          <div className="best-sellers__footer">
            <div className="best-sellers__footer-line" />

            <a
              href="/collections/best-sellers"
              className="best-sellers__all-link"
            >
              <span className="best-sellers__all-label">
                View all best sellers
              </span>

              <span className="best-sellers__all-icon">
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.3}
                />
              </span>
            </a>

            <div className="best-sellers__footer-line" />
          </div>
        )}

      </Container>
    </section>
  );
}