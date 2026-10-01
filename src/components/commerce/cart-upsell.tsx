"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { getProducts } from "@/lib/api/products";
import { addToCart } from "@/services/cart.service";
import {
  getAvailableStock,
  getPrimaryProductMedia,
  type Product,
} from "@/types/product";

import "./CommerceSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * "Complete your look": best sellers and featured pieces that are in
 * stock and not already in the bag, with one-tap add.
 */
export function CartUpsell({
  cartProductIds,
  onAdded,
}: {
  cartProductIds: string[];
  onAdded: () => Promise<void> | void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [addingId, setAddingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    getProducts({
      page: 1,
      limit: 16,
      isBestSeller: true,
      inStockOnly: true,
      sort: "best-selling",
    })
      .then((response) => {
        if (!cancelled) setProducts(response.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = products
    .filter(
      (product) =>
        product.status === "active" &&
        getAvailableStock(product) > 0 &&
        !cartProductIds.includes(product._id),
    )
    .slice(0, 4);

  if (suggestions.length === 0) {
    return null;
  }

  async function add(product: Product) {
    if (addingId) return;

    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      await onAdded();
      toast.success(`${product.name} added to your bag.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to add this piece.",
      );
    } finally {
      setAddingId("");
    }
  }

  return (
    <section className="commerce-upsell" aria-label="Complete your look">
      <p className="commerce-upsell__eyebrow">Complete your look</p>
      <h2 className="commerce-upsell__title">Customer favourites</h2>

      <ul className="commerce-upsell__grid">
        {suggestions.map((product) => {
          const media = getPrimaryProductMedia(product);

          return (
            <li key={product._id} className="commerce-upsell__card">
              <Link
                href={`/products/${product._id}`}
                className="commerce-upsell__image"
                aria-label={product.name}
              >
                {media?.src ? (
                  <Image
                    src={media.src}
                    alt={media.alt || product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 180px"
                  />
                ) : null}
              </Link>

              <p className="commerce-upsell__name">{product.name}</p>

              <p className="commerce-upsell__price">
                {money(product.pricing.sellingPrice)}
                {product.pricing.mrp > product.pricing.sellingPrice ? (
                  <s>{money(product.pricing.mrp)}</s>
                ) : null}
              </p>

              <button
                type="button"
                onClick={() => void add(product)}
                disabled={Boolean(addingId)}
              >
                <Plus size={14} />
                {addingId === product._id ? "Adding…" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
