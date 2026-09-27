 "use client";

import { useEffect, useState } from "react";

import "./BrandLoader.css";

type BrandLoaderProps = {
  onComplete?: () => void;
};

export function BrandLoader({
  onComplete,
}: BrandLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const updateProgress = () => {
      if (cancelled) {
        return;
      }

      const elapsed = Date.now() - startedAt;

      /*
       * Smooth visual progress. The loader should feel fast
       * without artificially holding the page for too long.
       */
      const nextProgress = Math.min(
        100,
        Math.round(
          100 *
            (1 -
              Math.exp(-elapsed / 650)),
        ),
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        setComplete(true);

        window.setTimeout(() => {
          if (!cancelled) {
            onComplete?.();
          }
        }, 450);

        return;
      }

      window.requestAnimationFrame(updateProgress);
    };

    const frame =
      window.requestAnimationFrame(
        updateProgress,
      );

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [onComplete]);

  return (
    <div
      className="aayesha-loader"
      aria-label="Aayesha Fashion loading"
      role="status"
      aria-live="polite"
    >
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

      <div
        className="aayesha-loader__outer-frame"
        aria-hidden="true"
      />

      <div
        className="aayesha-loader__inner-frame"
        aria-hidden="true"
      />

      <div className="aayesha-loader__header">
        <span>AAYESHA</span>
        <span>FASHION</span>
      </div>

      <div className="aayesha-loader__center">
        <div className="aayesha-loader__collection">
          <span className="aayesha-loader__collection-line" />
          <span>THE COLLECTION</span>
          <span className="aayesha-loader__collection-line" />
        </div>

        <div className="aayesha-loader__wordmark-wrap">
          <h1 className="aayesha-loader__wordmark">
            Aayesha
          </h1>

          <span
            className="aayesha-loader__logo-light"
            aria-hidden="true"
          />
        </div>

        <div className="aayesha-loader__brand-rule">
          <span />
        </div>

        <p className="aayesha-loader__tagline">
          The art of elegance.
        </p>

        <div className="aayesha-loader__loading">
          <div className="aayesha-loader__loading-top">
            <span>LOADING COLLECTION</span>
            <span>
              {String(progress).padStart(2, "0")}%
            </span>
          </div>

          <div
            className="aayesha-loader__progress-track"
            aria-hidden="true"
          >
            <div
              className="aayesha-loader__progress-bar"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="aayesha-loader__loading-bottom">
            <span>CURATING YOUR EXPERIENCE</span>
            <span>
              {complete
                ? "READY"
                : "PLEASE WAIT"}
            </span>
          </div>
        </div>
      </div>

      <div
        className="aayesha-loader__vertical aayesha-loader__vertical--left"
        aria-hidden="true"
      >
        <span>AAYESHA</span>
        <span>EST. 2024</span>
      </div>

      <div
        className="aayesha-loader__vertical aayesha-loader__vertical--right"
        aria-hidden="true"
      >
        <span>FASHION</span>
        <span>INDIA</span>
      </div>

      <div className="aayesha-loader__bottom-brand">
        <span className="aayesha-loader__bottom-rule" />
        <span>AAYESHA FASHION</span>
        <span className="aayesha-loader__bottom-rule" />
      </div>

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

      <div
        className={[
          "aayesha-loader__final-reveal",
          complete
            ? "aayesha-loader__final-reveal--complete"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}

export default BrandLoader;
