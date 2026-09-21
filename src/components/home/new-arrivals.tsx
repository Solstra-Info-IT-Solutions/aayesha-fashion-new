import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";

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
                  VIEW ALL CTA
              ================================================= */}

              <div className="new-arrivals__footer">
                <div className="new-arrivals__footer-line" />

                <a
                  href="/collections/new-arrivals"
                  className="new-arrivals__all-link"
                >
                  <span className="new-arrivals__all-label">
                    View all new arrivals
                  </span>

                  <span className="new-arrivals__all-icon">
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.3}
                    />
                  </span>
                </a>

                <div className="new-arrivals__footer-line" />
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
                  <a
                    href="/shop"
                    className="new-arrivals__empty-link"
                  >
                    <span>
                      Explore Shop
                    </span>

                    <span className="new-arrivals__empty-icon">
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.3}
                      />
                    </span>
                  </a>
                </div>

              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}