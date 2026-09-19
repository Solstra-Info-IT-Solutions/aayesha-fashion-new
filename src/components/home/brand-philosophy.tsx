import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";

export function BrandPhilosophy() {
  return (
    <section
      id="our-story"
      className="brand-philosophy"
    >
      <Container>
        <div className="brand-philosophy__inner">

          {/* Section Label */}
          <div className="brand-philosophy__label">
            <div className="brand-philosophy__label-group">
              <span
                className="brand-philosophy__label-line"
                aria-hidden="true"
              />

              <p className="brand-philosophy__eyebrow">
                The House of Ayesha
              </p>
            </div>

            <span className="brand-philosophy__number">
              01
            </span>
          </div>

          {/* Intro */}
          <div className="brand-philosophy__intro">
            <div className="brand-philosophy__intro-heading">
              <p className="brand-philosophy__section-eyebrow">
                Our Philosophy
              </p>

              <h2 className="brand-philosophy__title">
                Designed for
                <span className="brand-philosophy__title-line">
                  the woman who values
                </span>
                <span className="brand-philosophy__title-accent">
                  elegance.
                </span>
              </h2>
            </div>

            <div className="brand-philosophy__intro-description">
              <p>
                Ayesha is an expression of refined
                femininity. Thoughtfully selected
                silhouettes, graceful details, and
                timeless pieces created for moments
                that deserve to be remembered.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="brand-philosophy__story">

            {/* Image */}
            <div className="brand-philosophy__media">
              <div className="brand-philosophy__image-frame">
                <Image
                  src="/images/home/brand-philosophy.jpg"
                  alt="Ayesha Fashion's refined Indian fashion aesthetic"
                  width={1000}
                  height={1250}
                  className="brand-philosophy__image"
                  sizes="(max-width: 1023px) 100vw, 42vw"
                />
              </div>

              <div className="brand-philosophy__caption">
                <span>
                  Modern Indian Elegance
                </span>

                <span>
                  Ayesha
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="brand-philosophy__content">
              <div className="brand-philosophy__content-inner">

                <p className="brand-philosophy__paragraph">
                  We believe true elegance does not
                  ask for attention. It is felt in the
                  silhouette, seen in the details, and
                  remembered long after the moment
                  has passed.
                </p>

                <p className="brand-philosophy__paragraph">
                  Every Ayesha piece balances the
                  richness of Indian craft with the
                  ease of contemporary dressing,
                  creating a wardrobe that feels
                  personal, graceful, and enduring.
                </p>

                <div className="brand-philosophy__cta">
                  <Link
                    href="/our-story"
                    className="brand-philosophy__link"
                  >
                    <span>
                      Discover Our Story
                    </span>

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Statement */}
          <div className="brand-philosophy__statement">
            <p className="brand-philosophy__statement-meta">
              Refined · Feminine · Considered
            </p>

            <p className="brand-philosophy__statement-text">
              A study in timeless femininity
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}