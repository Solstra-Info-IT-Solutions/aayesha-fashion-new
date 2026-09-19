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
        if (!cancelled) {
          setCount(0);
        }

        console.error(
          "CART COUNT ERROR:",
          error,
        );
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
      className="cart-count"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}