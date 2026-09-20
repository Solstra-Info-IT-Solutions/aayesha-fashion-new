import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

import "./NewArrivals.css";

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
    <section
      id="new-arrivals"
      className="new-arrivals"
      aria-labelledby="new-arrivals-title"
    >
      <Container>
        <div className="new-arrivals__inner">
          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <header className="new-arrivals__header">
            <div className="new-arrivals__heading">
              <p className="new-arrivals__eyebrow">
                New Arrivals
              </p>

              <h2
                id="new-arrivals-title"
                className="new-arrivals__title"
              >
                Fresh from{" "}
                <span>AAYESHA.</span>
              </h2>
            </div>

            <p className="new-arrivals__intro">
              Discover the latest silhouettes,
              textures and details newly added
              to the AAYESHA collection.
            </p>
          </header>

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

              {/* =================================================
                  MOBILE CTA
              ================================================= */}

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
                <div
                  className="new-arrivals__empty-mark"
                  aria-hidden="true"
                >
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
                  Our latest styles are on their
                  way. Explore the current
                  collection while you wait.
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