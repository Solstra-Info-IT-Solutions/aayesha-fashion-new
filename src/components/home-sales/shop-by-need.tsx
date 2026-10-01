import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getLandingPage } from "@/config/landing-pages";
import { Container } from "@/components/shared/container";

import "./HomeSales.css";

/** Shopping intents → SEO landing pages (also strong internal links). */
const picks = [
  { slug: "festive-wear-for-women", label: "Festive wear" },
  { slug: "wedding-guest-outfits", label: "Wedding guest" },
  { slug: "sharara-sets-online", label: "Sharara sets" },
  { slug: "lehenga-sets-online", label: "Lehengas" },
  { slug: "ethnic-wear-under-3000", label: "Under ₹3,000" },
  { slug: "ethnic-wear-under-5000", label: "Under ₹5,000" },
] as const;

export function ShopByNeed() {
  const tiles = picks.filter((pick) => getLandingPage(pick.slug));

  return (
    <section className="home-need" aria-label="Shop by need">
      <Container>
        <header className="home-need__header">
          <p className="home-need__eyebrow">Find it faster</p>
          <h2>Shop by occasion &amp; budget</h2>
        </header>

        <ul className="home-need__grid">
          {tiles.map((tile) => (
            <li key={tile.slug}>
              <Link href={`/shop/${tile.slug}`}>
                <span>{tile.label}</span>
                <ArrowRight size={16} strokeWidth={1.4} />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
