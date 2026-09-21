import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { HomepageInstagram } from "@/types/homepage";

import "./InstagramGallery.css";

interface InstagramGalleryProps {
  data: HomepageInstagram;
}

export function InstagramGallery({
  data,
}: InstagramGalleryProps) {
  const posts = data.posts
    .filter((post) => post.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id="instagram"
      className="instagram-gallery"
    >
      <Container>
        <div className="instagram-gallery__inner">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="instagram-gallery__header">
            <div className="instagram-gallery__heading">
              <p className="instagram-gallery__eyebrow">
                {data.eyebrow}
              </p>

              <h2 className="instagram-gallery__title">
                {data.title.lineOne}{" "}
                <span>
                  {data.title.lineTwo}
                </span>
              </h2>
            </div>

            <div className="instagram-gallery__meta">
              <p className="instagram-gallery__handle">
                {data.handle}
              </p>

              <span className="instagram-gallery__count">
                {String(posts.length).padStart(2, "0")}
              </span>
            </div>
          </header>

          {/* =========================================
              INSTAGRAM GRID
          ========================================= */}

          {posts.length > 0 && (
            <div className="instagram-gallery__grid">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={
                    post.href ||
                    data.instagramUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${post.alt} on Instagram`}
                  className="instagram-gallery__item"
                >
                  <div className="instagram-gallery__image-wrap">
                    <Image
                      src={post.src}
                      alt={post.alt}
                      fill
                      sizes="
                        (max-width: 639px) 44vw,
                        (max-width: 1023px) 30vw,
                        22vw
                      "
                      className="instagram-gallery__image"
                    />

                    <div
                      aria-hidden="true"
                      className="instagram-gallery__overlay"
                    />

                    <span
                      aria-hidden="true"
                      className="instagram-gallery__icon"
                    >
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.4}
                      />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* =========================================
              CTA
          ========================================= */}

          {data.instagramUrl && (
            <div className="instagram-gallery__footer">
              <Link
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-gallery__cta"
              >
                <span>{data.ctaLabel}</span>

                <span className="instagram-gallery__cta-icon">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.4}
                  />
                </span>
              </Link>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}