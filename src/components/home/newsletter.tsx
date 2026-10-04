"use client";

import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";
import type { HomepageNewsletter } from "@/types/homepage";

import "./Newsletter.css";
import "./HomeCta.css";

interface NewsletterProps {
  data: HomepageNewsletter;
}

export function Newsletter({
  data,
}: NewsletterProps) {
  /*
   * Updates are delivered over WhatsApp: the visitor sends us a message, which is a real,
   * verifiable opt-in. (The previous email box did not send the address anywhere.)
   */
  const joinHref = `${siteConfig.social.whatsapp}?text=${encodeURIComponent(
    "Hi Aayesha Fashion, please add me to your Private Edit updates (new collections and offers).",
  )}`;

  return (
    <section
      id="newsletter"
      className="newsletter"
    >
      <Container>
        <div className="newsletter__inner">

          {/* =========================================
              INTRO
          ========================================= */}

          <div className="newsletter__intro">
            <p className="newsletter__eyebrow">
              Private Edit
            </p>

            <h2 className="newsletter__title">
              {data.title.lineOne}{" "}
              <span>
                {data.title.lineTwo}
              </span>
            </h2>

            <p className="newsletter__description">
              {data.description}
            </p>
          </div>

          {/* =========================================
              FORM
          ========================================= */}

          <div className="newsletter__form-wrapper">
            <a
              href={joinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="newsletter__button newsletter__button--link"
            >
              <MessageCircle
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Join on WhatsApp
            </a>

            <p className="newsletter__disclaimer">
              {data.disclaimer}
            </p>
          </div>

          {/* =========================================
              BRAND SIGN-OFF
          ========================================= */}

          <div className="newsletter__signoff">
            <span className="newsletter__signoff-label">
              Ayesha Fashion
            </span>

            <span className="newsletter__signoff-name">
              Ayesha
            </span>
          </div>

        </div>
      </Container>
    </section>
  );
}