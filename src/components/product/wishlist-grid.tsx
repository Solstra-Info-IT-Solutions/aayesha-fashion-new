"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import type { Product } from "@/types/product";

import { ProductCard } from "@/components/product/product-card";

import { useWishlistStore } from "@/store/wishlist-store";

import "./WishlistGrid.css";
import "@/components/home/HomeCta.css";

type WishlistGridProps = {
  products: Product[];
};

export function WishlistGrid({
  products,
}: WishlistGridProps) {
  const productIds = useWishlistStore(
    (state) => state.productIds,
  );

  const wishlistProducts = products.filter(
    (product) =>
      productIds.includes(product.id),
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="wishlist-grid__empty">
        <div
          aria-hidden="true"
          className="wishlist-grid__empty-icon"
        >
          <Heart
            size={28}
            strokeWidth={1.5}
          />
        </div>

        <p className="wishlist-grid__eyebrow">
          Nothing saved yet
        </p>

        <h2 className="wishlist-grid__empty-title">
          Your wishlist is waiting.
        </h2>

        <p className="wishlist-grid__empty-description">
          Save pieces you love while
          exploring the Aayesha collection.
          They will appear here for you
          later.
        </p>

        <div className="wishlist-grid__empty-action">
          <Link href="/shop" className="home-cta">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-grid">
      <div className="wishlist-grid__header">
        <div>
          <p className="wishlist-grid__eyebrow">
            Your Selection
          </p>

          <h2 className="wishlist-grid__title">
            Saved Pieces
          </h2>
        </div>

        <span className="wishlist-grid__count">
          {wishlistProducts.length}{" "}
          {wishlistProducts.length === 1
            ? "piece"
            : "pieces"}
        </span>
      </div>

      <div className="wishlist-grid__products">
        {wishlistProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ),
        )}
      </div>

      <div className="wishlist-grid__footer">
        <Link href="/shop" className="home-cta">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}