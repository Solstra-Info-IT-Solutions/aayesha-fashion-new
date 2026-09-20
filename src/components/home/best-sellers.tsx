import Link from "next/link";
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
    <section id="best-sellers" className="best-sellers">
      <Container className="best-sellers__container">
        <div className="best-sellers__header">
          <div className="best-sellers__heading">
            <span className="best-sellers__eyebrow">
              Best Sellers
            </span>

            <h2 className="best-sellers__title">
              Best Sellers<span>.</span>
            </h2>
          </div>

          <p className="best-sellers__description">
            Discover the silhouettes our customers return to
            time and again.
          </p>
        </div>

        {bestSellers.length > 0 ? (
          <ProductCarousel products={bestSellers} />
        ) : (
          <div className="best-sellers__empty">
            <span className="best-sellers__empty-mark">A</span>

            <h3>Our best sellers are coming soon.</h3>

            <p>
              We are preparing a curated selection of our most
              loved pieces.
            </p>
          </div>
        )}

        <div className="best-sellers__footer">
          <span className="best-sellers__line" />

          <Link
            href="/collections/best-sellers"
            className="best-sellers__link"
          >
            <span>View all best sellers</span>

            <span className="best-sellers__arrow">
              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
              />
            </span>
          </Link>

          <span className="best-sellers__line" />
        </div>
      </Container>
    </section>
  );
}