import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { getPromotionalBanner } from "@/services/marketing.service";

import { Container } from "@/components/shared/container";

import "./PromotionalBanner.css";

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
      aria-label="Aayesha promotion"
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

        {/* =================================================
            EDITORIAL OVERLAY
        ================================================= */}

        <div
          aria-hidden="true"
          className="promotional-banner__overlay"
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        {data.href && data.ctaLabel && (
          <Container className="promotional-banner__container">
            <div className="promotional-banner__content">
              <Link
                href={data.href}
                className="promotional-banner__button"
              >
                <span>
                  {data.ctaLabel}
                </span>

                <span className="promotional-banner__button-icon">
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.3}
                  />
                </span>
              </Link>
            </div>
          </Container>
        )}

        {/* =================================================
            BRAND MARK
        ================================================= */}

        <span
          className="promotional-banner__brand"
          aria-hidden="true"
        >
          AAYESHA
        </span>
      </div>
    </section>
  );
}