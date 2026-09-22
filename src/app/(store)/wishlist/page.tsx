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
          WISHLIST HERO
      ===================================================== */}

      <section className="wishlist-page__hero">
        <div className="wishlist-page__container">
          <div className="wishlist-page__hero-inner">
            <div className="wishlist-page__hero-copy">
              <div className="wishlist-page__eyebrow">
                <span className="wishlist-page__eyebrow-line" />

                <span>Saved Pieces</span>

                <span className="wishlist-page__eyebrow-line" />
              </div>

              <h1 className="wishlist-page__title">
                Your Wishlist
              </h1>

              <p className="wishlist-page__description">
                A personal edit of the pieces you love.
                Keep them close, revisit your favourites,
                and return whenever you are ready.
              </p>
            </div>

            <div className="wishlist-page__hero-note">
              <span className="wishlist-page__hero-note-number">
                01
              </span>

              <div>
                <p className="wishlist-page__hero-note-title">
                  Your Personal Edit
                </p>

                <p className="wishlist-page__hero-note-copy">
                  Curate the pieces that speak to your
                  style and keep your favourites within
                  easy reach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SAVED COLLECTION
      ===================================================== */}

      <section className="wishlist-page__collection">
        <div className="wishlist-page__container">
          <div className="wishlist-page__collection-header">
            <div>
              <p className="wishlist-page__collection-eyebrow">
                The Edit
              </p>

              <h2 className="wishlist-page__collection-title">
                Pieces Worth Keeping
              </h2>
            </div>

            <div className="wishlist-page__collection-rule" />
          </div>

          <div className="wishlist-page__grid-wrapper">
            <WishlistGrid products={products} />
          </div>
        </div>
      </section>
    </main>
  );
}