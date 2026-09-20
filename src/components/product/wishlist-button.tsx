"use client";

import {
  useEffect,
  useState,
} from "react";

import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  className?: string;
}

export function WishlistButton({
  productId,
  productName = "Product",
  className = "",
}: WishlistButtonProps) {
  const isInWishlist = useWishlistStore(
    (state) =>
      state.productIds.includes(productId),
  );

  const toggle = useWishlistStore(
    (state) => state.toggle,
  );

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const active =
    hydrated && isInWishlist;

  const handleToggle = () => {
    toggle(productId);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        active
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      aria-pressed={active}
      className={[
        "wishlist-button",
        active
          ? "wishlist-button--active"
          : "wishlist-button--inactive",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Heart
        aria-hidden="true"
        size={18}
        strokeWidth={1.5}
        fill={
          active
            ? "currentColor"
            : "none"
        }
        className="wishlist-button__icon"
      />
    </button>
  );
}