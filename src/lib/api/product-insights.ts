import { apiFetch } from "@/lib/api";

export interface ProductInsight {
  rating: number;
  reviews: number;
  /** Real units sold in the last 7 days. */
  soldLast7Days: number;
}

export type ProductInsightMap = Record<string, ProductInsight>;

/** Real ratings and recent sales for a batch of listing cards. */
export function getProductInsights(ids: string[]) {
  return apiFetch<ProductInsightMap>(
    `/products/insights?ids=${ids.map(encodeURIComponent).join(",")}`,
  );
}
