"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ShoppingBag,
  X,
} from "lucide-react";

import type { Product } from "@/types/product";

import "./AddToBagPopup.css";

type AddToBagPopupProps = {
  open: boolean;
  product: Product;
  image: string;
  onClose: () => void;
};

/* =========================================================
   PRICE FORMATTER
========================================================= */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* =========================================================
   COMPONENT
========================================================= */

export function AddToBagPopup({
  open,
  product,
  image,
  onClose,
}: AddToBagPopupProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="add-to-bag-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-bag-popup-title"
      onClick={onClose}
    >
      {/* ===================================================
          DIALOG
      =================================================== */}

      <div
        className="add-to-bag-popup__dialog"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          className="add-to-bag-popup__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X
            className="add-to-bag-popup__close-icon"
            aria-hidden="true"
          />
        </button>

        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <div className="add-to-bag-popup__success">

          <span
            className="add-to-bag-popup__success-icon"
            aria-hidden="true"
          >
            <Check />
          </span>

          <div className="add-to-bag-popup__success-content">

            <p className="add-to-bag-popup__eyebrow">
              Aayesha Fashion
            </p>

            <h2
              id="add-to-bag-popup-title"
              className="add-to-bag-popup__title"
            >
              Added to Your Bag
            </h2>

          </div>

        </div>

        {/* =================================================
            PRODUCT
        ================================================= */}

        <div className="add-to-bag-popup__product">

          <div className="add-to-bag-popup__image">

            <Image
              src={image}
              alt={product.name}
              fill
              sizes="96px"
              className="add-to-bag-popup__image-element"
            />

          </div>

          <div className="add-to-bag-popup__product-info">

            <p className="add-to-bag-popup__product-label">
              Selected item
            </p>

            <p className="add-to-bag-popup__product-name">
              {product.name}
            </p>

            <p className="add-to-bag-popup__product-price">
              {formatPrice(
                product.pricing.sellingPrice,
              )}
            </p>

            <p className="add-to-bag-popup__quantity">
              Quantity: 1
            </p>

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="add-to-bag-popup__actions">

          {/* CONTINUE SHOPPING */}

          <button
            type="button"
            className="add-to-bag-popup__continue"
            onClick={onClose}
          >
            <span>
              Continue Shopping
            </span>
          </button>

          {/* VIEW BAG */}

          <Link
            href="/cart"
            className="add-to-bag-popup__view-bag"
            onClick={onClose}
          >
            <span className="add-to-bag-popup__view-bag-label">
              View Bag
            </span>

            <span
              className="add-to-bag-popup__view-bag-icon"
              aria-hidden="true"
            >
              <ShoppingBag />
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}