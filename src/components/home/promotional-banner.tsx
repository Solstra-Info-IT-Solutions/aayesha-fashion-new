import Image from "next/image";

import { getPromotionalBanner } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

export async function PromotionalBanner() {
  const campaign = await getPromotionalBanner();

  if (!campaign) {
    return null;
  }

  const data = campaign.metadata;

  return (
    <section
      id="promotion"
      className="promotional-banner"
    >
      <div className="promotional-banner__media">
        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="100vw"
          className="promotional-banner__image"
          priority={false}
        />

        {/* Subtle image protection */}
        <div
          aria-hidden="true"
          className="promotional-banner__overlay"
        />

        {/* CTA */}
        {data.href && data.ctaLabel && (
          <Container className="promotional-banner__container">
            <div className="promotional-banner__content">
              <LinkButton
                href={data.href}
                variant="secondary"
                size="md"
                icon={
                  <span aria-hidden="true">
                    ↗
                  </span>
                }
                className="promotional-banner__button"
              >
                {data.ctaLabel}
              </LinkButton>
            </div>
          </Container>
        )}
      </div>
    </section>
  );
}