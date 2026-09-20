"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import type { ProductMedia } from "@/types/product";

interface ProductLightboxProps {
  open: boolean;
  media: ProductMedia[];
  activeIndex: number;
  productName: string;
  onClose: () => void;
  onChange: (index: number) => void;
}

export function ProductLightbox({
  open,
  media,
  activeIndex,
  productName,
  onClose,
  onChange,
}: ProductLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && media.length > 1) {
        onChange(
          activeIndex <= 0
            ? media.length - 1
            : activeIndex - 1,
        );
      }

      if (event.key === "ArrowRight" && media.length > 1) {
        onChange(
          activeIndex >= media.length - 1
            ? 0
            : activeIndex + 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [
    open,
    activeIndex,
    media.length,
    onChange,
    onClose,
  ]);

  if (!open || !media.length) {
    return null;
  }

  const safeIndex =
    activeIndex >= 0 && activeIndex < media.length
      ? activeIndex
      : 0;

  const active = media[safeIndex];

  const previousIndex =
    safeIndex <= 0
      ? media.length - 1
      : safeIndex - 1;

  const nextIndex =
    safeIndex >= media.length - 1
      ? 0
      : safeIndex + 1;

  return (
    <div
      className="product-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} fullscreen gallery`}
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen gallery"
        className="product-lightbox__backdrop"
      />

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="product-lightbox__topbar">
        <div className="product-lightbox__product">
          <p className="product-lightbox__eyebrow">
            Product View
          </p>

          <p className="product-lightbox__product-name">
            {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close fullscreen gallery"
          className="product-lightbox__close"
        >
          <X
            className="product-lightbox__close-icon"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* =====================================================
          MAIN MEDIA
      ===================================================== */}

      <div className="product-lightbox__media-area">
        {active.type === "image" ? (
          <div className="product-lightbox__image-frame">
            <Image
              src={active.src}
              alt={active.alt ?? productName}
              fill
              className="product-lightbox__image"
              sizes="100vw"
              priority
            />
          </div>
        ) : active.type === "video" ? (
          <video
            src={active.src}
            poster={active.poster}
            controls
            autoPlay
            playsInline
            aria-label={active.alt ?? productName}
            className="product-lightbox__video"
          />
        ) : (
          <iframe
            src={active.src}
            title={active.alt ?? productName}
            className="product-lightbox__iframe"
            allow="
              autoplay;
              encrypted-media;
              picture-in-picture
            "
            allowFullScreen
          />
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      {media.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => onChange(previousIndex)}
            aria-label="Previous product media"
            className="product-lightbox__navigation product-lightbox__navigation--previous"
          >
            <ChevronLeft
              className="product-lightbox__navigation-icon"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => onChange(nextIndex)}
            aria-label="Next product media"
            className="product-lightbox__navigation product-lightbox__navigation--next"
          >
            <ChevronRight
              className="product-lightbox__navigation-icon"
              aria-hidden="true"
            />
          </button>
        </>
      )}

      {/* =====================================================
          BOTTOM META
      ===================================================== */}

      <div className="product-lightbox__footer">
        <div className="product-lightbox__counter">
          <span>
            {String(safeIndex + 1).padStart(2, "0")}
          </span>

          <span
            className="product-lightbox__counter-line"
            aria-hidden="true"
          />

          <span>
            {String(media.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}