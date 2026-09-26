import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

import { ProductCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/shared/container";

import "./NewArrivals.css";

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

            <div className="new-arrivals__intro-wrap">

              <p className="new-arrivals__intro">
                Discover the latest silhouettes,
                textures and details newly added
                to the AAYESHA collection.
              </p>

              <span
                className="new-arrivals__intro-mark"
                aria-hidden="true"
              >
                01 — 08
              </span>

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

              <div className="new-arrivals__footer">

                <div
                  className="new-arrivals__footer-line"
                  aria-hidden="true"
                />

                <Link
                  href="/collections/new-arrivals"
                  className="new-arrivals__all-link"
                >
                  <span className="new-arrivals__all-label">
                    View all new arrivals
                  </span>

                  <span
                    className="new-arrivals__all-icon"
                    aria-hidden="true"
                  >
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.3}
                    />
                  </span>
                </Link>

                <div
                  className="new-arrivals__footer-line"
                  aria-hidden="true"
                />

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
                    className="new-arrivals__empty-link"
                  >
                    <span className="new-arrivals__empty-label">
                      Explore Shop
                    </span>

                    <span
                      className="new-arrivals__empty-icon"
                      aria-hidden="true"
                    >
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.3}
                      />
                    </span>
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