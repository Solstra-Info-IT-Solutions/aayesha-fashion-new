"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./BrandIntro.css";

interface BrandIntroProps {
  /** Called once the intro has fully faded out (or was skipped). */
  onDone: () => void;
  /** True when another full-screen step follows; skips the fade so the site never shows through. */
  handOff?: boolean;
}

/*
 * Timeline (ms)
 *   600    AAYESHA FASHION is revealed (one champagne shimmer)
 *   2200   ELEGANCE IN EVERY DETAIL is revealed
 *   5000   hold ends and the next step (or the site) takes over
 */
const BRAND_AT = 600;
const TAGLINE_AT = 2200;
const EXIT_AT = 5000;
const EXIT_FADE_MS = 900;

export default function BrandIntro({
  onDone,
  handOff = false,
}: BrandIntroProps) {
  const [phase, setPhase] = useState<"wait" | "brand" | "tagline">("wait");
  const [leaving, setLeaving] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;

    finished.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (handOff) {
      onDone();

      return;
    }

    setLeaving(true);

    timers.current.push(setTimeout(onDone, EXIT_FADE_MS));
  }, [onDone, handOff]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;

    root.style.overflow = "hidden";

    const pending = timers.current;

    pending.push(setTimeout(() => setPhase("brand"), BRAND_AT));
    pending.push(setTimeout(() => setPhase("tagline"), TAGLINE_AT));
    pending.push(setTimeout(finish, EXIT_AT));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      pending.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [finish]);

  return (
    <div
      className={
        leaving
          ? "brand-intro brand-intro--leaving"
          : "brand-intro"
      }
      role="dialog"
      aria-modal="true"
      aria-label="Aayesha Fashion introduction"
    >
      <div className="brand-intro__brand">
        <h1
          className={
            phase === "wait"
              ? "brand-intro__name"
              : "brand-intro__name brand-intro__name--in"
          }
        >
          <span className="brand-intro__shimmer">AAYESHA FASHION</span>
        </h1>

        <span
          className={
            phase === "tagline"
              ? "brand-intro__rule brand-intro__rule--in"
              : "brand-intro__rule"
          }
          aria-hidden="true"
        />

        <p
          className={
            phase === "tagline"
              ? "brand-intro__tagline brand-intro__tagline--in"
              : "brand-intro__tagline"
          }
        >
          Elegance in every detail
        </p>
      </div>

      <button
        type="button"
        className="brand-intro__skip"
        onClick={finish}
      >
        Skip
      </button>
    </div>
  );
}
