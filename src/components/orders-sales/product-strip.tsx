"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getProducts } from "@/lib/api/products";
import {
  getAvailableStock,
  getPrimaryProductMedia,
  type Product,
} from "@/types/product";

import "./OrdersSales.css";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * Best-selling pieces (in stock) the customer has not just bought —
 * a gentle "what's next" under orders and on the account page.
 */
export function ProductStrip({
  title,
  eyebrow,
  excludeIds = [],
  limit = 4,
}: {
  title: string;
  eyebrow: string;
  excludeIds?: string[];
  limit?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);

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

  const shown = products
    .filter(
      (product) =>
        product.status === "active" &&
        getAvailableStock(product) > 0 &&
        !excludeIds.includes(product._id),
    )
    .slice(0, limit);

  if (shown.length === 0) {
    return null;
  }

  return (
    <section className="orders-strip" aria-label={title}>
      <p className="orders-strip__eyebrow">{eyebrow}</p>
      <h2 className="orders-strip__title">{title}</h2>

      <ul className="orders-strip__grid">
        {shown.map((product) => {
          const media = getPrimaryProductMedia(product);

          return (
            <li key={product._id}>
              <Link href={`/products/${product._id}`}>
                <span className="orders-strip__image">
                  {media?.src ? (
                    <Image
                      src={media.src}
                      alt={media.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                  ) : null}
                </span>

                <span className="orders-strip__name">{product.name}</span>

                <span className="orders-strip__price">
                  {money(product.pricing.sellingPrice)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
