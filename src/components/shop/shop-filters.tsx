"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  RotateCcw,
} from "lucide-react";

import type { Product } from "@/types/product";
import { getInventoryStatus } from "@/types/product";

import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";

import { FilterSection } from "./filter-section";
import "./ShopFilters.css";

interface ShopFiltersProps {
  products: Product[];
  selectedCategory?: string;
  mobile?: boolean;
  onClose?: () => void;
}

type FilterSectionKey =
  | "category"
  | "price"
  | "availability";

type Availability =
  | "in-stock"
  | "out-of-stock";

const availabilityLabels: Record<
  Availability,
  string
> = {
  "in-stock": "In Stock",
  "out-of-stock": "Out of Stock",
};

const priceRanges = [
  {
    label: "Under ₹5,000",
    min: 0,
    max: 5000,
  },
  {
    label: "₹5,000 – ₹8,000",
    min: 5000,
    max: 8000,
  },
  {
    label: "₹8,000 – ₹12,000",
    min: 8000,
    max: 12000,
  },
  {
    label: "Above ₹12,000",
    min: 12000,
    max: Infinity,
  },
];

const sectionLabels: Record<
  FilterSectionKey,
  string
> = {
  category: "Category",
  price: "Price",
  availability: "Availability",
};

function getCollectionBasePath(): string {
  if (typeof window === "undefined") {
    return "/shop";
  }

  const { pathname } = window.location;

  if (
    pathname ===
    "/collections/new-arrivals"
  ) {
    return pathname;
  }

  if (
    pathname ===
    "/collections/best-sellers"
  ) {
    return pathname;
  }

  return "/shop";
}

function buildFilterHref(
  key: string,
  value: string,
): string {
  const params = new URLSearchParams(
    window.location.search,
  );

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const query = params.toString();
  const pathname = getCollectionBasePath();

  return query
    ? `${pathname}?${query}`
    : pathname;
}

function getInitialPrice(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(
    window.location.search,
  );

  const min = params.get("minPrice");
  const max = params.get("maxPrice");

  return (
    priceRanges.find(
      (range) =>
        String(range.min) === min &&
        String(range.max) === max,
    )?.label ?? null
  );
}

