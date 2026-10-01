"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import "./Reveal.css";

interface RevealProps {
  children: ReactNode;
  /** Stagger siblings, in milliseconds. */
  delay?: number;
  /** Which way the content travels in from. */
  from?: "up" | "left" | "right" | "none";
  as?: ElementType;
  className?: string;
}

/**
 * Gentle scroll reveal: fades and lifts content in once as it enters
 * the viewport. Pure CSS transition + one IntersectionObserver, so it
 * adds no animation library weight. Respects reduced-motion (see
 * Reveal.css) and shows content immediately if the observer is
 * unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      // Asynchronous so we never set state synchronously in the effect.
      const timer = window.setTimeout(() => setVisible(true), 0);

      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={[
        "reveal",
        `reveal--${from}`,
        visible ? "reveal--visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
