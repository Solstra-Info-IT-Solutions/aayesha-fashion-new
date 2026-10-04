"use client";

import { useEffect, useState } from "react";

import BrandIntro from "./BrandIntro";
import BrandLoader from "./BrandLoader";
import OccasionChooser from "./OccasionChooser";

import "./SplashGate.css";

/**
 * The runway film + brand reveal IS the loader: it plays on every full page load (a hard
 * refresh, a reload, opening the site in a new tab). Moving between pages inside the site never
 * replays it, because this component lives in the root layout and is not re-mounted.
 *
 * Visitors who prefer reduced motion, have data-saver on or are on a 2G connection get the
 * standard loader instead. Add ?intro=0 to the address to skip the film (handy while developing).
 */

type Choice = "pending" | "intro" | "occasion" | "loader" | "none";

function decide(): Choice {
  try {
    const params = new URLSearchParams(window.location.search);

    if (params.get("intro") === "0") return "loader";

    if (params.get("intro") === "1") return "intro";

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

    return "intro";
  } catch {
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
    // On the home page the film leads into the "Where would you like to begin?" cards; on any other page
    // (a shared product link, say) it simply fades out into the page that was asked for.
    const onHome = window.location.pathname === "/";

    return (
      <BrandIntro
        onDone={() => setChoice(onHome ? "occasion" : "none")}
        handOff={onHome}
      />
    );
  }

  if (choice === "occasion") {
    return <OccasionChooser onDone={() => setChoice("none")} />;
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
