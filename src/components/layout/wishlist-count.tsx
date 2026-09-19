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
      className="
        absolute
        -right-2
        -top-2
        flex
        h-[19px]
        min-w-[19px]
        items-center
        justify-center
        rounded-full
        border
        border-white
        bg-[var(--color-burgundy)]
        px-1
        font-body
        text-[9px]
        font-semibold
        leading-none
        tracking-[-0.01em]
        text-white
        shadow-[0_3px_10px_rgba(103,45,54,0.18)]
        transition-transform
        duration-300
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}