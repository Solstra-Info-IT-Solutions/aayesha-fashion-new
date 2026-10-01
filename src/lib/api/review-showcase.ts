import { apiFetch } from "@/lib/api";

export interface ShowcaseReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  authorName: string;
  createdAt: string;
  productName: string;
  productImage: string;
}

export interface ReviewShowcase {
  summary: { total: number; average: number };
  reviews: ShowcaseReview[];
}

/** Store-wide best approved reviews (home page). */
export function getReviewShowcase(limit = 6) {
  return apiFetch<ReviewShowcase>(`/reviews/featured?limit=${limit}`);
}
