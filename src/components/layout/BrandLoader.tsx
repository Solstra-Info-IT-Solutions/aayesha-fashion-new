"use client";

import { useEffect, useState } from "react";

import "./BrandLoader.css";

interface BrandLoaderProps {
  /** Time the progress counter takes to reach 100%. */
  minimumDuration?: number;
}

const EXIT_HOLD_MS = 350;
const EXIT_FADE_MS = 550;

export default function BrandLoader({
  minimumDuration = 1900,
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

      // ease-out so the counter settles smoothly at 100
      const eased = 1 - Math.pow(1 - raw, 3);

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
      {/* Vertical glow line travelling left → right */}
      <span
        className="aayesha-loader__glow"
        aria-hidden="true"
      />

      <div className="aayesha-loader__center">
        <p className="aayesha-loader__eyebrow">
          Contemporary Indian Fashion
        </p>

        <h1 className="aayesha-loader__wordmark">
          AAYESHA
          <span>FASHION</span>
        </h1>

        <p className="aayesha-loader__tagline">
          Made for moments worth remembering.
        </p>
      </div>

      <p
        className="aayesha-loader__progress"
        aria-hidden="true"
      >
        {progress}%
      </p>
    </div>
  );
}
