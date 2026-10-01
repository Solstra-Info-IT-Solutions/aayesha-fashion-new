"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getProductInsights,
  type ProductInsight,
  type ProductInsightMap,
} from "@/lib/api/product-insights";

const InsightsContext = createContext<ProductInsightMap>({});

/**
 * Fetches real ratings and 7-day sales once for every product on a
 * listing, so each card can show them without its own request.
 */
export function ProductInsightsProvider({
  productIds,
  children,
}: {
  productIds: string[];
  children: ReactNode;
}) {
  const [insights, setInsights] = useState<ProductInsightMap>({});

  // Stable key so a new array with the same ids does not refetch.
  const key = useMemo(
    () => [...new Set(productIds)].slice(0, 60).sort().join(","),
    [productIds],
  );

  useEffect(() => {
    if (!key) {
      return;
    }

    let cancelled = false;

    getProductInsights(key.split(","))
      .then((result) => {
        if (!cancelled) setInsights(result);
      })
      .catch(() => {
        if (!cancelled) setInsights({});
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <InsightsContext.Provider value={insights}>
      {children}
    </InsightsContext.Provider>
  );
}

/** Insight for one product, or null outside a provider / before load. */
export function useProductInsight(productId: string): ProductInsight | null {
  return useContext(InsightsContext)[productId] ?? null;
}
