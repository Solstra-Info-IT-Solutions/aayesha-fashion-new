"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { HomepageHeroSlide } from "@/types/homepage";

import "./HeroSection.css";

const AUTOPLAY_DELAY = 6000;

interface HeroSectionProps {
  slides: HomepageHeroSlide[];
}

export function HeroSection({
  slides,
}: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slides.length;

  /* =========================================================
     SAFETY
  ========================================================= */

  useEffect(() => {
    if (
      activeIndex >= totalSlides &&
      totalSlides > 0
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;

      setActiveIndex(
        (index + totalSlides) % totalSlides,
      );
    },
    [totalSlides],
  );

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;

    setActiveIndex(
      (current) =>
        (current + 1) % totalSlides,
    );
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    if (totalSlides === 0) return;

    setActiveIndex(
      (current) =>
        (current - 1 + totalSlides) %
        totalSlides,
    );
  }, [totalSlides]);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (
      isPaused ||
      totalSlides <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        nextSlide,
        AUTOPLAY_DELAY,
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isPaused,
    nextSlide,
    totalSlides,
  ]);

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "ArrowRight") {
        nextSlide();
      }

      if (event.key === "ArrowLeft") {
        previousSlide();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    nextSlide,
    previousSlide,
    totalSlides,
  ]);

  /* =========================================================
     REDUCED MOTION
  ========================================================= */

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    if (mediaQuery.matches) {
      setIsPaused(true);
    }
  }, []);

  /* =========================================================
     TOUCH / SWIPE
  ========================================================= */

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;

    touchEndX.current =
      touchStartX.current;
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    touchEndX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    if (Math.abs(distance) >= 50) {
      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (totalSlides === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  return (
    <section
      aria-label="Ayesha Fashion featured banners"
      className="aayesha-hero"
    >
      <div
        className="aayesha-hero__viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===================================================
            SLIDES
        =================================================== */}

        {slides.map((slide, index) => {
          const isActive =
            index === activeIndex;

          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              className={[
                "aayesha-hero__slide",
                isActive
                  ? "aayesha-hero__slide--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* -------------------------------------------
                  IMAGE
              ------------------------------------------- */}

              <div className="aayesha-hero__media">
                <div className="aayesha-hero__desktop-image">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="aayesha-hero__image"
                  />
                </div>

                <div className="aayesha-hero__mobile-image">
                  <Image
                    src={
                      slide.mobileImage ||
                      slide.image
                    }
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="aayesha-hero__image"
                  />
                </div>

                {/* Warm editorial overlay */}
                <div className="aayesha-hero__overlay" />

                {/* Subtle bottom depth */}
                <div className="aayesha-hero__bottom-fade" />
              </div>

              {/* -------------------------------------------
                  EDITORIAL CONTENT
              ------------------------------------------- */}

              <div className="aayesha-hero__content">
                <div className="aayesha-hero__content-inner">
                  {slide.eyebrow && (
                    <p className="aayesha-hero__eyebrow">
                      {slide.eyebrow}
                    </p>
                  )}

                  <h1 className="aayesha-hero__title">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="aayesha-hero__subtitle">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.description && (
                    <p className="aayesha-hero__description">
                      {slide.description}
                    </p>
                  )}

                  {slide.buttonLabel &&
                    slide.href && (
                      <a
                        href={slide.href}
                        className="aayesha-hero__cta"
                      >
                        <span>
                          {slide.buttonLabel}
                        </span>

                        <ArrowRight
                          size={15}
                          strokeWidth={1.4}
                        />
                      </a>
                    )}
                </div>
              </div>

              {/* -------------------------------------------
                  EDITORIAL SIDE LABEL
              ------------------------------------------- */}

              <div className="aayesha-hero__side-label">
                <span>AAYESHA</span>
                <span>WOMENSWEAR</span>
              </div>
            </article>
          );
        })}

        {/* ===================================================
            CONTROLS
        =================================================== */}

        {totalSlides > 1 && (
          <div className="aayesha-hero__controls">
            {/* Progress */}
            <div
              className="aayesha-hero__progress"
              aria-label="Slide navigation"
            >
              <div className="aayesha-hero__counter">
                <span>
                  {String(activeIndex + 1).padStart(
                    2,
                    "0",
                  )}
                </span>

                <span className="aayesha-hero__counter-divider">
                  /
                </span>

                <span>
                  {String(totalSlides).padStart(
                    2,
                    "0",
                  )}
                </span>
              </div>

              <div className="aayesha-hero__progress-track">
                <span
                  className="aayesha-hero__progress-fill"
                  style={{
                    width: `${
                      ((activeIndex + 1) /
                        totalSlides) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Indicators */}
            <div className="aayesha-hero__indicators">
              {slides.map(
                (slide, index) => {
                  const isActive =
                    index === activeIndex;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() =>
                        goToSlide(index)
                      }
                      aria-label={`Go to banner ${
                        index + 1
                      }`}
                      aria-current={
                        isActive
                          ? "true"
                          : undefined
                      }
                      className={[
                        "aayesha-hero__indicator",
                        isActive
                          ? "aayesha-hero__indicator--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span />
                    </button>
                  );
                },
              )}
            </div>

            {/* Navigation */}
            <div className="aayesha-hero__actions">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="aayesha-hero__nav-button"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.3}
                />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="aayesha-hero__nav-button"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.3}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsPaused(
                    (value) => !value,
                  )
                }
                aria-label={
                  isPaused
                    ? "Resume banners"
                    : "Pause banners"
                }
                className="aayesha-hero__pause"
              >
                {isPaused ? (
                  <Play
                    size={13}
                    strokeWidth={1.3}
                  />
                ) : (
                  <Pause
                    size={13}
                    strokeWidth={1.3}
                  />
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            SCREEN READER CONTENT
        =================================================== */}

        <div className="sr-only">
          <h1>
            {activeSlide.title}
          </h1>

          {activeSlide.eyebrow && (
            <p>{activeSlide.eyebrow}</p>
          )}

          {activeSlide.subtitle && (
            <p>{activeSlide.subtitle}</p>
          )}

          {activeSlide.description && (
            <p>
              {activeSlide.description}
            </p>
          )}

          {activeSlide.buttonLabel &&
            activeSlide.href && (
              <a href={activeSlide.href}>
                {activeSlide.buttonLabel}
              </a>
            )}
        </div>
      </div>
    </section>
  );
}