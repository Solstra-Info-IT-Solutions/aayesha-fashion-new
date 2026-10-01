"use client";

import { useEffect, useState } from "react";

import "./BrandLoader.css";

interface BrandLoaderProps {
  /** Time the progress counter takes to reach 100%. */
  minimumDuration?: number;
}

const EXIT_HOLD_MS = 450;
const EXIT_FADE_MS = 650;

const WORD = "AAYESHA".split("");

export default function BrandLoader({
  minimumDuration = 2300,
}: BrandLoaderProps) {
  const [progress, setProgress] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();

    let frame = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (time: number) => {
      const raw = Math.min((time - start) / minimumDuration, 1);

      // ease-in-out so the counter feels deliberate
      const eased =
        raw < 0.5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      setProgress(Math.max(1, Math.round(eased * 100)));

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      holdTimer = setTimeout(() => {
        setLeaving(true);

        removeTimer = setTimeout(
          () => setVisible(false),
          EXIT_FADE_MS,
        );
      }, EXIT_HOLD_MS);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(holdTimer);
      clearTimeout(removeTimer);
    };
  }, [minimumDuration]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={
        leaving
          ? "aayesha-loader aayesha-loader--leaving"
          : "aayesha-loader"
      }
      role="status"
      aria-live="polite"
      aria-label="Loading Aayesha Fashion"
    >
      {/* Soft light behind the text */}
      <span className="aayesha-loader__halo" aria-hidden="true" />

      <span
        className="aayesha-loader__halo aayesha-loader__halo--core"
        aria-hidden="true"
      />

      {/* Editorial frame that draws itself in */}
      <span className="aayesha-loader__frame" aria-hidden="true" />

      <span
        className="aayesha-loader__corner aayesha-loader__corner--tl"
        aria-hidden="true"
      />
      <span
        className="aayesha-loader__corner aayesha-loader__corner--tr"
        aria-hidden="true"
      />
      <span
        className="aayesha-loader__corner aayesha-loader__corner--bl"
        aria-hidden="true"
      />
      <span
        className="aayesha-loader__corner aayesha-loader__corner--br"
        aria-hidden="true"
      />

      {/* Top meta row */}
      <header className="aayesha-loader__meta" aria-hidden="true">
        <span>AA</span>
        <span>Contemporary Indian Fashion</span>
        <span>2026</span>
      </header>

      {/* Side labels */}
      <span
        className="aayesha-loader__side aayesha-loader__side--left"
        aria-hidden="true"
      >
        AA / 01 Womenswear
      </span>

      <span
        className="aayesha-loader__side aayesha-loader__side--right"
        aria-hidden="true"
      >
        The Edit India
      </span>

      {/* Centre */}
      <div className="aayesha-loader__center">
        <p className="aayesha-loader__eyebrow">
          <span aria-hidden="true" />
          The New Edit
          <span aria-hidden="true" />
        </p>

        <h1 className="aayesha-loader__wordmark" aria-label="Aayesha Fashion">
          <span className="aayesha-loader__letters" aria-hidden="true">
            {WORD.map((letter, index) => (
              <span
                key={index}
                style={{ animationDelay: `${0.35 + index * 0.08}s` }}
              >
                {letter}
              </span>
            ))}
          </span>

          <span className="aayesha-loader__sub" aria-hidden="true">
            Fashion
          </span>
        </h1>

        <span className="aayesha-loader__rule" aria-hidden="true" />

        <p className="aayesha-loader__tagline">
          Made for moments worth remembering.
        </p>

        <div className="aayesha-loader__loading" aria-hidden="true">
          <div className="aayesha-loader__loading-top">
            <span>Curating the collection</span>
            <span className="aayesha-loader__percent">{progress}%</span>
          </div>

          <div className="aayesha-loader__track">
            <span
              className="aayesha-loader__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <p className="aayesha-loader__brand" aria-hidden="true">
        Aayesha Fashion
      </p>
    </div>
  );
}
