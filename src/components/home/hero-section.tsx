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
        (current - 1 + totalSlides) % totalSlides,
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
      aria-label="Ayesha Fashion featured banners"
      className="
        relative
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <div
        className="
          relative
          h-[78svh]
          min-h-[560px]
          max-h-[900px]
          w-full
          overflow-hidden
          bg-[var(--color-bg-soft)]
          sm:h-[80svh]
          md:h-[82svh]
          md:min-h-[620px]
          lg:h-[84svh]
          lg:max-h-[920px]
        "
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
              className={[
                "absolute inset-0",
                "transition-opacity duration-[1200ms]",
                "ease-[cubic-bezier(.22,1,.36,1)]",
                isActive
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0",
              ].join(" ")}
            >
              {/* =============================================
                  IMAGE
              ============================================= */}

              <div
                className={[
                  "absolute inset-0",
                  "transition-transform duration-[7000ms]",
                  "ease-out",
                  isActive
                    ? "scale-[1.045]"
                    : "scale-100",
                ].join(" ")}
              >
                {/* Desktop */}
                <div className="absolute inset-0 hidden md:block">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </div>

                {/* Mobile */}
                <div className="absolute inset-0 md:hidden">
                  <Image
                    src={
                      slide.mobileImage ||
                      slide.image
                    }
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </div>
              </div>

              {/* =============================================
                  EDITORIAL IMAGE TREATMENT
              ============================================= */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/[0.48]
                  via-black/[0.10]
                  to-transparent
                  md:from-black/[0.42]
                  md:via-black/[0.06]
                  md:to-transparent
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/[0.42]
                  via-transparent
                  to-black/[0.08]
                "
              />

              {/* =============================================
                  SUBTLE IMAGE GRAIN / DEPTH
              ============================================= */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.14),transparent_30%)]
                  opacity-60
                "
              />

              {/* =============================================
                  HERO CONTENT
              ============================================= */}

              <div
                className="
                  absolute
                  inset-0
                  z-20
                  flex
                  items-end
                "
              >
                <div
                  className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    px-5
                    pb-24
                    sm:px-8
                    sm:pb-28
                    md:pb-32
                    lg:px-12
                    lg:pb-36
                    xl:px-16
                    2xl:px-20
                  "
                >
                  <div
                    className="
                      max-w-[760px]
                      text-white
                    "
                  >
                    {/* Eyebrow */}

                    {slide.eyebrow && (
                      <div
                        className="
                          mb-5
                          flex
                          items-center
                          gap-3
                          sm:mb-6
                        "
                      >
                        <span
                          aria-hidden="true"
                          className="
                            h-px
                            w-8
                            bg-[var(--color-champagne)]
                            sm:w-10
                          "
                        />

                        <span
                          className="
                            font-body
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-white/85
                            sm:text-[11px]
                            sm:tracking-[0.28em]
                          "
                        >
                          {slide.eyebrow}
                        </span>
                      </div>
                    )}

                    {/* Title */}

                    <h1
                      className="
                        max-w-[760px]
                        font-display
                        text-[3.25rem]
                        font-normal
                        leading-[0.94]
                        tracking-[-0.035em]
                        text-white
                        drop-shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                        sm:text-[4.25rem]
                        md:text-[5rem]
                        lg:text-[6rem]
                        xl:text-[7rem]
                        2xl:text-[7.5rem]
                      "
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}

                    {(slide.subtitle ||
                      slide.description) && (
                      <p
                        className="
                          mt-5
                          max-w-[520px]
                          font-body
                          text-[14px]
                          font-normal
                          leading-[1.65]
                          tracking-[0.01em]
                          text-white/85
                          sm:mt-6
                          sm:text-[15px]
                          md:text-[16px]
                        "
                      >
                        {slide.subtitle ||
                          slide.description}
                      </p>
                    )}

                    {/* CTA */}

                    {slide.buttonLabel &&
                      slide.href && (
                        <a
                          href={slide.href}
                          className="
                            group
                            mt-7
                            inline-flex
                            items-center
                            gap-4
                            border-b
                            border-white/70
                            pb-2.5
                            font-body
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-white
                            transition-all
                            duration-500
                            hover:border-[var(--color-champagne)]
                            hover:text-[var(--color-champagne)]
                            sm:mt-8
                            sm:text-[12px]
                          "
                        >
                          <span>
                            {slide.buttonLabel}
                          </span>

                          <ArrowRight
                            size={16}
                            strokeWidth={1.2}
                            className="
                              transition-transform
                              duration-500
                              group-hover:translate-x-2
                            "
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
            className="
              absolute
              right-5
              top-1/2
              z-30
              hidden
              -translate-y-1/2
              flex-col
              items-center
              gap-3
              md:flex
              lg:right-8
              xl:right-12
            "
            aria-hidden="true"
          >
            <span
              className="
                font-body
                text-[10px]
                font-medium
                tracking-[0.18em]
                text-white/90
              "
            >
              {String(activeIndex + 1).padStart(
                2,
                "0",
              )}
            </span>

            <span
              className="
                h-10
                w-px
                bg-white/30
              "
            />

            <span
              className="
                font-body
                text-[10px]
                font-medium
                tracking-[0.18em]
                text-white/50
              "
            >
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
              className="
                absolute
                bottom-7
                left-5
                z-30
                flex
                items-center
                gap-2
                sm:bottom-8
                sm:left-8
                lg:bottom-10
                lg:left-12
                xl:left-16
                2xl:left-20
              "
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
                      className="
                        flex
                        h-6
                        items-center
                        px-1
                      "
                    >
                      <span
                        className={[
                          "block h-px",
                          "transition-all duration-500",
                          isActive
                            ? "w-12 bg-white"
                            : "w-5 bg-white/45",
                        ].join(" ")}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* Previous / Next */}

            <div
              className="
                absolute
                bottom-6
                right-5
                z-30
                flex
                items-center
                gap-2
                sm:bottom-7
                sm:right-8
                lg:bottom-9
                lg:right-12
                xl:right-16
                2xl:right-20
              "
            >
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="
                  group
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  border
                  border-white/45
                  bg-black/[0.08]
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-500
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowLeft
                  size={15}
                  strokeWidth={1.2}
                  className="
                    transition-transform
                    duration-500
                    group-hover:-translate-x-1
                  "
                />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="
                  group
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  border
                  border-white/45
                  bg-black/[0.08]
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-500
                  hover:border-white
                  hover:bg-white
                  hover:text-[var(--color-text)]
                  sm:h-12
                  sm:w-12
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                  "
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
              className="
                absolute
                bottom-8
                left-1/2
                z-30
                hidden
                -translate-x-1/2
                text-white/65
                transition-colors
                duration-300
                hover:text-white
                md:block
              "
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