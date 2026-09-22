"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, X } from "lucide-react";

import type { Product } from "@/types/product";
import "./AddToBagPopup.css";

type AddToBagPopupProps = {
  open: boolean;
  product: Product;
  image: string;
  onClose: () => void;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

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
      <div
        className="add-to-bag-popup__dialog"
        onClick={(event) => event.stopPropagation()}
      >
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

        <div className="add-to-bag-popup__success">
          <span className="add-to-bag-popup__success-icon">
            <Check aria-hidden="true" />
          </span>

          <div>
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

        <div className="add-to-bag-popup__product">
          <div className="add-to-bag-popup__image">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="96px"
            />
          </div>

          <div className="add-to-bag-popup__product-info">
            <p className="add-to-bag-popup__product-name">
              {product.name}
            </p>

            <p className="add-to-bag-popup__product-price">
              {formatPrice(product.pricing.sellingPrice)}
            </p>

            <p className="add-to-bag-popup__quantity">
              Quantity: 1
            </p>
          </div>
        </div>

        <div className="add-to-bag-popup__actions">
          <button
            type="button"
            className="add-to-bag-popup__continue"
            onClick={onClose}
          >
            Continue Shopping
          </button>

          <Link
            href="/cart"
            className="add-to-bag-popup__view-bag"
            onClick={onClose}
          >
            <ShoppingBag
              aria-hidden="true"
            />

            View Bag
          </Link>
        </div>
      </div>
    </div>
  );
}