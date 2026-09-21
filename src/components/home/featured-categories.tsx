"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/ui/button";

import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";

import "./FeaturedCategories.css";

/* =========================================================
   COMPONENT
========================================================= */

export function FeaturedCategories() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     LOAD FEATURED CATEGORIES
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getCategories();

        if (!mounted) {
          return;
        }

        setCategories(
          data
            .filter(
              (item) =>
                item.isActive &&
                item.isFeatured,
            )
            .slice(0, 4),
        );
      } catch (error) {
        console.error(
          "Failed to load featured categories:",
          error,
        );

        if (mounted) {
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className="featured-categories"
      aria-labelledby="featured-categories-title"
    >
      <Container>
        {/* =================================================
            SECTION INTRO
        ================================================= */}

        <header className="featured-categories__header">
          <div className="featured-categories__heading">
            <p className="featured-categories__eyebrow">
              Discover Aayesha
            </p>

            <h2
              id="featured-categories-title"
              className="featured-categories__title"
            >
              Explore the
              <span>
                collections.
              </span>
            </h2>
          </div>

          <p className="featured-categories__intro">
            Curated silhouettes,
            contemporary details and
            timeless Indian craftsmanship.
          </p>
        </header>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="featured-categories__grid featured-categories__grid--loading">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <CategorySkeleton
                key={index}
              />
            ))}
          </div>
        )}

        {/* =================================================
            FEATURED CATEGORIES
        ================================================= */}

        {!loading &&
          categories.length > 0 && (
            <>
              <div className="featured-categories__grid">
                {categories.map(
                  (category, index) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      index={index}
                    />
                  ),
                )}
              </div>

              {/* CTA */}

              <div className="featured-categories__footer">
                <div className="featured-categories__footer-line" />

                <Link
                  href="/categories"
                  className="featured-categories__all-link"
                >
                  <span className="featured-categories__all-label">
                    Explore all categories
                  </span>

                  <span className="featured-categories__all-icon">
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.3}
                    />
                  </span>
                </Link>

                <div className="featured-categories__footer-line" />
              </div>
            </>
          )}

        {/* =================================================
            EMPTY / COMING SOON
        ================================================= */}

        {!loading &&
          categories.length === 0 && (
            <ComingSoon />
          )}
      </Container>
    </section>
  );
}

/* =========================================================
   CATEGORY CARD
========================================================= */

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <Link
      href={`/${category.slug}`}
      className="category-card"
      aria-label={`Shop ${category.name}`}
    >
      <article className="category-card__surface">
        {/* IMAGE */}

        <div className="category-card__image">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="
                (max-width: 639px) 50vw,
                (max-width: 1023px) 50vw,
                25vw
              "
              className="category-card__image-element"
            />
          ) : (
            <div
              className="category-card__placeholder"
              aria-hidden="true"
            >
              <Sparkles
                size={20}
                strokeWidth={1}
              />
            </div>
          )}

          <div className="category-card__shade" />

          {/* NUMBER */}

          <span className="category-card__number">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* ARROW */}

          <span className="category-card__arrow">
            <ArrowUpRight
              size={18}
              strokeWidth={1.2}
            />
          </span>

          {/* CATEGORY NAME */}

          <div className="category-card__overlay-content">
            <span className="category-card__label">
              Collection
            </span>

            <h3 className="category-card__title">
              {category.name}
            </h3>

            <span className="category-card__shop">
              Shop collection
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* =========================================================
   COMING SOON
========================================================= */

function ComingSoon() {
  return (
    <div className="categories-coming-soon">
      <div className="categories-coming-soon__content">
        <div className="categories-coming-soon__icon">
          <Sparkles
            size={18}
            strokeWidth={1.1}
          />
        </div>

        <p className="categories-coming-soon__eyebrow">
          Coming Soon
        </p>

        <h3 className="categories-coming-soon__title">
          Something special
          <span>
            is being curated.
          </span>
        </h3>

        <p className="categories-coming-soon__description">
          Our featured collections are
          currently being prepared. Check
          back soon for the latest from
          Aayesha Fashion.
        </p>

        <div className="categories-coming-soon__cta">
          <LinkButton
            href="/categories"
            variant="secondary"
            size="md"
            icon={
              <ArrowUpRight
                size={14}
              />
            }
          >
            View All Categories
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function CategorySkeleton() {
  return (
    <div className="category-skeleton">
      <div className="category-skeleton__image" />
      <div className="category-skeleton__meta">
        <span />
        <span />
      </div>
    </div>
  );
}