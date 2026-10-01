"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getInventoryStatus,
  getProductStartingPrice,
  type Product,
} from "@/types/product";

import "@/components/listing-sales/ListingSales.css";
import "./SearchSales.css";

export type SearchSort =
  | "relevance"
  | "price-low"
  | "price-high"
  | "newest"
  | "best-selling";

type ChipId = "stock" | "u3" | "u5" | "sale";

const CHIPS: Array<{ id: ChipId; label: string }> = [
  { id: "stock", label: "In stock" },
  { id: "sale", label: "On sale" },
  { id: "u3", label: "Under ₹3,000" },
  { id: "u5", label: "Under ₹5,000" },
];

const SORTS: Array<{ id: SearchSort; label: string }> = [
  { id: "relevance", label: "Best match" },
  { id: "best-selling", label: "Best selling" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
];

/**
 * Chips + sort over the loaded results (client side), keeping sold-out
 * pieces at the end so shoppers see what they can buy first.
 */
export function useRefinedResults(products: Product[]) {
  const [active, setActive] = useState<ChipId[]>([]);
  const [sort, setSort] = useState<SearchSort>("relevance");

  const refined = useMemo(() => {
    let list = [...products];

    if (active.includes("stock")) {
      list = list.filter(
        (product) => getInventoryStatus(product) !== "out-of-stock",
      );
    }

    if (active.includes("sale")) {
      list = list.filter(
        (product) => (product.pricing?.mrp ?? 0) > (product.pricing?.sellingPrice ?? 0),
      );
    }

    if (active.includes("u3")) {
      list = list.filter((product) => getProductStartingPrice(product) <= 3000);
    }

    if (active.includes("u5")) {
      list = list.filter((product) => getProductStartingPrice(product) <= 5000);
    }

    switch (sort) {
      case "price-low":
        list.sort((a, b) => getProductStartingPrice(a) - getProductStartingPrice(b));
        break;
      case "price-high":
        list.sort((a, b) => getProductStartingPrice(b) - getProductStartingPrice(a));
        break;
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "best-selling":
        list.sort(
          (a, b) =>
            Number(b.merchandising?.isBestSeller ?? false) -
            Number(a.merchandising?.isBestSeller ?? false),
        );
        break;
      default:
        break;
    }

    const available = list.filter(
      (product) => getInventoryStatus(product) !== "out-of-stock",
    );
    const soldOut = list.filter(
      (product) => getInventoryStatus(product) === "out-of-stock",
    );

    return [...available, ...soldOut];
  }, [products, active, sort]);

  const toggle = (id: ChipId) =>
    setActive((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current.filter((item) => !(id === "u3" && item === "u5") && !(id === "u5" && item === "u3")), id],
    );

  return { refined, active, toggle, sort, setSort };
}

export function SearchRefineBar({
  active,
  toggle,
  sort,
  setSort,
  shown,
  total,
}: {
  active: ChipId[];
  toggle: (id: ChipId) => void;
  sort: SearchSort;
  setSort: (sort: SearchSort) => void;
  shown: number;
  total: number;
}) {
  return (
    <div className="search-refine">
      <div className="quick-filters" role="group" aria-label="Refine pieces">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active.includes(chip.id)}
            onClick={() => toggle(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <label className="search-refine__sort">
        <span>
          {shown === total ? `${total} pieces` : `${shown} of ${total} pieces`}
        </span>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SearchSort)}
          aria-label="Sort pieces"
        >
          {SORTS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/** "Can't find it?" help: a prefilled WhatsApp message with the search. */
export function SearchHelpCta({ term }: { term: string }) {
  const message = term
    ? `Hi Aayesha Fashion, I searched for "${term}" but could not find it. Can you help?`
    : "Hi Aayesha Fashion, I am looking for an outfit. Can you help?";

  return (
    <div className="search-help">
      <div>
        <p className="search-help__title">Can&apos;t find what you want?</p>

        <p className="search-help__text">
          Tell us what you are looking for and we will help you find it.
        </p>
      </div>

      <a
        href={`https://wa.me/${siteConfig.contact.phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={16} strokeWidth={1.6} />
        Ask on WhatsApp
      </a>
    </div>
  );
}

export function SearchPopularLinks() {
  return (
    <p className="search-help__links">
      Looking for ideas?{" "}
      <Link href="/shop/festive-wear-for-women">Festive wear</Link>
      {" · "}
      <Link href="/shop/wedding-guest-outfits">Wedding guest</Link>
      {" · "}
      <Link href="/shop/ethnic-wear-under-3000">Under ₹3,000</Link>
    </p>
  );
}
