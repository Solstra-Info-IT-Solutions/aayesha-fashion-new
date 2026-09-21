"use client";

import { useMemo } from "react";

import Link from "next/link";

import { SlidersHorizontal } from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

import {
  getProductStartingPrice,
  getInventoryStatus,
} from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

import "./ShopProductGrid.css";

interface ShopProductGridProps {
  products: Product[];
  category?: string;
  sort?: ProductSort;
}

function getUrlParams() {
  if (typeof window === "undefined") {
    return {
      availability: null,
    };
  }

  const params = new URLSearchParams(
    window.location.search,
  );

  return {
    availability:
      params.get("availability"),
  };
}

function getCollectionContext() {
  if (typeof window === "undefined") {
    return {
      isNew: false,
      isBestSeller: false,
    };
  }

  const pathname = window.location.pathname;
  const params = new URLSearchParams(
    window.location.search,
  );

  return {
    isNew:
      pathname ===
        "/collections/new-arrivals" ||
      params.get("isNew") === "true",

    isBestSeller:
      pathname ===
        "/collections/best-sellers" ||
      params.get("isBestSeller") ===
        "true",
  };
}

export function ShopProductGrid({
  products,
  category,
  sort = "relevance",
}: ShopProductGridProps) {
  const urlParams = useMemo(
    () => getUrlParams(),
    [products, category, sort],
  );

  const collectionContext = useMemo(
    () => getCollectionContext(),
    [products, category, sort],
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.status === "active",
    );

    if (category) {
      result = result.filter(
        (product) =>
          product.categoryId === category,
      );
    }

    if (collectionContext.isNew) {
      result = result.filter(
        (product) =>
          product.merchandising?.isNew ===
          true,
      );
    }

    if (collectionContext.isBestSeller) {
      result = result.filter(
        (product) =>
          product.merchandising
            ?.isBestSeller === true,
      );
    }

    if (urlParams.availability) {
      result = result.filter((product) => {
        const inventoryStatus =
          getInventoryStatus(product);

        if (
          urlParams.availability ===
          "out-of-stock"
        ) {
          return (
            inventoryStatus ===
            "out-of-stock"
          );
        }

        if (
          urlParams.availability ===
          "in-stock"
        ) {
          return (
            inventoryStatus ===
              "in-stock" ||
            inventoryStatus === "low-stock"
          );
        }

        if (
          urlParams.availability ===
          "low"
        ) {
          return (
            inventoryStatus ===
            "low-stock"
          );
        }

        return true;
      });
    }

    switch (sort) {
      case "price-low":
        result.sort(
          (a, b) =>
            getProductStartingPrice(a) -
            getProductStartingPrice(b),
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            getProductStartingPrice(b) -
            getProductStartingPrice(a),
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );
        break;

      case "best-selling":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isBestSeller
              ? 1
              : 0;

          const bScore =
            b.merchandising?.isBestSeller
              ? 1
              : 0;

          return bScore - aScore;
        });
        break;

      case "featured":
        result.sort((a, b) => {
          const aScore =
            a.merchandising?.isFeatured
              ? 1
              : 0;

          const bScore =
            b.merchandising?.isFeatured
              ? 1
              : 0;

          return bScore - aScore;
        });
        break;

      case "rating":
      case "relevance":
      default:
        break;
    }

    return result;
  }, [
    products,
    category,
    sort,
    urlParams.availability,
    collectionContext.isNew,
    collectionContext.isBestSeller,
  ]);

  const refineHref =
    collectionContext.isNew
      ? "/collections/new-arrivals"
      : collectionContext.isBestSeller
        ? "/collections/best-sellers"
        : "/shop";

  return (
    <section className="shop-product-grid">
      <div className="shop-product-grid__toolbar">
        <div className="shop-product-grid__collection">
          <p className="shop-product-grid__eyebrow">
            Collection
          </p>

          <p className="shop-product-grid__count">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        <Link
          href={refineHref}
          className="shop-product-grid__refine"
        >
          <SlidersHorizontal
            size={13}
            strokeWidth={1.4}
          />

          <span>Refine</span>
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState href={refineHref} />
      ) : (
        <div className="shop-product-grid__products">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}

interface EmptyStateProps {
  href: string;
}

function EmptyState({
  href,
}: EmptyStateProps) {
  return (
    <div className="shop-product-grid__empty">
      <span
        className="shop-product-grid__empty-line"
        aria-hidden="true"
      />

      <p className="shop-product-grid__empty-eyebrow">
        Nothing here yet
      </p>

      <h2 className="shop-product-grid__empty-title">
        No pieces found
      </h2>

      <p className="shop-product-grid__empty-description">
        Try adjusting your filters or
        explore the complete collection.
      </p>

      <Link
        href={href}
        className="shop-product-grid__empty-button"
      >
        View Collection
      </Link>
    </div>
  );
}