export function ShopFilters({
  products,
  selectedCategory,
  mobile = false,
  onClose,
}: ShopFiltersProps) {
  const [openSections, setOpenSections] =
    useState<FilterSectionKey[]>([
      "category",
      "price",
      "availability",
    ]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [selectedPrice, setSelectedPrice] =
    useState<string | null>(
      getInitialPrice(),
    );

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const result =
          await getCategories();

        if (mounted) {
          setCategories(result);
        }
      } catch {
        if (mounted) {
          setCategories([]);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return categories;
    }

    const ids = new Set<string>();

    products.forEach((product) => {
      if (product.categoryId) {
        ids.add(product.categoryId);
      }
    });

    return Array.from(ids).map(
      (id) =>
        ({
          id,
          name: id,
          slug: id,
        }) as Category,
    );
  }, [categories, products]);

  const availabilityOptions =
    useMemo<Availability[]>(() => {
      const values =
        new Set<Availability>();

      products.forEach((product) => {
        const status =
          getInventoryStatus(product);

        values.add(
          status === "out-of-stock"
            ? "out-of-stock"
            : "in-stock",
        );
      });

      return Array.from(values);
    }, [products]);

  function toggleSection(
    section: FilterSectionKey,
  ) {
    setOpenSections((current) =>
      current.includes(section)
        ? current.filter(
            (item) => item !== section,
          )
        : [...current, section],
    );
  }

  function resetFilters() {
    setSelectedPrice(null);
    window.location.href =
      getCollectionBasePath();
  }

  function handlePriceChange(
    label: string,
    min: number,
    max: number,
  ) {
    setSelectedPrice(label);

    const params = new URLSearchParams(
      window.location.search,
    );

    params.set("minPrice", String(min));

    if (Number.isFinite(max)) {
      params.set("maxPrice", String(max));
    } else {
      params.delete("maxPrice");
    }

    const query = params.toString();
    const pathname = getCollectionBasePath();

    window.location.href = query
      ? `${pathname}?${query}`
      : pathname;
  }

  return (
    <aside
      className={
        mobile
          ? "shop-filters shop-filters--mobile"
          : "shop-filters shop-filters--desktop"
      }
    >
      <header className="shop-filters__header">
        <div>
          <p className="shop-filters__eyebrow">
            Refine
          </p>

          <h2 className="shop-filters__title">
            Shop by
          </h2>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="shop-filters__reset"
        >
          <RotateCcw
            size={12}
            strokeWidth={1.4}
          />

          <span>Reset</span>
        </button>
      </header>

      <div className="shop-filters__sections">
        <FilterSection
          title={sectionLabels.category}
          open={openSections.includes(
            "category",
          )}
          onToggle={() =>
            toggleSection("category")
          }
        >
          <div className="shop-filters__list">
            {categoryOptions.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category.id;

                const count =
                  products.filter(
                    (product) =>
                      product.categoryId ===
                      category.id,
                  ).length;

                return (
                  <Link
                    key={category.id}
                    href={buildFilterHref(
                      "category",
                      category.id,
                    )}
                    onClick={onClose}
                    className={`shop-filters__category ${
                      active
                        ? "shop-filters__category--active"
                        : ""
                    }`}
                  >
                    <span className="shop-filters__category-name">
                      <span
                        className="shop-filters__category-dot"
                        aria-hidden="true"
                      />

                      <span>
                        {category.name}
                      </span>
                    </span>

                    <span className="shop-filters__count">
                      {count}
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        </FilterSection>

        <FilterSection
          title={sectionLabels.price}
          open={openSections.includes(
            "price",
          )}
          onToggle={() =>
            toggleSection("price")
          }
        >
          <div className="shop-filters__list">
            {priceRanges.map((range) => {
              const active =
                selectedPrice ===
                range.label;

              return (
                <label
                  key={range.label}
                  className={`shop-filters__price ${
                    active
                      ? "shop-filters__price--active"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={
                      mobile
                        ? "mobile-price"
                        : "desktop-price"
                    }
                    checked={active}
                    onChange={() =>
                      handlePriceChange(
                        range.label,
                        range.min,
                        range.max,
                      )
                    }
                  />

                  <span
                    className="shop-filters__radio"
                    aria-hidden="true"
                  />

                  <span className="shop-filters__price-label">
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection
          title={
            sectionLabels.availability
          }
          open={openSections.includes(
            "availability",
          )}
          onToggle={() =>
            toggleSection(
              "availability",
            )
          }
        >
          <div className="shop-filters__list">
            {availabilityOptions.map(
              (status) => (
                <Link
                  key={status}
                  href={
                    status === "in-stock"
                      ? buildFilterHref(
                          "availability",
                          status,
                        )
                      : buildFilterHref(
                          "availability",
                          "",
                        )
                  }
                  onClick={onClose}
                  className="shop-filters__availability"
                >
                  <span
                    className={`shop-filters__availability-dot ${
                      status === "in-stock"
                        ? "shop-filters__availability-dot--available"
                        : "shop-filters__availability-dot--sold"
                    }`}
                    aria-hidden="true"
                  />

                  <span>
                    {availabilityLabels[
                      status
                    ]}
                  </span>
                </Link>
              ),
            )}
          </div>
        </FilterSection>
      </div>

      {!mobile && (
        <div className="shop-filters__note">
          <p className="shop-filters__note-title">
            Find your signature style
          </p>

          <p className="shop-filters__note-text">
            Explore refined silhouettes
            designed for celebrations,
            everyday elegance and modern
            Indian dressing.
          </p>
        </div>
      )}
    </aside>
  );
}