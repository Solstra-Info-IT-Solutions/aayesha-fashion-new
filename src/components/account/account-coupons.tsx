"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  Percent,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getAvailableCustomerCoupons,
  type AvailableCustomerCoupon,
} from "@/services/coupon.service";

import "./AccountCoupons.css";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null) => {
  if (!value) {
    return "No expiry";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No expiry";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getDiscountLabel = (
  coupon: AvailableCustomerCoupon,
) => {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}% OFF`;
  }

  if (coupon.discountType === "fixed") {
    return `${formatCurrency(coupon.discountValue)} OFF`;
  }

  return "FREE SHIPPING";
};

const getDiscountIcon = (
  discountType: AvailableCustomerCoupon["discountType"],
) => {
  if (discountType === "free_shipping") {
    return Truck;
  }

  if (discountType === "percentage") {
    return Percent;
  }

  return Tag;
};

export function AccountCoupons() {
  const router = useRouter();

  const [coupons, setCoupons] = useState<
    AvailableCustomerCoupon[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [copiedCode, setCopiedCode] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCoupons() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAvailableCustomerCoupons();

        if (!cancelled) {
          setCoupons(data);
        }
      } catch (err) {
        console.error(
          "Failed to load customer coupons:",
          err,
        );

        if (!cancelled) {
          setError(
            "We couldn't load the available coupons right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCoupons();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(code);

      toast.success("Coupon code copied.");

      window.setTimeout(() => {
        setCopiedCode((current) =>
          current === code ? null : current,
        );
      }, 1800);
    } catch (err) {
      console.error(
        "Failed to copy coupon:",
        err,
      );

      toast.error(
        "Unable to copy the coupon code.",
      );
    }
  }

  function handleUseCoupon(code: string) {
    const normalizedCode = code
      .trim()
      .toUpperCase();

    if (!normalizedCode) {
      toast.error("Invalid coupon code.");
      return;
    }

    router.push(
      `/checkout?coupon=${encodeURIComponent(
        normalizedCode,
      )}`,
    );
  }

  return (
    <main className="account-coupons">
      <div className="account-coupons__container">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="account-coupons__header">
          <div className="account-coupons__eyebrow">
            <span
              className="account-coupons__eyebrow-line"
              aria-hidden="true"
            />

            <span>Exclusive Offers</span>
          </div>

          <div className="account-coupons__heading-row">
            <div>
              <h1 className="account-coupons__title">
                My Coupons
              </h1>

              <p className="account-coupons__description">
                Discover available offers and use a
                coupon code at checkout to enjoy your
                savings.
              </p>
            </div>

            <Link
              href="/shop"
              className="account-coupons__shop-link"
            >
              <span>Continue Shopping</span>

              <span
                className="account-coupons__shop-arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </header>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="account-coupons__grid"
            aria-label="Loading coupons"
          >
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <article
                  key={index}
                  className="account-coupons__skeleton"
                >
                  <div className="account-coupons__skeleton-top" />

                  <div className="account-coupons__skeleton-line account-coupons__skeleton-line--large" />

                  <div className="account-coupons__skeleton-line" />

                  <div className="account-coupons__skeleton-line account-coupons__skeleton-line--short" />

                  <div className="account-coupons__skeleton-button" />
                </article>
              ),
            )}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <section className="account-coupons__state">
            <div className="account-coupons__state-mark">
              !
            </div>

            <h2>
              Unable to load coupons
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="account-coupons__retry"
              onClick={() => {
                window.location.reload();
              }}
            >
              Try Again
            </button>
          </section>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          coupons.length === 0 && (
            <section className="account-coupons__state">
              <div className="account-coupons__state-mark">
                <ShoppingBag
                  size={22}
                  strokeWidth={1.35}
                />
              </div>

              <h2>
                No active offers right now
              </h2>

              <p>
                New offers may appear here as they
                become available.
              </p>

              <Link
                href="/shop"
                className="account-coupons__retry"
              >
                Explore the Collection
              </Link>
            </section>
          )}

        {/* =================================================
            COUPONS
        ================================================= */}

        {!loading &&
          !error &&
          coupons.length > 0 && (
            <>
              <div className="account-coupons__count">
                <span>
                  {coupons.length}{" "}
                  {coupons.length === 1
                    ? "offer"
                    : "offers"}{" "}
                  available
                </span>
              </div>

              <section
                className="account-coupons__grid"
                aria-label="Available coupons"
              >
                {coupons.map((coupon) => {
                  const DiscountIcon =
                    getDiscountIcon(
                      coupon.discountType,
                    );

                  const isCopied =
                    copiedCode === coupon.code;

                  return (
                    <article
                      key={coupon.code}
                      className="account-coupon"
                    >
                      {/* TOP */}

                      <div className="account-coupon__top">
                        <div className="account-coupon__icon">
                          <DiscountIcon
                            size={17}
                            strokeWidth={1.35}
                          />
                        </div>

                        <span className="account-coupon__type">
                          {coupon.discountType ===
                          "free_shipping"
                            ? "Delivery Offer"
                            : "Shopping Offer"}
                        </span>

                        {coupon.firstOrderOnly && (
                          <span className="account-coupon__badge">
                            First Order
                          </span>
                        )}
                      </div>

                      {/* OFFER */}

                      <div className="account-coupon__offer">
                        <p className="account-coupon__discount">
                          {getDiscountLabel(coupon)}
                        </p>

                        <h2 className="account-coupon__description">
                          {coupon.description ||
                            "A special offer for your next order."}
                        </h2>
                      </div>

                      {/* DETAILS */}

                      <div className="account-coupon__details">
                        {coupon.minimumOrderValue > 0 && (
                          <div className="account-coupon__detail">
                            <span>
                              Minimum order
                            </span>

                            <strong>
                              {formatCurrency(
                                coupon.minimumOrderValue,
                              )}
                            </strong>
                          </div>
                        )}

                        {coupon.maxDiscountAmount !==
                          null &&
                          coupon.discountType ===
                            "percentage" && (
                            <div className="account-coupon__detail">
                              <span>
                                Maximum saving
                              </span>

                              <strong>
                                {formatCurrency(
                                  coupon.maxDiscountAmount,
                                )}
                              </strong>
                            </div>
                          )}

                        <div className="account-coupon__detail">
                          <span>Valid until</span>

                          <strong>
                            {formatDate(
                              coupon.endsAt,
                            )}
                          </strong>
                        </div>
                      </div>

                      {/* CODE + ACTIONS */}

                      <div className="account-coupon__footer">
                        <div className="account-coupon__code">
                          <span className="account-coupon__code-label">
                            Coupon Code
                          </span>

                          <strong>
                            {coupon.code}
                          </strong>
                        </div>

                        <div className="account-coupon__actions">
                          <button
                            type="button"
                            className="account-coupon__copy"
                            onClick={() =>
                              handleCopy(
                                coupon.code,
                              )
                            }
                            aria-label={
                              isCopied
                                ? `${coupon.code} copied`
                                : `Copy ${coupon.code}`
                            }
                          >
                            {isCopied ? (
                              <>
                                <Check
                                  size={14}
                                  strokeWidth={1.8}
                                />

                                <span>
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy
                                  size={14}
                                  strokeWidth={1.5}
                                />

                                <span>
                                  Copy Code
                                </span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            className="account-coupon__use"
                            onClick={() =>
                              handleUseCoupon(
                                coupon.code,
                              )
                            }
                          >
                            <span>
                              Use Coupon
                            </span>

                            <span
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* EXPIRY */}

                      <div className="account-coupon__expiry">
                        <CalendarDays
                          size={13}
                          strokeWidth={1.4}
                        />

                        <span>
                          {coupon.endsAt
                            ? `Valid until ${formatDate(
                                coupon.endsAt,
                              )}`
                            : "No expiry date"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </section>
            </>
          )}
      </div>
    </main>
  );
}