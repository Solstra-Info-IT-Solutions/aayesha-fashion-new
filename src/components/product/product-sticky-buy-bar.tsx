"use client";

import { useState } from "react";

import { ShoppingBag } from "lucide-react";

import toast from "react-hot-toast";

import type { Product } from "@/types/product";

import "./ProductStickyBuyBar.css";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

interface ProductStickyBuyBarProps {
  product: Product;
}

export function ProductStickyBuyBar({
  product,
}: ProductStickyBuyBarProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [adding, setAdding] = useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const stock = getAvailableStock(product);

  const status = getInventoryStatus(product);

  const available =
    status !== "out-of-stock" &&
    stock > 0;

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAdd = async () => {
    if (!available) {
      toast.error(
        "This product is currently sold out.",
      );

      return;
    }

    if (adding) {
      return;
    }

    if (!isInitialized) {
      return;
    }

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    try {
      setAdding(true);

      await addToCart(
        product._id,
        1,
      );

      toast.success(
        "Added to your bag.",
      );
    } catch (error) {
      console.error(
        "STICKY ADD TO CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="product-sticky-buy-bar">
        <div className="product-sticky-buy-bar__inner">
          <div className="product-sticky-buy-bar__product">
            <p className="product-sticky-buy-bar__name">
              {product.name}
            </p>

            <p className="product-sticky-buy-bar__price">
              ₹
              {product.pricing.sellingPrice.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void handleAdd()
            }
            disabled={
              !available ||
              adding ||
              !isInitialized
            }
            className="product-sticky-buy-bar__button"
          >
            <ShoppingBag
              size={17}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span>
              {adding
                ? "Adding..."
                : available
                  ? "Add to Bag"
                  : "Sold Out"}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================
          LOGIN REQUIRED POPUP
      ====================================================== */}

      <LoginRequiredPopup
        open={showLoginPopup}
        onClose={() =>
          setShowLoginPopup(false)
        }
      />
    </>
  );
}