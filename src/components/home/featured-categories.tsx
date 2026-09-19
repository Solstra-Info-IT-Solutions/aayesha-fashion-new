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
    <section className="featured-categories">
      <Container>
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="featured-categories__header">
          <p className="featured-categories__eyebrow">
            Featured Categories
          </p>

          <h2 className="featured-categories__title">
            Explore our{" "}
            <span className="featured-categories__title-accent">
              collections.
            </span>
          </h2>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="featured-categories__grid">
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
                  (category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                    />
                  ),
                )}
              </div>

              {/* CTA */}

              <div className="featured-categories__cta">
                <LinkButton
                  href="/categories"
                  variant="secondary"
                  size="lg"
                  icon={
                    <ArrowUpRight
                      size={15}
                    />
                  }
                >
                  Explore All Categories
                </LinkButton>
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
}: {
  category: Category;
}) {
  return (
    <Link
      href={`/${category.slug}`}
      className="category-card"
      aria-label={`Shop ${category.name}`}
    >
      <article className="category-card__surface">
        <div className="category-card__image">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 639px) 92px, (max-width: 1023px) 112px, 132px"
              className="category-card__image-element"
            />
          ) : (
            <div
              className="category-card__placeholder"
              aria-hidden="true"
            >
              <Sparkles
                size={18}
                strokeWidth={1.1}
              />
            </div>
          )}
        </div>

        <h3 className="category-card__title">
          {category.name}
        </h3>
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
        {/* ICON */}

        <div className="categories-coming-soon__icon">
          <Sparkles
            size={18}
            strokeWidth={1.1}
          />
        </div>

        {/* LABEL */}

        <p className="categories-coming-soon__eyebrow">
          Coming Soon
        </p>

        {/* TITLE */}

        <h3 className="categories-coming-soon__title">
          Something special
          <span className="categories-coming-soon__title-accent">
            is being curated.
          </span>
        </h3>

        {/* DESCRIPTION */}

        <p className="categories-coming-soon__description">
          Our featured collections are
          currently being prepared. Check
          back soon for the latest from
          Aayesha Fashion.
        </p>

        {/* CTA */}

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
    </div>
  );
}