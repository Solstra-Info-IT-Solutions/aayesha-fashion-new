"use client";

import { useEffect, useState } from "react";
import "./BrandLoader.css";

interface BrandLoaderProps {
  minimumDuration?: number;
}

export default function BrandLoader({
  minimumDuration = 4200,
}: BrandLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const startDelay = 500;
    const startTime = performance.now() + startDelay;

    let frame: number;
    let exitTimer: ReturnType<typeof setTimeout>;

    const animate = (time: number) => {
      // Small initial delay
      if (time < startTime) {
        setProgress(1);
        frame = requestAnimationFrame(animate);
        return;
      }

      const elapsed = time - startTime;

      const rawProgress = Math.min(
        elapsed / minimumDuration,
        1
      );

      // Smooth 1 → 100 progression
      const easedProgress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 -
            Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentProgress = Math.max(
        1,
        Math.min(
          100,
          Math.round(easedProgress * 100)
        )
      );

      setProgress(currentProgress);

      if (rawProgress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setProgress(100);

        // Hold at 100% before closing
        exitTimer = setTimeout(() => {
          setIsLoading(false);
        }, 1100);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
    };
  }, [minimumDuration]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="aayesha-loader">
      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div
        className="aayesha-loader__texture"
        aria-hidden="true"
      />

      <div
        className="aayesha-loader__light"
        aria-hidden="true"
      />

      <div
        className="aayesha-loader__light-second"
        aria-hidden="true"
      />

      {/* =====================================================
          EDITORIAL FRAME
      ===================================================== */}

      <div
        className="aayesha-loader__outer-frame"
        aria-hidden="true"
      />

      <div
        className="aayesha-loader__inner-frame"
        aria-hidden="true"
      />

      {/* =====================================================
          TOP METADATA
      ===================================================== */}

      <header className="aayesha-loader__header">
        <span>AA</span>

        <span>
          CONTEMPORARY INDIAN FASHION
        </span>

        <span>2026</span>
      </header>

      {/* =====================================================
          MAIN BRAND SHOWCASE
      ===================================================== */}

      <main className="aayesha-loader__center">
        <div className="aayesha-loader__collection">
          THE NEW EDIT
        </div>

        {/* ===================================================
            BRAND WORDMARK
        =================================================== */}

        <div className="aayesha-loader__wordmark-wrap">
          <h1 className="aayesha-loader__wordmark">
            AAYESHA
          </h1>

          <span
            className="aayesha-loader__logo-light"
            aria-hidden="true"
          />
        </div>

        {/* ===================================================
            BRAND DIVIDER
        =================================================== */}

        <div className="aayesha-loader__brand-rule">
          <span />
        </div>

        {/* ===================================================
            TAGLINE
        =================================================== */}

        <p className="aayesha-loader__tagline">
          Made for moments worth remembering.
        </p>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="aayesha-loader__loading">
          <div className="aayesha-loader__loading-top">
            <span>
              CURATING THE COLLECTION
            </span>

            <span className="aayesha-loader__progress-number">
              {progress}%
            </span>
          </div>

          <div
            className="aayesha-loader__progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Loading collection"
          >
            <div
              className="aayesha-loader__progress-bar"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </main>

      {/* =====================================================
          SIDE EDITORIAL INFORMATION
      ===================================================== */}

      <div
        className="
          aayesha-loader__vertical
          aayesha-loader__vertical--left
        "
      >
        AA / 01 WOMENSWEAR
      </div>

      <div
        className="
          aayesha-loader__vertical
          aayesha-loader__vertical--right
        "
      >
        THE EDIT INDIA
      </div>

      {/* =====================================================
          BOTTOM BRAND
      ===================================================== */}

      <div className="aayesha-loader__bottom-brand">
        AAYESHA FASHION
      </div>

      {/* =====================================================
          CORNER DETAILS
      ===================================================== */}

      <span
        className="
          aayesha-loader__corner
          aayesha-loader__corner--tl
        "
        aria-hidden="true"
      />

      <span
        className="
          aayesha-loader__corner
          aayesha-loader__corner--tr
        "
        aria-hidden="true"
      />

      <span
        className="
          aayesha-loader__corner
          aayesha-loader__corner--bl
        "
        aria-hidden="true"
      />

      <span
        className="
          aayesha-loader__corner
          aayesha-loader__corner--br
        "
        aria-hidden="true"
      />

      {/* =====================================================
          FINAL REVEAL STATE
      ===================================================== */}

      <div
        className={`aayesha-loader__final-reveal ${
          progress >= 100
            ? "aayesha-loader__final-reveal--complete"
            : ""
        }`}
        aria-hidden="true"
      />
    </div>
  );
}