import {
  Heart,
  Gem,
  Sparkles,
  Scissors,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import type {
  HomepageWhyChooseUs,
  HomepageWhyChooseUsValue,
} from "@/types/homepage";

import "./WhyChooseUs.css";

interface WhyChooseUsProps {
  data: HomepageWhyChooseUs;
}

const iconMap = {
  scissors: Scissors,
  gem: Gem,
  heart: Heart,
  sparkles: Sparkles,
} as const;

function getIcon(
  icon: HomepageWhyChooseUsValue["icon"],
) {
  return iconMap[icon];
}

export function WhyChooseUs({
  data,
}: WhyChooseUsProps) {
  const values = data.values
    .filter((value) => value.isActive)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

  return (
    <section
      id="why-ayesha"
      className="why-choose-us"
    >
      <Container>
        <div className="why-choose-us__inner">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="why-choose-us__header">
            <p className="why-choose-us__eyebrow">
              The Aayesha Difference
            </p>

            <h2 className="why-choose-us__title">
              {data.title}
            </h2>

            <p className="why-choose-us__description">
              {data.description}
            </p>
          </header>

          {/* =========================================
              VALUES
          ========================================= */}

          {values.length > 0 && (
            <div className="why-choose-us__values">
              {values.map((value, index) => {
                const Icon = getIcon(value.icon);

                return (
                  <article
                    key={value.id}
                    className="why-choose-us__value"
                  >
                    <div className="why-choose-us__top">
                      <span className="why-choose-us__number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="why-choose-us__icon">
                        <Icon
                          size={18}
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="why-choose-us__value-content">
                      <h3 className="why-choose-us__value-title">
                        {value.title}
                      </h3>

                      <p className="why-choose-us__value-description">
                        {value.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* =========================================
              CLOSING STATEMENT
          ========================================= */}

          {data.closingStatement && (
            <div className="why-choose-us__closing">
              <p className="why-choose-us__closing-text">
                {data.closingStatement}
              </p>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}