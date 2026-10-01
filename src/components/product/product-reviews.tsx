"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import toast from "react-hot-toast";

import {
  createReview,
  getProductReviews,
  getReviewEligibility,
  type ProductReviewsResponse,
  type ReviewEligibility,
} from "@/lib/api/reviews";
import { useAuthStore } from "@/store/auth-store";
import type { Product } from "@/types/product";

import "./ProductReviews.css";

interface ProductReviewsProps {
  product: Product;
}

export function Stars({
  value,
  size = 15,
}: {
  value: number;
  size?: number;
}) {
  return (
    <span
      className="product-reviews__stars"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.4}
          className={
            n <= Math.round(value)
              ? "product-reviews__star product-reviews__star--on"
              : "product-reviews__star"
          }
        />
      ))}
    </span>
  );
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export function ProductReviews({ product }: ProductReviewsProps) {
  const productId = product._id;

  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(
    null,
  );

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProductReviews(productId, { page, sort })
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFailed(false);
      })
      .catch((error) => {
        console.error("Load reviews error:", error);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, page, sort]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    let cancelled = false;

    getReviewEligibility(productId, accessToken)
      .then((result) => {
        if (!cancelled) setEligibility(result);
      })
      .catch(() => {
        if (!cancelled) setEligibility(null);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, isAuthenticated, accessToken]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!accessToken || submitting) return;

    if (rating < 1) {
      toast.error("Please choose a star rating.");
      return;
    }

    try {
      setSubmitting(true);

      const review = await createReview(
        productId,
        { rating, title, body },
        accessToken,
      );

      setEligibility({
        hasReview: true,
        review,
        canReview: false,
        purchased: true,
      });

      setRating(0);
      setTitle("");
      setBody("");

      toast.success("Thank you! Your review will appear once approved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const summary = data?.summary;

  return (
    <section
      id="reviews"
      aria-label="Customer reviews"
      className="product-reviews"
    >
      <div className="product-reviews__inner">
        <header className="product-reviews__head">
          <p className="product-reviews__eyebrow">Reviews</p>
          <h2 className="product-reviews__heading">Customer reviews</h2>
        </header>

        {loading ? (
          <p className="product-reviews__muted">Loading reviews…</p>
        ) : failed ? (
          <p className="product-reviews__muted">
            Reviews are unavailable right now.
          </p>
        ) : (
          <div className="product-reviews__layout">
            {/* SUMMARY */}
            <aside className="product-reviews__summary">
              <p className="product-reviews__average">
                {summary && summary.total > 0 ? summary.average.toFixed(1) : "–"}
              </p>

              <Stars value={summary?.average ?? 0} size={18} />

              <p className="product-reviews__muted">
                {summary?.total
                  ? `Based on ${summary.total} review${summary.total === 1 ? "" : "s"}`
                  : "No reviews yet"}
              </p>

              <ul className="product-reviews__bars">
                {([5, 4, 3, 2, 1] as const).map((n) => {
                  const count = summary?.distribution[String(n) as "1"] ?? 0;
                  const percent = summary?.total
                    ? (count / summary.total) * 100
                    : 0;

                  return (
                    <li key={n}>
                      <span>{n}★</span>
                      <span className="product-reviews__bar">
                        <span style={{ width: `${percent}%` }} />
                      </span>
                      <span>{count}</span>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* LIST + FORM */}
            <div className="product-reviews__main">
              {/* WRITE */}
              <div className="product-reviews__write">
                {!isAuthenticated ? (
                  <p className="product-reviews__muted">
                    <Link
                      href={`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`}
                    >
                      Log in
                    </Link>{" "}
                    to write a review.
                  </p>
                ) : eligibility?.hasReview ? (
                  <p className="product-reviews__muted">
                    You have reviewed this product
                    {eligibility.review?.status === "pending"
                      ? " (awaiting approval)"
                      : ""}
                    .{" "}
                    <Link href="/account/reviews">Manage in your account</Link>
                  </p>
                ) : eligibility?.canReview ? (
                  <form onSubmit={handleSubmit} className="product-reviews__form">
                    <p className="product-reviews__form-title">
                      Write a review
                    </p>

                    <div
                      className="product-reviews__rate"
                      role="radiogroup"
                      aria-label="Your rating"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={rating === n}
                          aria-label={`${n} star${n === 1 ? "" : "s"}`}
                          onClick={() => setRating(n)}
                        >
                          <Star
                            size={24}
                            strokeWidth={1.4}
                            className={
                              n <= rating
                                ? "product-reviews__star product-reviews__star--on"
                                : "product-reviews__star"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={180}
                      placeholder="Title (optional)"
                      className="product-reviews__input"
                    />

                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      maxLength={3000}
                      rows={4}
                      required
                      minLength={10}
                      placeholder="Share your experience with this product"
                      className="product-reviews__input"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="product-reviews__submit"
                    >
                      {submitting ? "Submitting…" : "Submit review"}
                    </button>
                  </form>
                ) : (
                  <p className="product-reviews__muted">
                    Reviews can be written after your order of this product is
                    delivered.
                  </p>
                )}
              </div>

              {/* LIST */}
              {data && data.reviews.length > 0 ? (
                <>
                  <div className="product-reviews__sort">
                    <label htmlFor="review-sort">Sort by</label>
                    <select
                      id="review-sort"
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="highest">Highest rated</option>
                      <option value="lowest">Lowest rated</option>
                    </select>
                  </div>

                  <ul className="product-reviews__list">
                    {data.reviews.map((review) => (
                      <li key={review.id} className="product-reviews__item">
                        <div className="product-reviews__item-head">
                          <Stars value={review.rating} />
                          <span className="product-reviews__muted">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        {review.title ? (
                          <p className="product-reviews__item-title">
                            {review.title}
                          </p>
                        ) : null}

                        <p className="product-reviews__item-body">
                          {review.body}
                        </p>

                        <p className="product-reviews__author">
                          {review.authorName}
                          {review.verifiedPurchase ? (
                            <span className="product-reviews__verified">
                              <BadgeCheck size={13} /> Verified purchase
                            </span>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {data.pagination.totalPages > 1 ? (
                    <div className="product-reviews__pager">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </button>

                      <span>
                        Page {page} of {data.pagination.totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={page >= data.pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="product-reviews__muted">
                  Be the first to share your experience with this piece.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
