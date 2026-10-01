"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getInventoryStatus,
  getProductStartingPrice,
  type Product,
} from "@/types/product";

import { FreeShippingMeter } from "@/components/commerce/free-shipping-meter";
import { ListingSalesBar } from "@/components/listing-sales/listing-sales-bar";
import { ProductInsightsProvider } from "@/components/listing-sales/insights-context";
import { ShopByNeed } from "@/components/home-sales/shop-by-need";
import { ProductStrip } from "@/components/orders-sales/product-strip";
import { NotifyMeForm } from "@/components/product/product-sales";
import { ProductCard } from "@/components/product/product-card";
import { RecentlyViewed } from "@/components/recently-viewed/recently-viewed";
import { siteConfig } from "@/config/site";
import { getProductById } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";

import "./WishlistGrid.css";
import "@/components/home/HomeCta.css";

type WishlistGridProps = {
  products: Product[];
};

type WishlistSort = "saved" | "price-low" | "price-high" | "available";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const matches = (product: Product, id: string) =>
  product._id === id || product.id === id;

export function WishlistGrid({
  products,
}: WishlistGridProps) {
  const router = useRouter();

  const productIds = useWishlistStore(
    (state) => state.productIds,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const [extra, setExtra] = useState<Product[]>([]);
  const [sort, setSort] = useState<WishlistSort>("saved");
  const [adding, setAdding] = useState(false);

  /*
   * The page only receives the first batch of products, so anything
   * saved beyond it (or saved by either id style) is fetched here.
   */
  const missingKey = useMemo(
    () =>
      productIds
        .filter(
          (id) =>
            !products.some((product) => matches(product, id)),
        )
        .join(","),
    [productIds, products],
  );

  useEffect(() => {
    if (!missingKey) {
      return;
    }

    let cancelled = false;

    Promise.allSettled(
      missingKey.split(",").map((id) => getProductById(id)),
    ).then((results) => {
      if (cancelled) return;

      setExtra(
        results
          .filter(
            (result): result is PromiseFulfilledResult<Product> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value)
          .filter((product) => product.status === "active"),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [missingKey]);

  const saved = useMemo(() => {
    const pool = [...products, ...extra];

    // Newest saved first.
    return [...productIds]
      .reverse()
      .map((id) => pool.find((product) => matches(product, id)))
      .filter((product): product is Product => Boolean(product));
  }, [products, extra, productIds]);

  const list = useMemo(() => {
    const result = [...saved];

    switch (sort) {
      case "price-low":
        result.sort((a, b) => getProductStartingPrice(a) - getProductStartingPrice(b));
        break;
      case "price-high":
        result.sort((a, b) => getProductStartingPrice(b) - getProductStartingPrice(a));
        break;
      case "available":
        result.sort(
          (a, b) =>
            Number(getInventoryStatus(a) === "out-of-stock") -
            Number(getInventoryStatus(b) === "out-of-stock"),
        );
        break;
      default:
        break;
    }

    return result;
  }, [saved, sort]);

  const inStock = saved.filter(
    (product) => getInventoryStatus(product) !== "out-of-stock",
  );

  const subtotal = inStock.reduce(
    (sum, product) => sum + (product.pricing?.sellingPrice ?? 0),
    0,
  );

  const savings = inStock.reduce(
    (sum, product) =>
      sum +
      Math.max(
        0,
        (product.pricing?.mrp ?? 0) - (product.pricing?.sellingPrice ?? 0),
      ),
    0,
  );

  async function addAllToBag() {
    if (adding || inStock.length === 0) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=%2Fwishlist");
      return;
    }

    setAdding(true);

    let added = 0;

    for (const product of inStock) {
      try {
        await addToCart(product._id, 1);
        added += 1;
      } catch {
        /* skip pieces that cannot be added */
      }
    }

    setAdding(false);

    if (added === 0) {
      toast.error("We could not add these pieces right now.");
      return;
    }

    toast.success(
      `${added} piece${added === 1 ? "" : "s"} added to your bag.`,
    );

    router.push("/cart");
  }

  const shareMessage = `Here are my favourites from Aayesha Fashion:\n${saved
    .slice(0, 8)
    .map((product) => `• ${product.name}: ${siteConfig.url}/products/${product._id}`)
    .join("\n")}`;

  if (saved.length === 0) {
    return (
      <div>
        <div className="wishlist-grid__empty">
          <div
            aria-hidden="true"
            className="wishlist-grid__empty-icon"
          >
            <Heart
              size={28}
              strokeWidth={1.5}
            />
          </div>

          <p className="wishlist-grid__eyebrow">
            Nothing saved yet
          </p>

          <h2 className="wishlist-grid__empty-title">
            Your wishlist is waiting.
          </h2>

          <p className="wishlist-grid__empty-description">
            Tap the heart on any piece to save it here.
            We will keep it for you, and you can add
            everything to your bag in one go.
          </p>

          <div className="wishlist-grid__empty-action">
            <Link href="/shop" className="home-cta">
              Continue shopping
            </Link>
          </div>
        </div>

        <ProductStrip
          eyebrow="Start with the best"
          title="Customer favourites"
        />

        <ShopByNeed />
      </div>
    );
  }

  return (
    <div className="wishlist-grid">
      <div className="wishlist-grid__header">
        <div>
          <p className="wishlist-grid__eyebrow">
            Your Selection
          </p>

          <h2 className="wishlist-grid__title">
            Saved Pieces
          </h2>
        </div>

        <span className="wishlist-grid__count">
          {saved.length}{" "}
          {saved.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      <ListingSalesBar />

      {/* SUMMARY + BULK ACTIONS */}

      <section className="wishlist-summary" aria-label="Wishlist summary">
        <div className="wishlist-summary__numbers">
          <div>
            <span>Available to order</span>
            <strong>
              {inStock.length} of {saved.length}
            </strong>
          </div>

          <div>
            <span>Together</span>
            <strong>{money(subtotal)}</strong>
          </div>

          {savings > 0 ? (
            <div>
              <span>You save</span>
              <strong className="wishlist-summary__save">
                {money(savings)}
              </strong>
            </div>
          ) : null}
        </div>

        <FreeShippingMeter subtotal={subtotal} savings={savings} />

        <div className="wishlist-summary__actions">
          <button
            type="button"
            onClick={() => void addAllToBag()}
            disabled={adding || inStock.length === 0}
            className="wishlist-summary__primary"
          >
            <ShoppingBag size={16} strokeWidth={1.6} />
            {adding
              ? "Adding…"
              : inStock.length === 0
                ? "Nothing available right now"
                : `Add ${inStock.length} available to bag`}
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="wishlist-summary__share"
          >
            <MessageCircle size={16} strokeWidth={1.6} />
            Share my wishlist
          </a>

          <label className="wishlist-summary__sort">
            <span>Sort</span>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as WishlistSort)
              }
            >
              <option value="saved">Recently saved</option>
              <option value="available">Available first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
      </section>

      <ProductInsightsProvider
        productIds={list.map((product) => product._id)}
      >
        <div className="wishlist-grid__products">
          {list.map((product) => (
            <div key={product._id} className="wishlist-item">
              <ProductCard product={product} />

              {getInventoryStatus(product) === "out-of-stock" ? (
                <NotifyMeForm productId={product._id} />
              ) : null}
            </div>
          ))}
        </div>
      </ProductInsightsProvider>

      <ProductStrip
        eyebrow="You may also like"
        title="Customer favourites"
        excludeIds={saved.map((product) => product._id)}
      />

      <ShopByNeed />

      <RecentlyViewed
        title="Pick up where you left off"
        eyebrow="Recently viewed"
        limit={4}
      />

      <div className="wishlist-grid__footer">
        <Link href="/shop" className="home-cta">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
