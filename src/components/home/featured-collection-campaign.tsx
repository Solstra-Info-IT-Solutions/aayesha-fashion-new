import Image from "next/image";

import { getFeaturedCollectionCampaign } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

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
    >
      {/* Campaign */}
      <div className="featured-collection__hero">

        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="100vw"
          className="featured-collection__image"
          priority={false}
        />

        {/* Image Overlay */}
        <div
          className="featured-collection__overlay featured-collection__overlay--horizontal"
          aria-hidden="true"
        />

        <div
          className="featured-collection__overlay featured-collection__overlay--vertical"
          aria-hidden="true"
        />

        {/* Content */}
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
                {formatCampaignTitle(data.title)}
              </h2>

              {/* Description */}
              <p className="featured-collection__description">
                {data.description}
              </p>

              {/* CTA */}
              <div className="featured-collection__cta">
                <LinkButton
                  href={data.ctaHref}
                  variant="darkOutline"
                  size="lg"
                  icon={
                    <span
                      aria-hidden="true"
                      className="featured-collection__cta-icon"
                    >
                      ↗
                    </span>
                  }
                >
                  {data.ctaLabel}
                </LinkButton>
              </div>

            </div>
          </div>
        </Container>

        {/* Brand Label */}
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
      </div>

      {/* Bottom Strip */}
      <div className="featured-collection__strip">
        <Container>
          <div className="featured-collection__strip-inner">
            <p className="featured-collection__strip-label">
              {data.bottomLabel}
            </p>

            <p className="featured-collection__strip-title">
              {data.bottomTitle}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}


/* =========================================================
   TITLE FORMATTER
========================================================= */

function formatCampaignTitle(title: string) {
  const words = title.trim().split(/\s+/);

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

      <span className="featured-collection__title-accent">
        {lastWord}
      </span>
    </>
  );
}