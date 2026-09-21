import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { HomepageBrandStory } from "@/types/homepage";

import "./BrandStory.css";

interface BrandStoryProps {
  data: HomepageBrandStory;
}

export function BrandStory({
  data,
}: BrandStoryProps) {
  return (
    <section
      id="brand-story"
      className="brand-story"
      aria-labelledby="brand-story-title"
    >
      <Container>
        <div className="brand-story__inner">

          {/* =================================================
              EDITORIAL LABEL
          ================================================= */}

          <div className="brand-story__topline">
            <span className="brand-story__topline-line" />

            <p className="brand-story__eyebrow">
              The House of Ayesha
            </p>

            <span className="brand-story__topline-line" />
          </div>

          {/* =================================================
              MAIN STORY
          ================================================= */}

          <div className="brand-story__grid">

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="brand-story__media">
              <div className="brand-story__image-frame">

                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  width={1200}
                  height={1500}
                  className="brand-story__image"
                  sizes="
                    (max-width: 767px) 100vw,
                    (max-width: 1023px) 55vw,
                    48vw
                  "
                />

                <div
                  className="brand-story__image-overlay"
                  aria-hidden="true"
                />

                <span className="brand-story__image-number">
                  01
                </span>

                <span className="brand-story__image-label">
                  AAYESHA
                </span>
              </div>

              <div className="brand-story__caption">
                <p className="brand-story__caption-text">
                  {data.caption}
                </p>

                <p className="brand-story__brand-label">
                  {data.brandLabel}
                </p>
              </div>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="brand-story__content">

              <p className="brand-story__content-eyebrow">
                Our story
              </p>

              <h2
                id="brand-story-title"
                className="brand-story__title"
              >
                {data.title}
              </h2>

              <div className="brand-story__rule" />

              <div className="brand-story__descriptions">
                {data.descriptions.map(
                  (description, index) => (
                    <p
                      key={`${index}-${description}`}
                      className={
                        index === 0
                          ? "brand-story__description brand-story__description--lead"
                          : "brand-story__description"
                      }
                    >
                      {description}
                    </p>
                  ),
                )}
              </div>

              {/* =================================================
                  BOXED CTA
              ================================================= */}

              {data.ctaLabel &&
                data.ctaHref && (
                  <div className="brand-story__cta">
                    <Link
                      href={data.ctaHref}
                      className="brand-story__cta-link"
                    >
                      <span className="brand-story__cta-label">
                        {data.ctaLabel}
                      </span>

                      <span className="brand-story__cta-icon">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.3}
                        />
                      </span>
                    </Link>
                  </div>
                )}

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}