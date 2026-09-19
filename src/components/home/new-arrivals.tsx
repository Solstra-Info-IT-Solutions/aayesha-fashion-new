import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function NewArrivals() {
  const response = await getProducts({
    page: 1,
    limit: 8,
    isNew: true,
    status: "active",
    sort: "newest",
  });

  const newArrivals = response.products;

  return (
    <section id="new-arrivals" className="new-arrivals">
      <Container>
        <div className="new-arrivals__inner">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}
        <div className="featured-categories__header">
          <p className="featured-categories__eyebrow">
            New Arrivals
          </p>

          <h2 className="featured-categories__title">
            Fresh from{" "}
            <span className="featured-categories__title-accent">
              AAYESHA.
            </span>
          </h2>
        </div>
          

          {/* =====================================================
              PRODUCTS
          ===================================================== */}

          {newArrivals.length > 0 ? (
            <>
              <div className="new-arrivals__products">
                <ProductCarousel
                  products={newArrivals}
                  ariaLabel="New arrivals products"
                />
              </div>

              {/* Mobile CTA */}

              <div className="new-arrivals__mobile-cta">
                <LinkButton
                  href="/collections/new-arrivals"
                  variant="secondary"
                  size="md"
                  icon={
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.4}
                    />
                  }
                >
                  View All New Arrivals
                </LinkButton>
              </div>
            </>
          ) : (
            /* ===================================================
               COMING SOON
            =================================================== */

            <div className="new-arrivals__empty">
              <div className="new-arrivals__empty-inner">
                <div className="new-arrivals__empty-mark">
                  <span />
                  <span />
                  <span />
                </div>

                <p className="new-arrivals__empty-eyebrow">
                  New Arrivals
                </p>

                <h3 className="new-arrivals__empty-title">
                  Something new is coming.
                </h3>

                <p className="new-arrivals__empty-description">
                  Our latest styles are on their way.
                  Explore the current collection while
                  you wait.
                </p>

                <div className="new-arrivals__empty-cta">
                  <LinkButton
                    href="/shop"
                    variant="secondary"
                    size="md"
                    icon={
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.4}
                      />
                    }
                  >
                    Explore Shop
                  </LinkButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}