import Link from "next/link";

import type { Product } from "@/types/product";

import { getProducts } from "@/lib/api/products";
import { WishlistGrid } from "@/components/product/wishlist-grid";

import "./WishlistPage.css";

export default async function WishlistPage() {
  let products: Product[] = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 100,
      status: "active",
      sort: "featured",
    });

    products = response.products;
  } catch {
    products = [];
  }

  return (
    <main className="wishlist-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="wishlist-page__hero">
        <div className="wishlist-page__container">
          <nav
            aria-label="Breadcrumb"
            className="wishlist-page__crumbs"
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Wishlist</span>
          </nav>

          <div className="wishlist-page__eyebrow">
            <span aria-hidden="true" />
            Saved pieces
          </div>

          <h1 className="wishlist-page__title">
            Your <em>wishlist.</em>
          </h1>

          <p className="wishlist-page__description">
            A personal edit of the pieces you love. Keep them
            close, revisit your favourites, and return whenever
            you are ready.
          </p>
        </div>
      </section>

      {/* =====================================================
          SAVED PIECES
      ===================================================== */}

      <section className="wishlist-page__collection">
        <div className="wishlist-page__container">
          <WishlistGrid products={products} />
        </div>
      </section>
    </main>
  );
}
