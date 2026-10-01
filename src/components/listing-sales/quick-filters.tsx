"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import "./ListingSales.css";

type Chip = {
  id: string;
  label: string;
  /** Query params this chip sets / removes. */
  params: Record<string, string>;
};

const CHIPS: Chip[] = [
  { id: "stock", label: "In stock", params: { availability: "in-stock" } },
  { id: "u3", label: "Under ₹3,000", params: { maxPrice: "3000" } },
  { id: "u5", label: "Under ₹5,000", params: { maxPrice: "5000" } },
];

/** One-tap filters that reuse the listing's existing URL filters. */
export function QuickFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (chip: Chip) =>
    Object.entries(chip.params).every(
      ([name, value]) => searchParams.get(name) === value,
    );

  function toggle(chip: Chip) {
    const next = new URLSearchParams(searchParams.toString());

    if (isActive(chip)) {
      Object.keys(chip.params).forEach((name) => next.delete(name));
    } else {
      // The two price chips are mutually exclusive.
      Object.entries(chip.params).forEach(([name, value]) =>
        next.set(name, value),
      );
    }

    const query = next.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="quick-filters" role="group" aria-label="Quick filters">
      {CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          aria-pressed={isActive(chip)}
          onClick={() => toggle(chip)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
