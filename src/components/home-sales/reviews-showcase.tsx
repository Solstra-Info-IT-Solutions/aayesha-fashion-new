import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { Stars } from "@/components/product/product-reviews";
import { Container } from "@/components/shared/container";
import { getReviewShowcase } from "@/lib/api/review-showcase";

import "./HomeSales.css";

/**
 * Real customer reviews (approved only), with the store-wide rating.
 * Renders nothing until there is at least one, so it never shows a
 * placeholder or invented praise.
 */
export async function ReviewsShowcase() {
  let data;

  try {
    data = await getReviewShowcase(6);
  } catch (error) {
    console.error("REVIEW SHOWCASE ERROR:", error);

    return null;
  }

  if (!data || data.reviews.length === 0) {
    return null;
  }

  return (
    <section className="home-reviews" aria-label="Customer reviews">
      <Container>
        <header className="home-reviews__header">
          <p className="home-reviews__eyebrow">Loved by our customers</p>

          <h2>What shoppers are saying</h2>

          <p className="home-reviews__summary">
            <Stars value={data.summary.average} size={17} />

            <span>
              {data.summary.average.toFixed(1)} average from{" "}
              {data.summary.total} review
              {data.summary.total === 1 ? "" : "s"}
            </span>
          </p>
        </header>

        <ul className="home-reviews__grid">
          {data.reviews.map((review) => (
            <li key={review.id} className="home-reviews__card">
              <Stars value={review.rating} />

              {review.title ? (
                <p className="home-reviews__title">{review.title}</p>
              ) : null}

              <p className="home-reviews__body">{review.body}</p>

              <p className="home-reviews__author">
                {review.authorName}

                {review.verifiedPurchase ? (
                  <span>
                    <BadgeCheck size={13} /> Verified purchase
                  </span>
                ) : null}
              </p>

              <Link
                href={`/products/${review.productId}#reviews`}
                className="home-reviews__product"
              >
                {review.productImage ? (
                  <Image
                    src={review.productImage}
                    alt=""
                    width={44}
                    height={56}
                  />
                ) : null}

                <span>{review.productName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
