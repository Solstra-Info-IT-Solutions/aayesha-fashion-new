"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
} from "lucide-react";

import type { Product } from "@/types/product";

import { ProductLightbox } from "@/components/product/product-lightbox";

interface ProductMediaGalleryProps {
  product: Product;
}

export function ProductMediaGallery({
  product,
}: ProductMediaGalleryProps) {
  const media = product.media ?? [];

  const primary =
    media.find((item) => item.isPrimary) ??
    media.find((item) => item.type === "image") ??
    media[0];

  const [activeId, setActiveId] = useState(
    primary?.id ?? "",
  );

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const activeIndex = Math.max(
    0,
    media.findIndex((item) => item.id === activeId),
  );

  const activeMedia = media[activeIndex] ?? primary;

  const goPrevious = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex <= 0
        ? media.length - 1
        : activeIndex - 1;

    setActiveId(media[nextIndex].id);
  };

  const goNext = () => {
    if (!media.length) return;

    const nextIndex =
      activeIndex >= media.length - 1
        ? 0
        : activeIndex + 1;

    setActiveId(media[nextIndex].id);
  };

  if (!activeMedia) {
    return (
      <div className="product-media-gallery__empty">
        <span className="product-media-gallery__empty-label">
          No media available
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="product-media-gallery">
        {/* =====================================================
            THUMBNAILS
        ===================================================== */}

        <div className="product-media-gallery__thumbnails">
          {media.map((item, index) => {
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                aria-label={`View product media ${
                  index + 1
                }`}
                aria-current={
                  isActive ? "true" : undefined
                }
                className={[
                  "product-media-gallery__thumbnail",
                  isActive
                    ? "product-media-gallery__thumbnail--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt ?? product.name}
                    fill
                    className="product-media-gallery__thumbnail-image"
                    sizes="72px"
                  />
                ) : (
                  <>
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={
                          item.alt ??
                          `${product.name} video`
                        }
                        fill
                        className="product-media-gallery__thumbnail-image"
                        sizes="72px"
                      />
                    ) : (
                      <div className="product-media-gallery__video-placeholder">
                        <Play
                          className="product-media-gallery__placeholder-icon"
                          aria-hidden="true"
                        />
                      </div>
                    )}

                    <span
                      className="product-media-gallery__video-overlay"
                      aria-hidden="true"
                    >
                      <span className="product-media-gallery__video-icon">
                        <Play
                          className="product-media-gallery__play-icon"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </>
                )}

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="product-media-gallery__active-indicator"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            MAIN MEDIA
        ===================================================== */}

        <div className="product-media-gallery__main">
          <div className="product-media-gallery__frame">
            <div className="product-media-gallery__media">
              {activeMedia.type === "image" ? (
                <Image
                  src={activeMedia.src}
                  alt={
                    activeMedia.alt ?? product.name
                  }
                  fill
                  priority
                  className="product-media-gallery__main-image"
                  sizes="
                    (max-width: 1023px) 100vw,
                    (max-width: 1279px) 58vw,
                    60vw
                  "
                />
              ) : activeMedia.type === "video" ? (
                <video
                  src={activeMedia.src}
                  poster={activeMedia.poster}
                  controls
                  playsInline
                  className="product-media-gallery__main-video"
                />
              ) : activeMedia.type === "external-video" ? (
                <iframe
                  src={activeMedia.src}
                  title={
                    activeMedia.alt ?? product.name
                  }
                  className="product-media-gallery__main-iframe"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={activeMedia.src}
                  alt={
                    activeMedia.alt ?? product.name
                  }
                  fill
                  className="product-media-gallery__main-image"
                  sizes="
                    (max-width: 1023px) 100vw,
                    60vw
                  "
                />
              )}

              {/* =================================================
                  MEDIA VEIL
              ================================================= */}

              <span
                aria-hidden="true"
                className="product-media-gallery__veil"
              />

              {/* =================================================
                  FULLSCREEN
              ================================================= */}

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open product media fullscreen"
                className="product-media-gallery__fullscreen"
              >
                <Maximize2
                  className="product-media-gallery__fullscreen-icon"
                  aria-hidden="true"
                />
              </button>

              {/* =================================================
                  PREVIOUS / NEXT
              ================================================= */}

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrevious}
                    aria-label="Previous product media"
                    className="product-media-gallery__navigation product-media-gallery__navigation--previous"
                  >
                    <ChevronLeft
                      className="product-media-gallery__navigation-icon"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next product media"
                    className="product-media-gallery__navigation product-media-gallery__navigation--next"
                  >
                    <ChevronRight
                      className="product-media-gallery__navigation-icon"
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className="product-media-gallery__counter"
                    aria-live="polite"
                  >
                    {activeIndex + 1}
                    {" / "}
                    {media.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =====================================================
              MOBILE HINT
          ===================================================== */}

          {media.length > 1 && (
            <div className="product-media-gallery__mobile-meta">
              <span className="product-media-gallery__mobile-label">
                Product View
              </span>

              <span className="product-media-gallery__mobile-hint">
                Swipe or select an image
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      <ProductLightbox
        open={lightboxOpen}
        media={media}
        activeIndex={activeIndex}
        productName={product.name}
        onClose={() => setLightboxOpen(false)}
        onChange={(index) =>
          setActiveId(media[index].id)
        }
      />
    </>
  );
}