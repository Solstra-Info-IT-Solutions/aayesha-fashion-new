"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

import type { ReviewMedia } from "@/lib/api/reviews";

import "./ReviewMedia.css";

export function ReviewMediaGrid({ media }: { media: ReviewMedia[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex]);

  if (media.length === 0) {
    return null;
  }

  const active = openIndex === null ? null : media[openIndex];

  return (
    <>
      <ul className="review-media-grid">
        {media.map((item, index) => (
          <li key={`${item.url}-${index}`}>
            <button
              type="button"
              className="review-media-grid__thumb"
              aria-label={
                item.type === "video" ? "Play review video" : "View review photo"
              }
              onClick={() => setOpenIndex(index)}
            >
              {item.type === "video" ? (
                <>
                  <video src={item.url} muted preload="metadata" />
                  <span className="review-media-grid__play" aria-hidden="true">
                    <Play size={16} />
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="Customer review" loading="lazy" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="review-media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Review media"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="review-media-lightbox__close"
            onClick={() => setOpenIndex(null)}
          >
            <X size={22} />
          </button>

          <div
            className="review-media-lightbox__stage"
            onClick={(event) => event.stopPropagation()}
          >
            {active.type === "video" ? (
              <video src={active.url} controls autoPlay playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.url} alt="Customer review" />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
