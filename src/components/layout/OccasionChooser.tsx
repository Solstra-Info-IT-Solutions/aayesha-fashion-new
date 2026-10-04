"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import "./OccasionChooser.css";

interface OccasionChooserProps {
  /** Called once the chooser has faded out (chosen, skipped or Esc). */
  onDone: () => void;
}

const OCCASIONS = [
  {
    key: "new-arrivals",
    label: "New Arrivals",
    note: "Just introduced to the collection",
    href: "/collections/new-arrivals",
    image: "/images/choose/new-arrivals.jpg",
  },
  {
    key: "best-sellers",
    label: "Best Sellers",
    note: "The pieces our customers love most",
    href: "/collections/best-sellers",
    image: "/images/choose/best-sellers.jpg",
  },
  {
    key: "festive",
    label: "Festive Edit",
    note: "Our top category, made for celebration",
    href: "/collections/festive",
    image: "/images/choose/festive.jpg",
  },
] as const;

type Occasion = (typeof OCCASIONS)[number];

type Chosen = {
  occasion: Occasion;
  rect: { top: number; left: number; width: number; height: number };
  expanded: boolean;
};

const EXPAND_MS = 900;
const ARRIVE_TIMEOUT = 8000;

export default function OccasionChooser({ onDone }: OccasionChooserProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [leaving, setLeaving] = useState(false);

  const startPath = useRef(pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) =>
    timers.current.push(setTimeout(fn, ms));

  const leave = useCallback(() => {
    setLeaving(true);
    timers.current.push(setTimeout(onDone, 700));
  }, [onDone]);

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;

    root.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => setReady(true));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave();
    };

    window.addEventListener("keydown", onKey);

    const pending = timers.current;

    return () => {
      cancelAnimationFrame(frame);
      pending.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [leave]);

  // Once the chosen page has actually opened underneath, fade the picture away.
  useEffect(() => {
    if (chosen?.expanded && pathname !== startPath.current) {
      later(leave, 250);
    }
  }, [pathname, chosen?.expanded, leave]);

  const choose = (
    occasion: Occasion,
    element: HTMLElement,
  ) => {
    if (chosen) return;

    const box = element.getBoundingClientRect();

    setChosen({
      occasion,
      rect: {
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
      },
      expanded: false,
    });

    // Start from the card's own rectangle, then grow to full screen.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setChosen((current) =>
          current ? { ...current, expanded: true } : current,
        ),
      ),
    );

    router.prefetch(occasion.href);

    later(() => router.push(occasion.href), EXPAND_MS - 150);
    later(leave, EXPAND_MS + ARRIVE_TIMEOUT);
  };

  const rect = chosen?.rect;

  return (
    <div
      className={
        leaving
          ? "occasion occasion--leaving"
          : ready
            ? "occasion occasion--ready"
            : "occasion"
      }
      role="dialog"
      aria-modal="true"
      aria-label="Choose where to begin"
    >
      <header className="occasion__header">
        <p className="occasion__eyebrow">AAYESHA FASHION</p>
        <h2 className="occasion__title">Where would you like to begin?</h2>
      </header>

      <ul
        className={
          chosen
            ? "occasion__cards occasion__cards--chosen"
            : "occasion__cards"
        }
      >
        {OCCASIONS.map((occasion, index) => (
          <li
            key={occasion.key}
            className="occasion__item"
            style={{ ["--i" as string]: index }}
          >
            <button
              type="button"
              className="occasion__card"
              onClick={(event) => choose(occasion, event.currentTarget)}
              aria-label={`${occasion.label}. ${occasion.note}`}
            >
              <span
                className="occasion__image"
                style={{ backgroundImage: `url(${occasion.image})` }}
                aria-hidden="true"
              />
              <span className="occasion__sheen" aria-hidden="true" />
              <span className="occasion__shade" aria-hidden="true" />

              <span className="occasion__text">
                <span className="occasion__index">0{index + 1}</span>
                <span className="occasion__label">{occasion.label}</span>
                <span className="occasion__note">{occasion.note}</span>
                <span className="occasion__cta">Explore</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="occasion__skip" onClick={leave}>
        Enter the store
      </button>

      {chosen && rect ? (
        <div
          className={
            chosen.expanded
              ? "occasion__takeover occasion__takeover--full"
              : "occasion__takeover"
          }
          style={
            chosen.expanded
              ? undefined
              : {
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                }
          }
          aria-hidden="true"
        >
          <span
            className="occasion__takeover-image"
            style={{ backgroundImage: `url(${chosen.occasion.image})` }}
          />
          <span className="occasion__takeover-label">
            {chosen.occasion.label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
