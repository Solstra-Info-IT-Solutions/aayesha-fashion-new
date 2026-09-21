"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./BrandLoader.css";

interface BrandLoaderProps {
  minimumDuration?: number;
}

export default function BrandLoader({
  minimumDuration = 1800,
}: BrandLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    let timeout: ReturnType<typeof setTimeout>;

    const animate = (time: number) => {
      const elapsed = time - start;

      const rawProgress = Math.min(
        elapsed / minimumDuration,
        1,
      );

      /*
       * Cinematic progress curve.
       * Moves quickly through the opening,
       * then deliberately slows toward completion.
       */
      const easedProgress =
        rawProgress < 0.58
          ? rawProgress * 1.12
          : 0.6496 +
            (rawProgress - 0.58) * 0.838;

      const nextProgress = Math.min(
        100,
        Math.round(easedProgress * 100),
      );

      setProgress(nextProgress);

      if (elapsed < minimumDuration) {
        frame = requestAnimationFrame(animate);
      } else {
        setProgress(100);

        timeout = setTimeout(() => {
          setIsLoading(false);
        }, 420);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [minimumDuration]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="aayesha-loader"
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.015,
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* =================================================
              BACKGROUND ATMOSPHERE
          ================================================= */}

          <div
            aria-hidden="true"
            className="aayesha-loader__wash"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__grain"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__light"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__orb aayesha-loader__orb--one"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__orb aayesha-loader__orb--two"
          />

          {/* =================================================
              EDITORIAL FRAME
          ================================================= */}

          <div
            aria-hidden="true"
            className="aayesha-loader__frame"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__frame-inner"
          />

          {/* =================================================
              DECORATIVE PANELS
          ================================================= */}

          <motion.div
            aria-hidden="true"
            className="aayesha-loader__panel aayesha-loader__panel--left"
            initial={{
              scaleY: 1,
            }}
            animate={{
              scaleY: 0,
            }}
            transition={{
              duration: 1.25,
              delay: 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
          />

          <motion.div
            aria-hidden="true"
            className="aayesha-loader__panel aayesha-loader__panel--right"
            initial={{
              scaleY: 1,
            }}
            animate={{
              scaleY: 0,
            }}
            transition={{
              duration: 1.35,
              delay: 0.05,
              ease: [0.76, 0, 0.24, 1],
            }}
          />

          {/* =================================================
              CENTER CONTENT
          ================================================= */}

          <div className="aayesha-loader__content">
            {/* -------------------------------------------------
                TOP METADATA
            ------------------------------------------------- */}

            <motion.div
              className="aayesha-loader__top"
              initial={{
                opacity: 0,
                y: -18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="aayesha-loader__top-code">
                AA / 01
              </span>

              <span className="aayesha-loader__top-rule" />

              <span className="aayesha-loader__top-season">
                WOMENSWEAR
              </span>

              <span className="aayesha-loader__top-rule" />

              <span className="aayesha-loader__top-year">
                2026
              </span>
            </motion.div>

            {/* -------------------------------------------------
                MONOGRAM
            ------------------------------------------------- */}

            <motion.div
              className="aayesha-loader__monogram"
              initial={{
                opacity: 0,
                scale: 0.72,
                rotate: -8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 1.1,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span>A</span>

              <span className="aayesha-loader__monogram-divider">
                /
              </span>

              <span>A</span>

              <span
                aria-hidden="true"
                className="aayesha-loader__monogram-ring"
              />
            </motion.div>

            {/* -------------------------------------------------
                BRAND
            ------------------------------------------------- */}

            <motion.div
              className="aayesha-loader__brand-wrap"
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.05,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="aayesha-loader__brand-overline">
                <span />
                ESTABLISHED 2026
                <span />
              </div>

              <div className="aayesha-loader__brand">
                AAYESHA
              </div>

              <div className="aayesha-loader__brand-rule">
                <motion.span
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 1.1,
                    delay: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>

            {/* -------------------------------------------------
                TAGLINE
            ------------------------------------------------- */}

            <motion.div
              className="aayesha-loader__tagline-wrap"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.85,
              }}
            >
              <p className="aayesha-loader__tagline">
                CONTEMPORARY INDIAN FASHION
              </p>

              <p className="aayesha-loader__tagline-sub">
                Designed for the woman of today
              </p>
            </motion.div>

            {/* -------------------------------------------------
                LOADING
            ------------------------------------------------- */}

            <motion.div
              className="aayesha-loader__loading"
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 1,
              }}
            >
              <div className="aayesha-loader__loading-head">
                <span>
                  CURATING YOUR EDIT
                </span>

                <span className="aayesha-loader__loading-percent">
                  {String(progress).padStart(3, "0")}
                  <small>%</small>
                </span>
              </div>

              <div className="aayesha-loader__track">
                <motion.div
                  className="aayesha-loader__progress"
                  animate={{
                    scaleX: progress / 100,
                  }}
                  transition={{
                    duration: 0.12,
                    ease: "linear",
                  }}
                />

                <span className="aayesha-loader__track-marker" />
              </div>

              <div className="aayesha-loader__loading-footer">
                <span>PLEASE WAIT</span>

                <span>
                  {progress >= 100
                    ? "WELCOME"
                    : "AAYESHA FASHION"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              SIDE TYPOGRAPHY
          ================================================= */}

          <motion.div
            className="aayesha-loader__side aayesha-loader__side--left"
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.65,
            }}
          >
            <span>01</span>
            <span>THE</span>
            <span>EDIT</span>
          </motion.div>

          <motion.div
            className="aayesha-loader__side aayesha-loader__side--right"
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.65,
            }}
          >
            <span>AA</span>
            <span>WOMEN</span>
            <span>2026</span>
          </motion.div>

          {/* =================================================
              BOTTOM METADATA
          ================================================= */}

          <motion.div
            className="aayesha-loader__bottom-left"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.1,
            }}
          >
            JAIPUR · INDIA
          </motion.div>

          <motion.div
            className="aayesha-loader__bottom-right"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.15,
            }}
          >
            EST. 2026
          </motion.div>

          {/* =================================================
              CENTER CROSSHAIR
          ================================================= */}

          <span
            aria-hidden="true"
            className="aayesha-loader__crosshair aayesha-loader__crosshair--top"
          />

          <span
            aria-hidden="true"
            className="aayesha-loader__crosshair aayesha-loader__crosshair--bottom"
          />

          {/* =================================================
              FINAL REVEAL
          ================================================= */}

          <motion.div
            aria-hidden="true"
            className="aayesha-loader__reveal"
            initial={{
              scaleY: 1,
            }}
            animate={{
              scaleY: 0,
            }}
            transition={{
              duration: 0.9,
              delay: Math.max(
                1.15,
                minimumDuration / 1000 - 0.15,
              ),
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}