import { MessageCircle } from "lucide-react";

import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

import "./HomeSales.css";

/** WhatsApp help for shoppers who want a recommendation before buying. */
export function StylistCta() {
  const message = "Hi Aayesha Fashion, I'd like help choosing an outfit.";

  return (
    <section className="home-stylist" aria-label="Chat with us">
      <Container>
        <div className="home-stylist__inner">
          <div>
            <p className="home-stylist__eyebrow">Not sure what to pick?</p>
            <h2>Chat with us on WhatsApp</h2>
            <p>
              Tell us the occasion and your budget and we will help you find
              the right piece.
            </p>
          </div>

          <a
            href={`https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            className="home-stylist__button"
          >
            <MessageCircle size={17} strokeWidth={1.6} />
            Start a chat
          </a>
        </div>
      </Container>
    </section>
  );
}
