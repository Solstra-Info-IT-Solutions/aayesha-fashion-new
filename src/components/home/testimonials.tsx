"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import type {
  HomepageTestimonial,
  HomepageTestimonials,
} from "@/types/homepage";

import "./Testimonials.css";

const AUTOPLAY_DELAY = 5500;

interface TestimonialsProps {
  data: HomepageTestimonials;
}

export function Testimonials({
  data,
}: TestimonialsProps) {
  const testimonials: HomepageTestimonial[] =
    data.testimonials
      .filter(
        (testimonial) => testimonial.isActive
      )
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const total = testimonials.length;

  useEffect(() => {
    if (
      total > 0 &&
      activeIndex >= total
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  function next() {
    if (total <= 1) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current + 1) % total
    );
  }

  function previous() {
    if (total <= 1) {
      return;
    }

    setActiveIndex(
      (current) =>
        (current - 1 + total) % total
    );
  }

  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const interval = window.setInterval(
      next,
      AUTOPLAY_DELAY
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [total]);

  if (total === 0) {
    return null;
  }

  const testimonial =
    testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="testimonials"
    >
      <Container>
        <div className="testimonials__inner">

          {/* =========================================
              HEADER
          ========================================= */}

          <header className="testimonials__header">
            <div className="testimonials__heading">
              <p className="testimonials__eyebrow">
                Client Stories
              </p>

              <h2 className="testimonials__title">
                What they say
                <span>.</span>
              </h2>
            </div>

            <span
              className="testimonials__counter"
              aria-label={`Testimonial ${
                activeIndex + 1
              } of ${total}`}
            >
              {String(activeIndex + 1).padStart(
                2,
                "0"
              )}
              <span>/</span>
              {String(total).padStart(2, "0")}
            </span>
          </header>

          {/* =========================================
              TESTIMONIAL
          ========================================= */}

          <div className="testimonials__content">
            <Quote
              aria-hidden="true"
              className="testimonials__quote-icon"
              size={28}
              strokeWidth={1}
            />

            <blockquote
              key={testimonial.id}
              className="testimonials__quote"
            >
              “{testimonial.quote}”
            </blockquote>

            <div className="testimonials__author">
              <p className="testimonials__name">
                {testimonial.name}
              </p>

              {testimonial.location && (
                <p className="testimonials__location">
                  {testimonial.location}
                </p>
              )}
            </div>
          </div>

          {/* =========================================
              CONTROLS
          ========================================= */}

          {total > 1 && (
            <div className="testimonials__controls">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="testimonials__arrow"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.3}
                />
              </button>

              <div
                className="testimonials__pagination"
                aria-label="Testimonial navigation"
              >
                {testimonials.map(
                  (item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Go to testimonial ${
                        index + 1
                      }`}
                      aria-current={
                        index === activeIndex
                      }
                      onClick={() =>
                        setActiveIndex(index)
                      }
                      className="testimonials__pagination-button"
                    >
                      <span
                        className={[
                          "testimonials__pagination-line",
                          index === activeIndex
                            ? "is-active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="testimonials__arrow"
              >
                <ArrowRight
                  size={16}
                  strokeWidth={1.3}
                />
              </button>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}