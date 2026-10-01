import { API_BASE_URL, ApiError, apiFetch } from "@/lib/api";

export interface ReviewMedia {
  type: "image" | "video";
  url: string;
}

/** Media of an own review / fresh upload; publicId lets edits keep it. */
export interface OwnReviewMedia extends ReviewMedia {
  publicId: string;
}

export const MAX_REVIEW_MEDIA = 5;
export const MAX_REVIEW_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_REVIEW_VIDEO_BYTES = 25 * 1024 * 1024;

export interface PublicReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  media: ReviewMedia[];
  authorName: string;
  createdAt: string;
}

export interface OwnReview extends Omit<PublicReview, "media"> {
  media: OwnReviewMedia[];
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
  media: OwnReviewMedia[];
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

/** Multipart upload — apiFetch forces JSON headers, so use fetch directly. */
export async function uploadReviewMedia(
  file: File,
  accessToken: string,
): Promise<OwnReviewMedia> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_BASE_URL}/reviews/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
    credentials: "include",
  });

  let result: {
    success?: boolean;
    data?: OwnReviewMedia;
    error?: { code?: string; message?: string };
  } | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok || !result?.success || !result.data) {
    throw new ApiError(
      result?.error?.message || "Upload failed. Please try again.",
      response.status,
      result?.error?.code || "UPLOAD_FAILED",
    );
  }

  return result.data;
}
