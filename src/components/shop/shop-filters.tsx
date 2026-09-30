"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  RotateCcw,
} from "lucide-react";

import type { Product } from "@/types/product";

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

function getCollectionBasePath(
  pathname: string,
): string {
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

/*
 * Built from the router's own pathname and query string, so the
 * same href is produced on the server and in the browser.
 */
function buildFilterHref(
  key: string,
  value: string,
  search: string,
  pathname: string,
): string {
  const params = new URLSearchParams(search);

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const query = params.toString();
  const basePath =
    getCollectionBasePath(pathname);

  return query
    ? `${basePath}?${query}`
    : basePath;
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
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  const urlParams = new URLSearchParams(search);

  const activeCount =
    (urlParams.get("category") ? 1 : 0) +
    (urlParams.get("minPrice") ? 1 : 0) +
    (urlParams.get("availability") ? 1 : 0);

  const inStockOnly =
    urlParams.get("availability") === "in-stock";

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
    router.push(
      getCollectionBasePath(pathname),
    );
  }

  function handlePriceChange(
    label: string,
    min: number,
    max: number,
  ) {
    setSelectedPrice(label);

    const params = new URLSearchParams(search);

    params.set("minPrice", String(min));

    if (Number.isFinite(max)) {
      params.set("maxPrice", String(max));
    } else {
      params.delete("maxPrice");
    }

    const query = params.toString();
    const basePath =
      getCollectionBasePath(pathname);

    router.push(
      query
        ? `${basePath}?${query}`
        : basePath,
    );
  }

  return (
    <aside
      className={
        mobile
          ? "shop-filters shop-filters--mobile"
          : "shop-filters shop-filters--desktop"
      }
    >
      {(!mobile || activeCount > 0) && (
      <header className="shop-filters__header">
        <div>
          <h2 className="shop-filters__title">
            Filters
          </h2>

          {activeCount > 0 && (
            <p className="shop-filters__applied">
              {activeCount} applied
            </p>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              resetFilters();
              onClose?.();
            }}
            className="shop-filters__reset"
          >
            <RotateCcw
              size={12}
              strokeWidth={1.6}
            />

            <span>Clear all</span>
          </button>
        )}
      </header>
      )}

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

                /* Categories with nothing to show only add noise. */
                if (count === 0 && !active) {
                  return null;
                }

                return (
                  <Link
                    key={category.id}
                    href={buildFilterHref(
                      "category",
                      category.id,
                      search,
                      pathname,
                    )}
                    onClick={onClose}
                    className={`shop-filters__category ${
                      active
                        ? "shop-filters__category--active"
                        : ""
                    }`}
                  >
                    <span className="shop-filters__category-name">
                      {category.name}
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
          <div className="shop-filters__chips shop-filters__chips--price">
            {priceRanges.map((range) => {
              const active =
                selectedPrice ===
                range.label;

              return (
                <label
                  key={range.label}
                  className={`shop-filters__chip ${
                    active
                      ? "shop-filters__chip--selected"
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
                    onChange={() => {
                      handlePriceChange(
                        range.label,
                        range.min,
                        range.max,
                      );

                      onClose?.();
                    }}
                    className="shop-filters__chip-input"
                  />

                  {range.label}
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
          <div className="shop-filters__chips">
            <Link
              href={buildFilterHref(
                "availability",
                "",
                search,
                pathname,
              )}
              onClick={onClose}
              aria-current={
                !inStockOnly ? "true" : undefined
              }
              className="shop-filters__chip"
            >
              All
            </Link>

            <Link
              href={buildFilterHref(
                "availability",
                "in-stock",
                search,
                pathname,
              )}
              onClick={onClose}
              aria-current={
                inStockOnly ? "true" : undefined
              }
              className="shop-filters__chip"
            >
              In stock
            </Link>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}