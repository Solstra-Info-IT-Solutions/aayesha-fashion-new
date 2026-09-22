"use client";

import { useEffect, useState } from "react";

import { WishlistButton } from "@/components/product/wishlist-button";
import { ProductPrice } from "@/components/product/product-price";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductDeliveryChecker } from "@/components/product/product-delivery-checker";
import { ProductTrustBadges } from "@/components/product/product-trust-badges";

import { getCategories } from "@/services/category.service";

import type { Product } from "@/types/product";

import "./ProductInfo.css";

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductInfo({
  product,
  quantity,
  onQuantityChange,
}: ProductInfoProps) {
  const [categoryLabel, setCategoryLabel] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories = await getCategories();

        const category = categories.find(
          (item) => item.id === product.categoryId,
        );

        if (!cancelled) {
          setCategoryLabel(category?.name ?? "");
        }
      } catch (error) {
        console.error("Failed to load product category:", error);

        if (!cancelled) {
          setCategoryLabel("");
        }
      }
    }

    if (product.categoryId) {
      loadCategory();
    } else {
      setCategoryLabel("");
    }

    return () => {
      cancelled = true;
    };
  }, [product.categoryId]);

  return (
    <div className="product-info">
      {/* =====================================================
          PRODUCT HEADER
      ===================================================== */}

      <div className="product-info__header">
        <div className="product-info__header-main">
          <div className="product-info__heading-content">
            {categoryLabel && (
              <p className="product-info__category">
                {categoryLabel}
              </p>
            )}

            <h1 className="product-info__title">
              {product.name}
            </h1>
          </div>

          <div className="product-info__wishlist">
            <WishlistButton
              productId={product.id}
              productName={product.name}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div className="product-info__price-section">
        <ProductPrice product={product} />

        <p className="product-info__tax-note">
          Inclusive of applicable taxes
        </p>
      </div>

      {/* =====================================================
          SHORT DESCRIPTION
      ===================================================== */}

      {product.content.description && (
        <div className="product-info__description-section">
          <p className="product-info__description">
            {product.content.description}
          </p>
        </div>
      )}

      {/* =====================================================
          PURCHASE
      ===================================================== */}

      <div className="product-info__purchase">
        <ProductPurchasePanel
          product={product}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
        />
      </div>

      {/* =====================================================
          DELIVERY
      ===================================================== */}

      <div className="product-info__delivery">
        <ProductDeliveryChecker />
      </div>

      {/* =====================================================
          TRUST
      ===================================================== */}

      <div className="product-info__trust">
        <ProductTrustBadges />
      </div>
    </div>
  );
}