"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const currentProgress = Math.max(
        1,
        Math.min(100, Math.round(easedProgress * 100))
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

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="aayesha-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* Atmospheric layers */}
          <div className="aayesha-loader__texture" />
          <div className="aayesha-loader__light" />
          <div className="aayesha-loader__light-second" />

          {/* Editorial frame */}
          <div className="aayesha-loader__outer-frame" />
          <div className="aayesha-loader__inner-frame" />

          {/* Top metadata */}
          <motion.header
            className="aayesha-loader__header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <span>AA</span>
            <span>CONTEMPORARY INDIAN FASHION</span>
            <span>2026</span>
          </motion.header>

          {/* Main brand showcase */}
          <main className="aayesha-loader__center">
            <motion.div
              className="aayesha-loader__collection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.65,
              }}
            >
              THE NEW EDIT
            </motion.div>

            <div className="aayesha-loader__wordmark-wrap">
              <motion.h1
                className="aayesha-loader__wordmark"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                AAYESHA
              </motion.h1>

              <motion.span
                className="aayesha-loader__logo-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.8,
                  delay: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.div
              className="aayesha-loader__brand-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.3,
                delay: 1.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span />
            </motion.div>

            <motion.p
              className="aayesha-loader__tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: 1.35,
              }}
            >
              Made for moments worth remembering.
            </motion.p>

            {/* 1 → 100 progress */}
            <motion.div
              className="aayesha-loader__loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 1.5,
              }}
            >
              <div className="aayesha-loader__loading-top">
                <span>CURATING THE COLLECTION</span>
                <span className="aayesha-loader__progress-number">
                  {progress}%
                </span>
              </div>

              <div className="aayesha-loader__progress-track">
                <motion.div
                  className="aayesha-loader__progress-bar"
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.12,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </main>

          {/* Side editorial information */}
          <motion.div
            className="aayesha-loader__vertical aayesha-loader__vertical--left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            AA / 01 WOMENSWEAR
          </motion.div>

          <motion.div
            className="aayesha-loader__vertical aayesha-loader__vertical--right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            THE EDIT INDIA
          </motion.div>

          <motion.div
            className="aayesha-loader__bottom-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            AAYESHA FASHION
          </motion.div>

          {/* Corner details */}
          <span className="aayesha-loader__corner aayesha-loader__corner--tl" />
          <span className="aayesha-loader__corner aayesha-loader__corner--tr" />
          <span className="aayesha-loader__corner aayesha-loader__corner--bl" />
          <span className="aayesha-loader__corner aayesha-loader__corner--br" />

          {/* Final reveal */}
          <motion.div
            className="aayesha-loader__final-reveal"
            initial={{ opacity: 0 }}
            animate={{
              opacity: progress >= 100 ? 1 : 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}