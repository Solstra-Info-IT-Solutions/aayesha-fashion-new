"use client";

import { useState } from "react";

import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";

import "./ProductPurchasePanel.css";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

interface ProductPurchasePanelProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductPurchasePanel({
  product,
  quantity,
  onQuantityChange,
}: ProductPurchasePanelProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const [addingToBag, setAddingToBag] = useState(false);

  const [buyingNow, setBuyingNow] = useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const stock = getAvailableStock(product);

  const status = getInventoryStatus(product);

  const canBuy =
    status !== "out-of-stock" &&
    stock > 0;

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const addToBag = async () => {
    if (!canBuy) {
      toast.error(
        "This product is currently unavailable.",
      );

      return;
    }

    if (addingToBag || buyingNow) {
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
      setAddingToBag(true);

      await addToCart(
        product._id,
        quantity,
      );

      toast.success(
        quantity > 1
          ? `${quantity} × ${product.name} added to your bag.`
          : `${product.name} has been added to your bag.`,
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAddingToBag(false);
    }
  };

  /* ==========================================================
     BUY NOW
  ========================================================== */

  const buyNow = async () => {
    if (!canBuy) {
      toast.error(
        "This product is currently unavailable.",
      );

      return;
    }

    if (addingToBag || buyingNow) {
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
      setBuyingNow(true);

      await addToCart(
        product._id,
        quantity,
      );

      router.push("/cart");
    } catch (error) {
      console.error(
        "BUY NOW ERROR:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <>
      <section
        aria-label="Purchase options"
        className="product-purchase"
      >
        {/* =====================================================
            PURCHASE HEADER
        ===================================================== */}

        <div className="product-purchase__header">
          <p className="product-purchase__label">
            Quantity
          </p>

          <span className="product-purchase__availability">
            {stock > 0
              ? `${stock} available`
              : "Unavailable"}
          </span>
        </div>

        {/* =====================================================
            QUANTITY + ADD TO BAG
        ===================================================== */}

        <div className="product-purchase__primary-row">
          {/* QUANTITY */}

          <div className="product-purchase__quantity">
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  Math.max(
                    1,
                    quantity - 1,
                  ),
                )
              }
              disabled={
                quantity <= 1 ||
                addingToBag ||
                buyingNow
              }
              aria-label="Decrease quantity"
              className="product-purchase__quantity-button"
            >
              <Minus
                size={16}
                strokeWidth={1.5}
              />
            </button>

            <span
              aria-live="polite"
              className="product-purchase__quantity-value"
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  Math.min(
                    quantity + 1,
                    Math.max(
                      stock,
                      1,
                    ),
                  ),
                )
              }
              disabled={
                !canBuy ||
                quantity >= stock ||
                addingToBag ||
                buyingNow
              }
              aria-label="Increase quantity"
              className="product-purchase__quantity-button"
            >
              <Plus
                size={16}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* ADD TO BAG */}

          <button
            type="button"
            onClick={() =>
              void addToBag()
            }
            disabled={
              !canBuy ||
              addingToBag ||
              buyingNow ||
              !isInitialized
            }
            className="product-purchase__add-button"
          >
            <ShoppingBag
              size={17}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span>
              {addingToBag
                ? "Adding..."
                : "Add to Bag"}
            </span>
          </button>
        </div>

        {/* =====================================================
            BUY NOW
        ===================================================== */}

        <button
          type="button"
          onClick={() =>
            void buyNow()
          }
          disabled={
            !canBuy ||
            addingToBag ||
            buyingNow ||
            !isInitialized
          }
          className="product-purchase__buy-button"
        >
          {buyingNow
            ? "Adding..."
            : "Buy Now"}
        </button>

        {/* =====================================================
            INVENTORY MESSAGE
        ===================================================== */}

        <div
          className={`product-purchase__inventory product-purchase__inventory--${status}`}
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="product-purchase__inventory-dot"
          />

          {status === "low-stock" ? (
            <p>
              Only {stock} left in stock
            </p>
          ) : status === "in-stock" ? (
            <p>
              In stock · Ready to ship
            </p>
          ) : (
            <p>
              Sold out
            </p>
          )}
        </div>

        {/* =====================================================
            PURCHASE REASSURANCE
        ===================================================== */}

        <div className="product-purchase__reassurance">
          <p>
            Secure checkout · Easy returns ·
            Carefully packed by Aayesha Fashion
          </p>
        </div>
      </section>

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