"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

import { Stars } from "@/components/product/product-reviews";
import { ReviewMediaGrid } from "@/components/product/review-media-grid";
import { ReviewMediaPicker } from "@/components/product/review-media-picker";
import {
  deleteReview,
  getMyReviews,
  updateReview,
  type OwnReview,
  type OwnReviewMedia,
} from "@/lib/api/reviews";
import { useAuthStore } from "@/store/auth-store";

import "./AccountReviews.css";

const STATUS_LABEL: Record<OwnReview["status"], string> = {
  pending: "Awaiting approval",
  approved: "Published",
  rejected: "Not published",
};

export function AccountReviews() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [reviews, setReviews] = useState<OwnReview[] | null>(null);
  const [failed, setFailed] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<OwnReviewMedia[]>([]);
  const [busy, setBusy] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    getMyReviews(accessToken)
      .then((result) => {
        if (cancelled) return;
        setReviews(result);
        setFailed(false);
      })
      .catch((error) => {
        console.error("Load my reviews error:", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, reloadKey]);

  function startEdit(review: OwnReview) {
    setEditingId(review.id);
    setRating(review.rating);
    setTitle(review.title);
    setBody(review.body);
    setMedia(review.media ?? []);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();

    if (!accessToken || busy) return;

    try {
      setBusy(true);
      await updateReview(editingId, { rating, title, body, media }, accessToken);
      toast.success("Review updated. It will be re-checked before publishing.");
      setEditingId("");
      setReloadKey((key) => key + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update review.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(review: OwnReview) {
    if (!accessToken || busy) return;

    if (!window.confirm("Delete this review?")) return;

    try {
      setBusy(true);
      await deleteReview(review.id, accessToken);
      toast.success("Review deleted.");
      setReloadKey((key) => key + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete review.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="account-reviews">
      <p className="account-reviews__eyebrow">My Account</p>
      <h1 className="account-reviews__title">My reviews</h1>

      {!isInitialized || (reviews === null && !failed) ? (
        <p className="account-reviews__muted">Loading your reviews…</p>
      ) : failed ? (
        <p className="account-reviews__muted">
          We could not load your reviews. Please try again.
        </p>
      ) : reviews && reviews.length === 0 ? (
        <p className="account-reviews__muted">
          You have not written any reviews yet. Once an order is delivered you
          can review the products from their product page.
        </p>
      ) : (
        <ul className="account-reviews__list">
          {reviews?.map((review) => (
            <li key={review.id} className="account-reviews__card">
              <div className="account-reviews__top">
                <Link
                  href={`/products/${review.productId}`}
                  className="account-reviews__product"
                >
                  {review.productName || "Product"}
                </Link>

                <span
                  className={`account-reviews__status account-reviews__status--${review.status}`}
                >
                  {STATUS_LABEL[review.status]}
                </span>
              </div>

              {editingId === review.id ? (
                <form onSubmit={save} className="account-reviews__form">
                  <div className="account-reviews__rate">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} stars`}
                        onClick={() => setRating(n)}
                      >
                        <Star
                          size={22}
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
                    className="account-reviews__input"
                  />

                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    minLength={10}
                    maxLength={3000}
                    required
                    className="account-reviews__input"
                  />

                  {accessToken ? (
                    <ReviewMediaPicker
                      value={media}
                      onChange={setMedia}
                      accessToken={accessToken}
                    />
                  ) : null}

                  <div className="account-reviews__actions">
                    <button type="submit" disabled={busy}>
                      Save changes
                    </button>

                    <button type="button" onClick={() => setEditingId("")}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <Stars value={review.rating} />

                  {review.title ? (
                    <p className="account-reviews__review-title">
                      {review.title}
                    </p>
                  ) : null}

                  <p className="account-reviews__body">{review.body}</p>

                  <ReviewMediaGrid media={review.media ?? []} />

                  {review.status === "rejected" && review.adminNote ? (
                    <p className="account-reviews__note">
                      Note from the store: {review.adminNote}
                    </p>
                  ) : null}

                  <div className="account-reviews__actions">
                    <button type="button" onClick={() => startEdit(review)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void remove(review)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
