"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

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

    const amount =
      container.clientWidth *
      (window.innerWidth >= 1280
        ? 0.76
        : window.innerWidth >= 1024
          ? 0.82
          : 0.82);

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="product-carousel">
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

      {products.length > 1 && (
        <div className="product-carousel__controls">
          <p className="product-carousel__hint">
            Swipe to explore
          </p>

          <div className="product-carousel__actions">
            <button
              type="button"
              onClick={() => scroll("prev")}
              aria-label="Previous products"
              className="product-carousel__button"
            >
              <ArrowLeft
                className="product-carousel__icon"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={() => scroll("next")}
              aria-label="Next products"
              className="product-carousel__button"
            >
              <ArrowRight
                className="product-carousel__icon"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}