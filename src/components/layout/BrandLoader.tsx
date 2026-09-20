"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./BrandLoader.css";

interface BrandLoaderProps {
  minimumDuration?: number;
}

export default function BrandLoader({
  minimumDuration = 1500,
}: BrandLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const animate = (time: number) => {
      const elapsed = time - start;

      /*
       * Smooth loading progression.
       * Slows slightly near the end so the transition
       * feels intentional instead of mechanical.
       */
      const rawProgress = Math.min(elapsed / minimumDuration, 1);

      const easedProgress =
        rawProgress < 0.7
          ? rawProgress * 1.18
          : 0.826 + (rawProgress - 0.7) * 0.58;

      const nextProgress = Math.min(
        100,
        Math.round(easedProgress * 100)
      );

      setProgress(nextProgress);

      if (elapsed < minimumDuration) {
        frame = requestAnimationFrame(animate);
      } else {
        setProgress(100);

        setTimeout(() => {
          setIsLoading(false);
        }, 180);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
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
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          {/* Decorative background panels */}
          <div className="aayesha-loader__panel aayesha-loader__panel--one" />
          <div className="aayesha-loader__panel aayesha-loader__panel--two" />

          {/* Subtle grain */}
          <div className="aayesha-loader__grain" />

          <div className="aayesha-loader__content">

            {/* Top brand mark */}
            <motion.div
              className="aayesha-loader__top"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span>AA</span>

              <span className="aayesha-loader__top-line" />

              <span>EST. 2026</span>
            </motion.div>

            {/* Main brand */}
            <motion.div
              className="aayesha-loader__brand-wrap"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="aayesha-loader__brand">
                AAYESHA
              </span>

              <span className="aayesha-loader__brand-rule" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="aayesha-loader__tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
              }}
            >
              CONTEMPORARY INDIAN FASHION
            </motion.p>

            {/* Bottom loading area */}
            <motion.div
              className="aayesha-loader__loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.65,
              }}
            >
              <div className="aayesha-loader__loading-head">
                <span>CURATING YOUR EDIT</span>

                <span>
                  {String(progress).padStart(3, "0")}
                </span>
              </div>

              <div className="aayesha-loader__track">
                <motion.div
                  className="aayesha-loader__progress"
                  animate={{
                    scaleX: progress / 100,
                  }}
                  transition={{
                    duration: 0.1,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Side labels */}
          <div className="aayesha-loader__side aayesha-loader__side--left">
            AAYESHA
          </div>

          <div className="aayesha-loader__side aayesha-loader__side--right">
            WOMENSWEAR
          </div>

          {/* Bottom year */}
          <div className="aayesha-loader__year">
            2026
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}