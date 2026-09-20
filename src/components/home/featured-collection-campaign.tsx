import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { getFeaturedCollectionCampaign } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";

import "./FeaturedCollectionCampaign.css";

export async function FeaturedCollectionCampaign() {
  const campaign =
    await getFeaturedCollectionCampaign();

  if (!campaign) {
    return null;
  }

  const data = campaign.metadata;

  return (
    <section
      id="featured-collection"
      className="featured-collection"
      aria-label={data.title}
    >
      {/* =====================================================
          CAMPAIGN HERO
      ===================================================== */}

      <div className="featured-collection__hero">
        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="100vw"
          className="featured-collection__image"
          priority={false}
        />

        {/* ===================================================
            EDITORIAL OVERLAYS
        =================================================== */}

        <div
          className="featured-collection__overlay"
          aria-hidden="true"
        />

        <div
          className="featured-collection__bottom-fade"
          aria-hidden="true"
        />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <Container className="featured-collection__container">
          <div className="featured-collection__content">
            <div className="featured-collection__content-inner">

              {/* Eyebrow */}

              <div className="featured-collection__eyebrow">
                <span
                  className="featured-collection__eyebrow-line"
                  aria-hidden="true"
                />

                <p>
                  {data.eyebrow}
                </p>
              </div>

              {/* Heading */}

              <h2 className="featured-collection__title">
                {formatCampaignTitle(
                  data.title,
                )}
              </h2>

              {/* Description */}

              <p className="featured-collection__description">
                {data.description}
              </p>

              {/* CTA */}

              <div className="featured-collection__cta">
                <Link
                  href={data.ctaHref}
                  className="featured-collection__cta-link"
                >
                  <span>
                    {data.ctaLabel}
                  </span>

                  <span className="featured-collection__cta-icon">
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.3}
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>

        {/* ===================================================
            BRAND LABEL
        =================================================== */}

        <div className="featured-collection__brand-label">
          <div className="featured-collection__brand-label-inner">
            <span>
              {data.brandLabel}
            </span>

            <span
              className="featured-collection__brand-line"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ===================================================
            CAMPAIGN INDEX
        =================================================== */}

        <span
          className="featured-collection__index"
          aria-hidden="true"
        >
          02
        </span>
      </div>

      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}

      <div className="featured-collection__strip">
        <Container>
          <div className="featured-collection__strip-inner">
            <p className="featured-collection__strip-label">
              {data.bottomLabel}
            </p>

            <p className="featured-collection__strip-title">
              {data.bottomTitle}
            </p>

            <span
              className="featured-collection__strip-mark"
              aria-hidden="true"
            >
              AAYESHA
            </span>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* =========================================================
   TITLE FORMATTER
========================================================= */

function formatCampaignTitle(
  title: string,
) {
  const words =
    title.trim().split(/\s+/);

  if (words.length <= 1) {
    return (
      <span className="featured-collection__title-accent">
        {title}
      </span>
    );
  }

  const lastWord = words.pop();

  return (
    <>
      {words.join(" ")}

      {" "}

      <span className="featured-collection__title-accent">
        {lastWord}
      </span>
    </>
  );
}