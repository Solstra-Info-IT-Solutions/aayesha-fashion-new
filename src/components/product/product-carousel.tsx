"use client";

import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

import "./ProductCarousel.css";

type ProductCarouselProps = {
  products: Product[];
  ariaLabel?: string;
};

export function ProductCarousel({
  products,
  ariaLabel = "Product carousel",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const firstItem =
      container.querySelector<HTMLElement>(
        ".product-carousel__item",
      );

    const itemWidth =
      firstItem?.getBoundingClientRect().width ??
      container.clientWidth * 0.76;

    const gap = 20;

    const amount = itemWidth + gap;

    container.scrollBy({
      left:
        direction === "next"
          ? amount
          : -amount,
      behavior: "smooth",
    });
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="product-carousel">
      {/* =====================================================
          CAROUSEL TRACK
      ===================================================== */}

      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="product-carousel__track"
      >
        {products.map((product, index) => (
          <article
            key={product.id}
            className="product-carousel__item"
          >
            <ProductCard
              product={product}
              priority={index === 0}
            />
          </article>
        ))}

        <div
          aria-hidden="true"
          className="product-carousel__end-spacer"
        />
      </div>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      {products.length > 1 && (
        <div className="product-carousel__controls">
          <div className="product-carousel__control-copy">
            <span className="product-carousel__control-eyebrow">
              Aayesha Collection
            </span>

            <p className="product-carousel__hint">
              Swipe to explore
            </p>
          </div>

          <div className="product-carousel__actions">
            <button
              type="button"
              onClick={() => scroll("prev")}
              aria-label="Previous products"
              className="product-carousel__button product-carousel__button--previous"
            >
              <ArrowLeft
                className="product-carousel__icon"
                size={17}
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => scroll("next")}
              aria-label="Next products"
              className="product-carousel__button product-carousel__button--next"
            >
              <ArrowRight
                className="product-carousel__icon"
                size={17}
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}