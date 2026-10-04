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
 * Timeline (ms from the moment playback starts)
 *   0      runway film plays (about 5 s)
 *   4300   film fades to obsidian
 *   5900   AAYESHA FASHION is revealed (one champagne shimmer)
 *   7500   ELEGANCE IN EVERY DETAIL is revealed
 *   10400  hold ends, the whole screen fades into the site
 */
const FILM_FADE_AT = 4300;
const BRAND_AT = 5900;
const TAGLINE_AT = 7500;
const EXIT_AT = 10400;
const EXIT_FADE_MS = 900;

/** If the film has not started playing by then, skip straight to the brand reveal. */
const FILM_START_TIMEOUT = 3500;

export default function BrandIntro({ onDone, handOff = false }: BrandIntroProps) {
  const [phase, setPhase] = useState<"film" | "brand" | "tagline">("film");
  const [filmFaded, setFilmFaded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);
  const finished = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = useCallback(() => {
    if (finished.current) return;

    finished.current = true;
    clearTimers();

    if (handOff) {
      onDone();

      return;
    }

    setLeaving(true);

    timers.current.push(setTimeout(onDone, EXIT_FADE_MS));
  }, [onDone, handOff]);

  /** Starts the timeline. `withFilm` is false when the film could not play. */
  const run = useCallback(
    (withFilm: boolean) => {
      if (started.current) return;

      started.current = true;
      clearTimers();

      if (!withFilm) {
        // Never let a late-starting film play underneath the brand reveal.
        videoRef.current?.pause();
        setFilmFaded(true);
      }

      const offset = withFilm ? 0 : BRAND_AT - 500;
      const at = (ms: number, fn: () => void) =>
        timers.current.push(setTimeout(fn, Math.max(0, ms - offset)));

      if (withFilm) at(FILM_FADE_AT, () => setFilmFaded(true));

      at(BRAND_AT, () => {
        setFilmFaded(true);
        setPhase("brand");
      });
      at(TAGLINE_AT, () => setPhase("tagline"));
      at(EXIT_AT, finish);
    },
    [finish],
  );

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;

    root.style.overflow = "hidden";

    const video = videoRef.current;

    // If playback never starts (blocked, slow, unsupported codec) go straight to the reveal.
    const guard = setTimeout(() => {
      if (!started.current) run(false);
    }, FILM_START_TIMEOUT);

    if (video) {
      video.play().catch((error: unknown) => {
        // AbortError just means the browser restarted loading (for example it moved on to the
        // next <source>); the "playing" event or the timeout below handles that case.
        if (error instanceof Error && error.name === "AbortError") return;

        run(false);
      });
    } else {
      run(false);
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(guard);
      clearTimers();
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [run, finish]);

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
      <video
        ref={videoRef}
        autoPlay
        className={
          filmFaded
            ? "brand-intro__film brand-intro__film--faded"
            : "brand-intro__film"
        }
        poster="/intro/aayesha-intro-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => run(true)}
        onError={(event) => {
          // Errors from an individual <source> bubble here too; only a real media error counts.
          if (event.currentTarget.error) run(false);
        }}
      >
        <source
          src="/intro/aayesha-intro-720.mp4"
          type="video/mp4"
          media="(max-width: 900px)"
        />
        <source src="/intro/aayesha-intro.mp4" type="video/mp4" />
        <source src="/intro/aayesha-intro-720.webm" type="video/webm" />
      </video>

      {/* Soft edge darkening so the film sits inside the obsidian frame */}
      <span className="brand-intro__vignette" aria-hidden="true" />

      <div className="brand-intro__brand">
        <h1
          className={
            phase === "film"
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
