"use client";

import { useEffect, useState } from "react";

import BrandIntro from "./BrandIntro";
import BrandLoader from "./BrandLoader";

import "./SplashGate.css";

/**
 * Chooses what the visitor sees first.
 *  - First visit (once per browser until the key is cleared): the runway film and brand reveal.
 *  - Everyone else, reduced-motion visitors and slow / data-saver connections: the standard loader.
 * Add ?intro=1 to the address to force the film again (handy for demos).
 */

const KEY = "aayesha:intro:v1";

type Choice = "pending" | "intro" | "loader" | "none";

function decide(): Choice {
  try {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get("intro") === "1";

    if (!forced) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return "loader";
      }

      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;

      if (
        connection?.saveData ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g"
      ) {
        return "loader";
      }

      if (window.localStorage.getItem(KEY)) return "loader";
    }

    window.localStorage.setItem(KEY, String(Date.now()));

    return "intro";
  } catch {
    // Storage blocked: never loop the film, use the standard loader.
    return "loader";
  }
}

export default function SplashGate() {
  const [choice, setChoice] = useState<Choice>("pending");

  useEffect(() => {
    const next = decide();

    // Deferred so the first render never sets state synchronously inside the effect.
    const timer = window.setTimeout(() => setChoice(next), 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (choice === "intro") {
    return <BrandIntro onDone={() => setChoice("none")} />;
  }

  if (choice === "loader") {
    return <BrandLoader />;
  }

  if (choice === "none") {
    return null;
  }

  // Before the client decides, cover the page with the same obsidian screen so nothing flashes.
  return <div className="splash-gate" aria-hidden="true" />;
}
