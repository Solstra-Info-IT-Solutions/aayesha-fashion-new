"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="aayesha-hero">
      {/* =================================================
          BACKGROUND IMAGE
          ================================================= */}

      <div className="aayesha-hero__media">
        <picture>
          {/* Mobile image */}
          <source
            media="(max-width: 767px)"
            srcSet="/images/home/hero-mobile.jpg"
          />

          {/* Desktop image */}
          <img
            src="/images/home/hero-desktop.jpg"
            alt="Aayesha contemporary Indian fashion collection"
            className="aayesha-hero__image"
          />
        </picture>
      </div>


      {/* =================================================
          IMAGE OVERLAY
          ================================================= */}

      <div className="aayesha-hero__overlay" />


      {/* =================================================
          TOP EDITORIAL LABEL
          ================================================= */}

      <motion.div
        className="aayesha-hero__top-label"
        initial={{
          opacity: 0,
          y: -12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span>NEW SEASON</span>

        <span className="aayesha-hero__top-line" />

        <span>26 / 27</span>
      </motion.div>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <div className="aayesha-hero__content">

        <motion.p
          className="aayesha-hero__eyebrow"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          THE NEW AAYESHA EDIT
        </motion.p>


        <motion.h1
          className="aayesha-hero__title"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span>Made for</span>

          <em>your moment.</em>
        </motion.h1>


        <motion.p
          className="aayesha-hero__description"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Contemporary silhouettes,
          <br />
          rooted in Indian elegance.
        </motion.p>


        <motion.div
          className="aayesha-hero__actions"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href="/collections/new-arrivals"
            className="aayesha-hero__button aayesha-hero__button--primary"
          >
            Shop New Arrivals
          </Link>

          <Link
            href="/collections"
            className="aayesha-hero__button aayesha-hero__button--text"
          >
            Explore Collection
            <span>↗</span>
          </Link>
        </motion.div>
      </div>


      {/* =================================================
          BOTTOM META
          ================================================= */}

      <motion.div
        className="aayesha-hero__bottom"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 1.15,
        }}
      >
        <span>CONTEMPORARY INDIAN FASHION</span>

        <span className="aayesha-hero__scroll">
          <span className="aayesha-hero__scroll-line" />
          SCROLL TO EXPLORE
        </span>
      </motion.div>
    </section>
  );
}