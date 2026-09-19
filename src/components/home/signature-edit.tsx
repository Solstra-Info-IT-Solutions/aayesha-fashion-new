import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getProducts } from "@/lib/api/products";

import { Container } from "@/components/shared/container";
import { ProductCard } from "@/components/product/product-card";

export async function SignatureEdit() {
  const response = await getProducts({
    page: 1,
    limit: 8,
    isFeatured: true,
    status: "active",
    sort: "featured",
  });

  const signatureProducts = response.products;

  return (
    <section
      id="signature-edit"
      className="signature-edit"
    >
      <Container>
        <div className="signature-edit__inner">
          {/* =====================================================
              TOP LINE
          ===================================================== */}

          <div className="signature-edit__topline">
            <div className="signature-edit__eyebrow">
              <span
                aria-hidden="true"
                className="signature-edit__eyebrow-line"
              />

              <p className="signature-edit__eyebrow-text">
                The Signature Edit
              </p>
            </div>

            <span className="signature-edit__count">
              {String(signatureProducts.length).padStart(2, "0")} Pieces
            </span>
          </div>

          {/* =====================================================
              SECTION HEADER
          ===================================================== */}

          <div className="signature-edit__header">
            <div className="signature-edit__heading">
              <h2 className="signature-edit__title">
                The pieces{" "}
                <span className="signature-edit__title-accent">
                  we love now.
                </span>
              </h2>
            </div>

            <div className="signature-edit__intro">
              <p>
                A refined selection of our most considered
                silhouettes, designed to make every occasion
                feel unforgettable.
              </p>
            </div>
          </div>

          {/* =====================================================
              PRODUCTS
          ===================================================== */}

          {signatureProducts.length > 0 ? (
            <div className="signature-edit__products">
              {signatureProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="signature-edit__empty">
              <div className="signature-edit__empty-mark">
                <span />
                <span />
                <span />
              </div>

              <p className="signature-edit__empty-eyebrow">
                The Signature Edit
              </p>

              <p className="signature-edit__empty-title">
                Our signature pieces are being curated.
              </p>
            </div>
          )}

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}

          <div className="signature-edit__footer">
            <Link
              href="/shop?featured=true"
              className="signature-edit__cta"
            >
              <span>
                Explore the complete collection
              </span>

              <span
                aria-hidden="true"
                className="signature-edit__cta-icon"
              >
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.4}
                />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}