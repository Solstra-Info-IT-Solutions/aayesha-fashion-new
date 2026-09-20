"use client";

import { Star } from "lucide-react";

import type { Product } from "@/types/product";

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({
  product,
}: ProductReviewsProps) {
  void product;

  return (
    <section
      aria-label="Customer reviews"
      className="product-reviews"
    >
      <div className="product-reviews__content">
        <span
          aria-hidden="true"
          className="product-reviews__icon"
        >
          <Star
            size={17}
            strokeWidth={1.5}
          />
        </span>

        <div className="product-reviews__copy">
          <p className="product-reviews__title">
            Customer Reviews
          </p>

          <p className="product-reviews__description">
            Reviews will appear here as
            customers share their experience.
          </p>
        </div>
      </div>
    </section>
  );
}