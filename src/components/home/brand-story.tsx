import Image from "next/image";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";
import type { HomepageBrandStory } from "@/types/homepage";

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
    >
      <Container>
        <div className="brand-story__inner">

          {/* Main Content */}
          <div className="brand-story__grid">

            {/* Content */}
            <div className="brand-story__content">

              <p className="brand-story__eyebrow">
                The House of Ayesha
              </p>

              <h2 className="brand-story__title">
                {data.title}
              </h2>

              <div className="brand-story__descriptions">
                {data.descriptions.map(
                  (description, index) => (
                    <p
                      key={`${index}-${description}`}
                      className="brand-story__description"
                    >
                      {description}
                    </p>
                  ),
                )}
              </div>

              {data.ctaLabel &&
                data.ctaHref && (
                  <div className="brand-story__cta">
                    <LinkButton
                      href={data.ctaHref}
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

            {/* Image */}
            <div className="brand-story__media">
              <div className="brand-story__image-frame">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  width={1200}
                  height={1500}
                  className="brand-story__image"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
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
          </div>

          {/* Statement */}
          {data.statement && (
            <div className="brand-story__statement">
              <p className="brand-story__statement-text">
                {data.statement}
              </p>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}