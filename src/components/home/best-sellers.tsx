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
        <header className="best-sellers__header">
          <div className="best-sellers__heading">
            <span className="best-sellers__eyebrow">
              Best Sellers
            </span>

            <h2 className="best-sellers__title">
              Loved by our customers<span>.</span>
            </h2>
          </div>

          <p className="best-sellers__description">
            Discover the pieces our customers return to
            time and again.
          </p>
        </header>

        {bestSellers.length > 0 ? (
          <div className="best-sellers__products">
            <ProductCarousel products={bestSellers} />
          </div>
        ) : (
          <div className="best-sellers__empty">
            <span className="best-sellers__empty-letter">A</span>

            <h3>Best sellers coming soon.</h3>

            <p>
              Our most-loved pieces will appear here.
            </p>
          </div>
        )}

        <div className="best-sellers__bottom">
          <Link
            href="/collections/best-sellers"
            className="best-sellers__view-all"
          >
            <span>View all best sellers</span>

            <span className="best-sellers__view-icon">
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
              />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}