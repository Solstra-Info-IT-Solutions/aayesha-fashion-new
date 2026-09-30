"use client";

import { useEffect, useState } from "react";

import {
  CART_UPDATED_EVENT,
  getCart,
} from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";

export function CartCount() {
  const [count, setCount] = useState(0);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  useEffect(() => {
    let cancelled = false;

    /*
     * Guests (and the moment before the session is restored) have
     * no cart. Skipping the request avoids a guaranteed
     * "Authentication is required" error on every page load.
     */
    if (!isAuthenticated) {
      setCount(0);

      return () => {
        cancelled = true;
      };
    }

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

    /* Refresh after add / update / remove / clear. */
    window.addEventListener(
      CART_UPDATED_EVENT,
      loadCartCount,
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        CART_UPDATED_EVENT,
        loadCartCount,
      );
    };
  }, [isAuthenticated]);

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
