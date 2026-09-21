"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./BrandLoader.css";

interface BrandLoaderProps {
  minimumDuration?: number;
}

export default function BrandLoader({
  minimumDuration = 3200,
}: BrandLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();

    let frame: number;
    let exitTimer: ReturnType<typeof setTimeout>;

    const animate = (time: number) => {
      const elapsed = time - start;

      const raw = Math.min(
        elapsed / minimumDuration,
        1,
      );

      /*
       * Deliberately slower cinematic progression.
       * The loader should feel like a brand introduction,
       * not a technical loading indicator.
       */
      const eased =
        raw < 0.2
          ? raw * 0.72
          : raw < 0.72
            ? 0.144 +
              (raw - 0.2) * 1.18
            : 0.758 +
              (raw - 0.72) * 0.865;

      setProgress(
        Math.min(
          100,
          Math.round(eased * 100),
        ),
      );

      if (elapsed < minimumDuration) {
        frame = requestAnimationFrame(animate);
      } else {
        setProgress(100);

        exitTimer = setTimeout(() => {
          setIsLoading(false);
        }, 850);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
    };
  }, [minimumDuration]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="aayesha-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1.15,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* =================================================
              ATMOSPHERE
          ================================================= */}

          <div
            aria-hidden="true"
            className="aayesha-loader__texture"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__light"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__light-second"
          />

          {/* =================================================
              EDITORIAL FRAME
          ================================================= */}

          <div
            aria-hidden="true"
            className="aayesha-loader__outer-frame"
          />

          <div
            aria-hidden="true"
            className="aayesha-loader__inner-frame"
          />

          {/* =================================================
              TOP BRAND IDENTIFICATION
          ================================================= */}

          <motion.header
            className="aayesha-loader__header"
            initial={{
              opacity: 0,
              y: -12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span>AA</span>

            <span className="aayesha-loader__header-line" />

            <span>CONTEMPORARY INDIAN FASHION</span>

            <span className="aayesha-loader__header-line" />

            <span>2026</span>
          </motion.header>

          {/* =================================================
              MAIN BRAND SHOWCASE
          ================================================= */}

          <main className="aayesha-loader__center">

            {/* Small collection label */}

            <motion.div
              className="aayesha-loader__collection"
              initial={{
                opacity: 0,
                letterSpacing: "0.5em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: "0.28em",
              }}
              transition={{
                duration: 1.4,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="aayesha-loader__collection-line" />

              THE NEW EDIT

              <span className="aayesha-loader__collection-line" />
            </motion.div>

            {/* Main wordmark */}

            <div className="aayesha-loader__wordmark-wrap">
              <motion.h1
                className="aayesha-loader__wordmark"
                initial={{
                  opacity: 0,
                  y: 55,
                  scale: 1.04,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 1.6,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                AAYESHA
              </motion.h1>

              {/* Cinematic light across logo */}

              <motion.span
                aria-hidden="true"
                className="aayesha-loader__logo-light"
                initial={{
                  left: "-20%",
                  opacity: 0,
                }}
                animate={{
                  left: "120%",
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.8,
                  delay: 1.35,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Brand rule */}

            <motion.div
              className="aayesha-loader__brand-rule"
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                duration: 1.25,
                delay: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span />
            </motion.div>

            {/* Tagline */}

            <motion.p
              className="aayesha-loader__tagline"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 1.55,
              }}
            >
              Made for moments worth remembering.
            </motion.p>

            {/* =================================================
                COLLECTION LOADING
            ================================================= */}

            <motion.div
              className="aayesha-loader__loading"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 1.85,
              }}
            >
              <div className="aayesha-loader__loading-top">
                <span>
                  {progress >= 95
                    ? "WELCOME TO AAYESHA"
                    : "CURATING THE COLLECTION"}
                </span>

                <span>
                  {String(progress).padStart(3, "0")}
                </span>
              </div>

              <div className="aayesha-loader__progress-track">
                <motion.span
                  className="aayesha-loader__progress-bar"
                  animate={{
                    scaleX: progress / 100,
                  }}
                  transition={{
                    duration: 0.12,
                    ease: "linear",
                  }}
                />
              </div>

              <div className="aayesha-loader__loading-bottom">
                <span>JAIPUR</span>

                <span>EST. 2026</span>
              </div>
            </motion.div>
          </main>

          {/* =================================================
              LEFT EDITORIAL LABEL
          ================================================= */}

          <motion.div
            className="aayesha-loader__vertical aayesha-loader__vertical--left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.1,
            }}
          >
            <span>AA / 01</span>
            <span>WOMENSWEAR</span>
          </motion.div>

          {/* =================================================
              RIGHT EDITORIAL LABEL
          ================================================= */}

          <motion.div
            className="aayesha-loader__vertical aayesha-loader__vertical--right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
            }}
          >
            <span>THE EDIT</span>
            <span>INDIA</span>
          </motion.div>

          {/* =================================================
              BOTTOM BRAND
          ================================================= */}

          <motion.div
            className="aayesha-loader__bottom-brand"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 2,
            }}
          >
            <span className="aayesha-loader__bottom-rule" />

            <span>AAYESHA FASHION</span>

            <span className="aayesha-loader__bottom-rule" />
          </motion.div>

          {/* =================================================
              CORNER DETAILS
          ================================================= */}

          <span className="aayesha-loader__corner aayesha-loader__corner--tl" />
          <span className="aayesha-loader__corner aayesha-loader__corner--tr" />
          <span className="aayesha-loader__corner aayesha-loader__corner--bl" />
          <span className="aayesha-loader__corner aayesha-loader__corner--br" />

          {/* =================================================
              FINAL REVEAL
          ================================================= */}

          <motion.div
            aria-hidden="true"
            className="aayesha-loader__final-reveal"
            initial={{
              scaleY: 1,
            }}
            animate={{
              scaleY: 0,
            }}
            transition={{
              duration: 1.15,
              delay:
                minimumDuration / 1000 + 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}