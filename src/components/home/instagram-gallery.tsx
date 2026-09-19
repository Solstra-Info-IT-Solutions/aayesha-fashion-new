import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import type { HomepageInstagram } from "@/types/homepage";

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
    <section id="instagram" className="instagram-gallery">
      <Container>
        <div className="instagram-gallery__inner">
          {/* HEADER */}
          <div className="instagram-gallery__top">
            <div className="instagram-gallery__eyebrow">
              <span
                aria-hidden="true"
                className="instagram-gallery__eyebrow-line"
              />

              <p className="instagram-gallery__eyebrow-text">
                {data.eyebrow}
              </p>
            </div>

            <span className="instagram-gallery__count">
              {String(posts.length).padStart(2, "0")}
            </span>
          </div>

          {/* TITLE */}
          <div className="instagram-gallery__heading">
            <h2 className="instagram-gallery__title">
              {data.title.lineOne}{" "}
              <span className="instagram-gallery__title-accent">
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="instagram-gallery__handle">
              {data.handle}
            </p>
          </div>

          {/* INSTAGRAM GRID */}
          {posts.length > 0 && (
            <div className="instagram-gallery__grid">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.href || data.instagramUrl}
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
                      ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* CTA */}
          {data.instagramUrl && (
            <div className="instagram-gallery__cta">
              <LinkButton
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
                icon={
                  <span aria-hidden="true">
                    ↗
                  </span>
                }
              >
                {data.ctaLabel}
              </LinkButton>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}