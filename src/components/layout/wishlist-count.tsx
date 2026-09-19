"use client";

import { useWishlistStore } from "@/store/wishlist-store";

export function WishlistCount() {
  const count = useWishlistStore(
    (state) => state.productIds.length,
  );

  if (count === 0) {
    return null;
  }

  return (
    <span
      aria-label={`${count} item${
        count === 1 ? "" : "s"
      } in wishlist`}
      className="wishlist-count"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}