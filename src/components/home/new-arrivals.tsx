import Link from "next/link";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";

import "./NewArrivals.css";
import "./HomeCta.css";

/* =========================================================
   NEW ARRIVALS
========================================================= */

export async function NewArrivals() {
  let newArrivals: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 8,
      isNew: true,
      status: "active",
      sort: "newest",
    });

    newArrivals = response?.products ?? [];
  } catch (error) {
    console.error(
      "NEW ARRIVALS API ERROR:",
      error,
    );

    newArrivals = [];
  }

  return (
    <section
      id="new-arrivals"
      className="new-arrivals"
      aria-labelledby="new-arrivals-title"
    >
      <Container>
        <div className="new-arrivals__inner">

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <header className="new-arrivals__header">

            <div className="new-arrivals__heading">

              <div className="new-arrivals__eyebrow-wrap">
                <span
                  className="new-arrivals__eyebrow-line"
                  aria-hidden="true"
                />

                <p className="new-arrivals__eyebrow">
                  New Arrivals
                </p>
              </div>

              <h2
                id="new-arrivals-title"
                className="new-arrivals__title"
              >
                Fresh from{" "}
                <span>AAYESHA.</span>
              </h2>

            </div>
          </header>

          {/* =================================================
              PRODUCTS
          ================================================= */}

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

              <div className="home-cta-row home-cta-row--lines">
                <span className="home-cta-row__line" aria-hidden="true" />
                <Link
                  href="/collections/new-arrivals"
                  className="home-cta"
                >
                  View all new arrivals
                </Link>
                <span className="home-cta-row__line" aria-hidden="true" />
              </div>
            </>
          ) : (

            /* =================================================
               EMPTY / COMING SOON
            ================================================= */

            <div className="new-arrivals__empty">

              <div className="new-arrivals__empty-inner">

                {/* Decorative Mark */}

                <div
                  className="new-arrivals__empty-mark"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </div>

                {/* Eyebrow */}

                <p className="new-arrivals__empty-eyebrow">
                  New Arrivals
                </p>

                {/* Title */}

                <h3 className="new-arrivals__empty-title">
                  Something new is coming.
                </h3>

                {/* Description */}

                <p className="new-arrivals__empty-description">
                  Our latest styles are on their
                  way. Explore the current
                  collection while you wait.
                </p>

                {/* CTA */}

                <div className="new-arrivals__empty-cta">

                  <Link
                    href="/shop"
                    className="home-cta"
                  >
                    Explore Shop
                  </Link>

                </div>

              </div>

            </div>
          )}

        </div>
      </Container>
    </section>
  );
}