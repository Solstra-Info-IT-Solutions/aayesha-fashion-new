"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import type { Product } from "@/types/product";

import { getProductById } from "@/services/product.service";

import { getRecentlyViewed } from "@/lib/recently-viewed/recently-viewed";

import { ProductCard } from "@/components/product/product-card";

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
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentlyViewed() {
      try {
        setLoading(true);

        const storedIds =
          getRecentlyViewed();

        const filteredIds =
          storedIds.filter(
            (id) =>
              id !== currentProductId,
          );

        const idsToLoad =
          filteredIds.slice(0, limit);

        if (idsToLoad.length === 0) {
          if (!cancelled) {
            setProducts([]);
            setLoading(false);
          }

          return;
        }

        const results =
          await Promise.allSettled(
            idsToLoad.map((id) =>
              getProductById(id),
            ),
          );

        if (cancelled) {
          return;
        }

        const loadedProducts =
          results
            .filter(
              (
                result,
              ): result is PromiseFulfilledResult<Product> =>
                result.status ===
                "fulfilled",
            )
            .map(
              (result) =>
                result.value,
            );

        /*
         * Preserve the same order as
         * localStorage.
         */
        const orderedProducts =
          idsToLoad
            .map((id) =>
              loadedProducts.find(
                (product) =>
                  product._id === id ||
                  product.id === id,
              ),
            )
            .filter(
              (
                product,
              ): product is Product =>
                Boolean(product),
            );

        setProducts(
          orderedProducts,
        );
      } catch (error) {
        console.error(
          "Failed to load recently viewed products:",
          error,
        );

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecentlyViewed();

    return () => {
      cancelled = true;
    };
  }, [
    currentProductId,
    limit,
  ]);

  /*
   * Don't render anything while the
   * browser is checking localStorage
   * or fetching products.
   */
  if (loading) {
    return null;
  }

  /*
   * Nothing to display.
   */
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="recently-viewed"
      aria-labelledby="recently-viewed-title"
    >
      <div className="recently-viewed__container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="recently-viewed__header">
          <div className="recently-viewed__heading">
            <div className="recently-viewed__eyebrow">
              <span
                className="recently-viewed__eyebrow-line"
                aria-hidden="true"
              />

              <span>
                {eyebrow}
              </span>
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
            <span>
              View All
            </span>

            <span
              className="recently-viewed__view-all-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <div className="recently-viewed__grid">
          {products.map(
            (product) => (
              <ProductCard
                key={
                  product._id ??
                  product.id
                }
                product={product}
              />
            ),
          )}
        </div>

        {/* =================================================
            MOBILE VIEW ALL
        ================================================= */}

        <div className="recently-viewed__mobile-link">
          <Link
            href="/shop"
            className="recently-viewed__view-all"
          >
            <span>
              View All
            </span>

            <span
              className="recently-viewed__view-all-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}