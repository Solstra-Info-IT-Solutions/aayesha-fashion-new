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
      if (totalSlides === 0) {
        return;
      }

      setActiveIndex(
        (index + totalSlides) % totalSlides,
      );
    },
    [totalSlides],
  );

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) % totalSlides,
    );
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }

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

    const interval = window.setInterval(
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
    const mediaQuery = window.matchMedia(
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
      aria-label="Aayesha Fashion featured banners"
      className="hero-section"
    >
      <div
        className="hero-section__viewport"
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
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`hero-slide ${
                isActive
                  ? "hero-slide--active"
                  : ""
              }`}
            >
              {/* =================================================
                  IMAGE
              ================================================= */}

              <div
                className={`hero-slide__image ${
                  isActive
                    ? "hero-slide__image--active"
                    : ""
                }`}
              >
                {/* Desktop */}
                <div className="hero-slide__desktop-image">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="hero-slide__image-element"
                  />
                </div>

                {/* Mobile */}
                <div className="hero-slide__mobile-image">
                  <Image
                    src={
                      slide.mobileImage ||
                      slide.image
                    }
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="hero-slide__image-element"
                  />
                </div>
              </div>

              {/* =================================================
                  IMAGE TREATMENT
              ================================================= */}

              <div
                aria-hidden="true"
                className="hero-slide__overlay hero-slide__overlay--side"
              />

              <div
                aria-hidden="true"
                className="hero-slide__overlay hero-slide__overlay--bottom"
              />

              <div
                aria-hidden="true"
                className="hero-slide__light"
              />

              {/* =================================================
                  HERO CONTENT
              ================================================= */}

              <div className="hero-slide__content">
                <div className="hero-section__container">
                  <div className="hero-slide__copy">
                    {/* Eyebrow */}

                    {slide.eyebrow && (
                      <div className="hero-slide__eyebrow">
                        <span
                          aria-hidden="true"
                          className="hero-slide__eyebrow-line"
                        />

                        <span className="hero-slide__eyebrow-text">
                          {slide.eyebrow}
                        </span>
                      </div>
                    )}

                    {/* Title */}

                    <h1 className="hero-slide__title">
                      {slide.title}
                    </h1>

                    {/* Description */}

                    {(slide.subtitle ||
                      slide.description) && (
                      <p className="hero-slide__description">
                        {slide.subtitle ||
                          slide.description}
                      </p>
                    )}

                    {/* CTA */}

                    {slide.buttonLabel &&
                      slide.href && (
                        <a
                          href={slide.href}
                          className="hero-slide__cta"
                        >
                          <span>
                            {slide.buttonLabel}
                          </span>

                          <ArrowRight
                            size={16}
                            strokeWidth={1.2}
                            className="hero-slide__cta-icon"
                          />
                        </a>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ===================================================
            SLIDE COUNTER
        =================================================== */}

        {totalSlides > 1 && (
          <div
            className="hero-section__counter"
            aria-hidden="true"
          >
            <span className="hero-section__counter-current">
              {String(activeIndex + 1).padStart(
                2,
                "0",
              )}
            </span>

            <span className="hero-section__counter-line" />

            <span className="hero-section__counter-total">
              {String(totalSlides).padStart(
                2,
                "0",
              )}
            </span>
          </div>
        )}

        {/* ===================================================
            CONTROLS
        =================================================== */}

        {totalSlides > 1 && (
          <>
            {/* Slide indicators */}

            <div
              className="hero-section__indicators"
              aria-label="Slide navigation"
            >
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
                      className="hero-section__indicator"
                    >
                      <span
                        className={`hero-section__indicator-line ${
                          isActive
                            ? "hero-section__indicator-line--active"
                            : ""
                        }`}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* Previous / Next */}

            <div className="hero-section__navigation">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="hero-section__navigation-button"
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.2}
                  className="hero-section__navigation-icon"
                />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="hero-section__navigation-button"
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="hero-section__navigation-icon"
                />
              </button>
            </div>

            {/* Pause / Play */}

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
              className="hero-section__pause"
            >
              {isPaused ? (
                <Play
                  size={13}
                  strokeWidth={1.2}
                />
              ) : (
                <Pause
                  size={13}
                  strokeWidth={1.2}
                />
              )}
            </button>
          </>
        )}

        {/* ===================================================
            SCREEN READER CONTENT
        =================================================== */}

        <div className="sr-only">
          <h1>{activeSlide.title}</h1>

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