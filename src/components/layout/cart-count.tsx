"use client";

import { useEffect, useState } from "react";
import { getCart } from "@/services/cart.service";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadCartCount = async () => {
      try {
        const cart = await getCart();

        if (cancelled) {
          return;
        }

        const totalItems = cart.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        setCount(totalItems);
      } catch (error) {
        /*
         * 401 means the customer is not logged in.
         * In that case the cart count remains 0.
         */
        if (!cancelled) {
          setCount(0);
        }

        console.error("CART COUNT ERROR:", error);
      }
    };

    void loadCartCount();

    return () => {
      cancelled = true;
    };
  }, []);

  if (count <= 0) {
    return null;
  }

  return (
    <span
      aria-label={`${count} item${
        count === 1 ? "" : "s"
      } in cart`}
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
        bg-[var(--color-text)]
        px-1
        font-body
        text-[9px]
        font-semibold
        leading-none
        tracking-[-0.01em]
        text-white
        shadow-[0_3px_10px_rgba(23,21,20,0.16)]
        transition-transform
        duration-300
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}