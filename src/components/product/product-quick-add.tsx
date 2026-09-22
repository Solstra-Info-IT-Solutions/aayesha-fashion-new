"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import type { Product } from "@/types/product";

import {
  getInventoryStatus,
  getProductAvailability,
} from "@/types/product";

import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { LoginRequiredPopup } from "@/components/product/login-required-popup";

import "./ProductQuickAdd.css";

interface ProductQuickAddProps {
  product: Product;
}

export function ProductQuickAdd({
  product,
}: ProductQuickAddProps) {
  const [open, setOpen] = useState(false);

  const [adding, setAdding] = useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  /* ==========================================================
     PRODUCT AVAILABILITY
  ========================================================== */

  const availability =
    getProductAvailability(product);

  const inventoryStatus =
    getInventoryStatus(product);

  /* ==========================================================
     ADD TO BAG
  ========================================================== */

  const handleAddToBag = async () => {
    if (availability.isSoldOut) {
      toast.error(
        "This product is currently sold out.",
      );

      return;
    }

    if (
      availability.availableQuantity <= 0
    ) {
      toast.error(
        "This product is currently unavailable.",
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
        `${product.name} added to bag`,
      );

      setOpen(false);
    } catch (error) {
      console.error(
        "QUICK ADD TO CART ERROR:",
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

  /* ==========================================================
     SOLD OUT
  ========================================================== */

  if (availability.isSoldOut) {
    return (
      <div className="product-quick-add">
        <button
          type="button"
          disabled
          className="product-quick-add__sold-out"
        >
          Sold Out
        </button>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <div className="product-quick-add">
        {/* ====================================================
            COLLAPSED STATE
        ==================================================== */}

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={
              adding ||
              !isInitialized
            }
            className="product-quick-add__trigger"
          >
            <span className="product-quick-add__trigger-content">
              <ShoppingBag
                size={17}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <span>Quick Add</span>
            </span>

            <ChevronDown
              size={17}
              strokeWidth={1.5}
              aria-hidden="true"
              className="product-quick-add__trigger-icon"
            />
          </button>
        )}

        {/* ====================================================
            EXPANDED PANEL
        ==================================================== */}

        {open && (
          <div className="product-quick-add__panel">
            {/* PANEL HEADER */}

            <div className="product-quick-add__header">
              <div>
                <p className="product-quick-add__eyebrow">
                  Quick Add
                </p>

                <p className="product-quick-add__heading">
                  Add to your bag
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                disabled={adding}
                aria-label="Close quick add"
                className="product-quick-add__close"
              >
                <X
                  size={17}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="product-quick-add__body">
              {/* PRODUCT */}

              <div className="product-quick-add__product">
                <p className="product-quick-add__eyebrow">
                  Product
                </p>

                <p className="product-quick-add__product-name">
                  {product.name}
                </p>
              </div>

              {/* PRICE */}

              <div className="product-quick-add__price">
                <div>
                  <p className="product-quick-add__meta-label">
                    Price
                  </p>

                  <p className="product-quick-add__selling-price">
                    ₹
                    {product.pricing.sellingPrice.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>

                {product.pricing.mrp >
                  product.pricing
                    .sellingPrice && (
                  <div className="product-quick-add__discount">
                    <p className="product-quick-add__mrp">
                      ₹
                      {product.pricing.mrp.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    <p className="product-quick-add__discount-value">
                      {Math.round(
                        ((product.pricing.mrp -
                          product.pricing
                            .sellingPrice) /
                          product.pricing
                            .mrp) *
                          100,
                      )}
                      % OFF
                    </p>
                  </div>
                )}
              </div>

              {/* STOCK */}

              <div className="product-quick-add__availability">
                <p className="product-quick-add__eyebrow">
                  Availability
                </p>

                {inventoryStatus ===
                  "low-stock" && (
                  <p className="product-quick-add__stock product-quick-add__stock--low">
                    Only{" "}
                    {
                      availability.availableQuantity
                    }{" "}
                    left
                  </p>
                )}

                {inventoryStatus ===
                  "in-stock" && (
                  <p className="product-quick-add__stock product-quick-add__stock--available">
                    In stock
                  </p>
                )}

                {inventoryStatus ===
                  "out-of-stock" && (
                  <p className="product-quick-add__stock product-quick-add__stock--sold-out">
                    Sold out
                  </p>
                )}
              </div>

              {/* ADD TO BAG */}

              <button
                type="button"
                onClick={() =>
                  void handleAddToBag()
                }
                disabled={
                  availability.isSoldOut ||
                  availability.availableQuantity <=
                    0 ||
                  adding ||
                  !isInitialized
                }
                className="product-quick-add__submit"
              >
                <ShoppingBag
                  size={17}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span>
                  {adding
                    ? "Adding..."
                    : "Add to Bag"}
                </span>

                {!adding && (
                  <ChevronRight
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="product-quick-add__submit-icon"
                  />
                )}
              </button>
            </div>
          </div>
        )}
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