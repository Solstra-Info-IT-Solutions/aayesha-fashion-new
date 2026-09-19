import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

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
    >
      <Container>
        <div className="best-sellers__inner">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <div className="best-sellers__header">
            <div className="best-sellers__heading-group">
              <p className="best-sellers__eyebrow">
                Curated Selection
              </p>

              <h2 className="best-sellers__title">
                Best{" "}
                <span className="best-sellers__title-accent">
                  Sellers.
                </span>
              </h2>

              <p className="best-sellers__description">
                Discover the silhouettes our customers return
                to time and again.
              </p>
            </div>
          </div>

          {/* =====================================================
              PRODUCT CAROUSEL
          ===================================================== */}

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
                Our most-loved edit is being curated.
              </p>
            </div>
          )}

          {/* =====================================================
              CTA
          ===================================================== */}

          <div className="best-sellers__cta">
            <LinkButton
              href="/collections/best-sellers"
              variant="secondary"
              size="md"
              icon={
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                />
              }
            >
              View All Best Sellers
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}