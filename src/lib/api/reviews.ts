import { apiFetch } from "@/lib/api";

export interface PublicReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  authorName: string;
  createdAt: string;
}

export interface OwnReview extends PublicReview {
  productName: string;
  productSlug?: string;
  productImage?: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string;
  updatedAt: string;
}

export interface ProductReviewsResponse {
  reviews: PublicReview[];
  summary: {
    total: number;
    average: number;
    distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewEligibility {
  hasReview: boolean;
  review: OwnReview | null;
  canReview: boolean;
  purchased: boolean;
}

export interface ReviewInput {
  rating: number;
  title: string;
  body: string;
}

export function getProductReviews(
  productId: string,
  options: { page?: number; sort?: string } = {},
) {
  const params = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: "6",
    sort: options.sort ?? "newest",
  });

  return apiFetch<ProductReviewsResponse>(
    `/reviews/product/${encodeURIComponent(productId)}?${params}`,
  );
}

export function getReviewEligibility(
  productId: string,
  accessToken: string,
) {
  return apiFetch<ReviewEligibility>(
    `/reviews/product/${encodeURIComponent(productId)}/eligibility`,
    { accessToken },
  );
}

export function createReview(
  productId: string,
  input: ReviewInput,
  accessToken: string,
) {
  return apiFetch<OwnReview>("/reviews", {
    method: "POST",
    accessToken,
    body: JSON.stringify({ productId, ...input }),
  });
}

export function updateReview(
  id: string,
  input: ReviewInput,
  accessToken: string,
) {
  return apiFetch<OwnReview>(`/reviews/${encodeURIComponent(id)}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export function deleteReview(id: string, accessToken: string) {
  return apiFetch<{ deleted: true }>(
    `/reviews/${encodeURIComponent(id)}`,
    { method: "DELETE", accessToken },
  );
}

export function getMyReviews(accessToken: string) {
  return apiFetch<OwnReview[]>("/reviews/mine", { accessToken });
}
