"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getRecentlyViewed,
  type RecentlyViewedProduct,
} from "@/lib/recently-viewed/recently-viewed";

import "./RecentlyViewed.css";

interface RecentlyViewedProps {
  currentProductId?: string;
  title?: string;
  eyebrow?: string;
  limit?: number;
}

export function RecentlyViewed({
  currentProductId,
  title = "Recently Viewed",
  eyebrow = "Your Recent Edit",
  limit = 6,
}: RecentlyViewedProps) {
  const [products, setProducts] = useState<
    RecentlyViewedProduct[]
  >([]);

  useEffect(() => {
    const storedProducts = getRecentlyViewed();

    const filteredProducts = currentProductId
      ? storedProducts.filter(
          (product) => product.id !== currentProductId,
        )
      : storedProducts;

    setProducts(filteredProducts.slice(0, limit));
  }, [currentProductId, limit]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="recently-viewed"
      aria-labelledby="recently-viewed-title"
    >
      <div className="recently-viewed__container">
        <div className="recently-viewed__header">
          <div className="recently-viewed__heading">
            <div className="recently-viewed__eyebrow">
              <span className="recently-viewed__eyebrow-line" />
              <span>{eyebrow}</span>
            </div>

            <h2
              id="recently-viewed-title"
              className="recently-viewed__title"
            >
              {title}
            </h2>
          </div>

          <Link
            href="/shop"
            className="recently-viewed__view-all"
          >
            <span>View All</span>
            <span
              className="recently-viewed__view-all-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        <div className="recently-viewed__grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="recently-viewed__card"
            >
              <Link
                href={`/products/${product.id}`}
                className="recently-viewed__product-link"
              >
                <div className="recently-viewed__image-wrap">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="
                        (max-width: 639px) 50vw,
                        (max-width: 1023px) 33vw,
                        20vw
                      "
                      className="recently-viewed__image"
                    />
                  ) : (
                    <div
                      className="recently-viewed__image-placeholder"
                      aria-hidden="true"
                    >
                      <span>AAYESHA</span>
                    </div>
                  )}
                </div>

                <div className="recently-viewed__details">
                  {product.category && (
                    <span className="recently-viewed__category">
                      {product.category}
                    </span>
                  )}

                  <h3 className="recently-viewed__product-name">
                    {product.name}
                  </h3>

                  {typeof product.price === "number" && (
                    <div className="recently-viewed__price">
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="recently-viewed__original-price">
                            ₹
                            {product.originalPrice.toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        )}

                      <span>
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}