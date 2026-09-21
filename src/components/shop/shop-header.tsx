"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChevronDown } from "lucide-react";

import type {
  Product,
  ProductSort,
} from "@/types/product";

import "./ShopHeader.css";

interface ShopHeaderProps {
  products?: Product[];
  selectedCategory?: string;
  selectedSort?: ProductSort;
}

const sortOptions: {
  value: ProductSort;
  label: string;
}[] = [
  {
    value: "relevance",
    label: "Relevance",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "best-selling",
    label: "Best Selling",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Top Rated",
  },
];

function getPageTitle(): string {
  if (typeof window === "undefined") {
    return "Shop";
  }

  const { pathname } = window.location;

  if (
    pathname ===
    "/collections/new-arrivals"
  ) {
    return "New Arrivals";
  }

  if (
    pathname ===
    "/collections/best-sellers"
  ) {
    return "Best Sellers";
  }

  return "Shop";
}

function buildCurrentPath(
  pathname: string,
  params: URLSearchParams,
): string {
  const query = params.toString();

  return query
    ? `${pathname}?${query}`
    : pathname;
}

export function ShopHeader({
  products = [],
  selectedSort = "relevance",
}: ShopHeaderProps) {
  const [sortOpen, setSortOpen] =
    useState(false);

  const sortRef =
    useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(
    () => getPageTitle(),
    [],
  );

  const activeSort =
    sortOptions.find(
      (option) =>
        option.value === selectedSort,
    ) ?? sortOptions[0];

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node,
        )
      ) {
        setSortOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function handleSortChange(
    value: ProductSort,
  ) {
    const pathname =
      window.location.pathname;

    const params =
      new URLSearchParams(
        window.location.search,
      );

    if (value === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSortOpen(false);

    window.location.href =
      buildCurrentPath(
        pathname,
        params,
      );
  }

  return (
    <header className="shop-header">
      <div className="shop-header__heading">
        <h1 className="shop-header__title">
          {pageTitle}
        </h1>
      </div>

      <div className="shop-header__toolbar">
        <div className="shop-header__count">
          <span
            className="shop-header__count-dot"
            aria-hidden="true"
          />

          <span>
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </span>
        </div>

        <div
          ref={sortRef}
          className="shop-header__sort"
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={sortOpen}
            onClick={() =>
              setSortOpen(
                (current) => !current,
              )
            }
            className={`shop-header__sort-button ${
              sortOpen
                ? "shop-header__sort-button--open"
                : ""
            }`}
          >
            <span className="shop-header__sort-label">
              Sort:
            </span>

            <span className="shop-header__sort-value">
              {activeSort.label}
            </span>

            <ChevronDown
              size={12}
              strokeWidth={1.4}
              className="shop-header__sort-icon"
              aria-hidden="true"
            />
          </button>

          {sortOpen && (
            <div
              role="menu"
              className="shop-header__sort-menu"
            >
              {sortOptions.map(
                (option) => {
                  const active =
                    option.value ===
                    selectedSort;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        handleSortChange(
                          option.value,
                        )
                      }
                      className={`shop-header__sort-option ${
                        active
                          ? "shop-header__sort-option--active"
                          : ""
                      }`}
                    >
                      <span>
                        {option.label}
                      </span>

                      {active && (
                        <span
                          className="shop-header__option-dot"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}