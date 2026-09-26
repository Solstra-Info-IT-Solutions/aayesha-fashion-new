"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";

import { ProductShare } from "./product-share";

import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";

import { getCategories } from "@/services/category.service";
import { addToCart } from "@/services/cart.service";

import { useAuthStore } from "@/store/auth-store";

import { RecentlyViewed } from "@/components/recently-viewed/recently-viewed";

import { WishlistButton } from "./wishlist-button";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  MapPin,
} from "lucide-react";

import { addRecentlyViewed } from "@/lib/recently-viewed/recently-viewed";

import "./ProductDetail.css";

interface ProductDetailProps {
  product: Product;
  recommendations?: Product[];
}

/* ============================================================
   SAFE PRODUCT NORMALIZER
============================================================ */

function normalizeProduct(product: Product): Product {
  const source = product ?? ({} as Product);

  return {
    ...source,

    _id: source._id ?? source.id ?? "",
    id: source.id ?? source._id ?? "",
    slug: source.slug ?? "",
    name: source.name ?? "Product",
    categoryId: source.categoryId ?? "",

    pricing: {
      mrp: source.pricing?.mrp ?? 0,
      sellingPrice:
        source.pricing?.sellingPrice ?? 0,
      currency:
        source.pricing?.currency ?? "INR",
    },

    inventory: {
      stock: source.inventory?.stock ?? 0,
      reserved:
        source.inventory?.reserved ?? 0,
      lowStockThreshold:
        source.inventory?.lowStockThreshold ?? 2,
    },

    content: {
      description:
        source.content?.description ?? "",
      descriptionFormat:
        source.content?.descriptionFormat ??
        "plain",
      richContent:
        source.content?.richContent,
    },

    media: Array.isArray(source.media)
      ? source.media
      : [],

    merchandising: {
      isNew:
        source.merchandising?.isNew ?? false,
      isFeatured:
        source.merchandising?.isFeatured ??
        false,
      isBestSeller:
        source.merchandising?.isBestSeller ??
        false,

      badges: Array.isArray(
        source.merchandising?.badges,
      )
        ? source.merchandising.badges
        : [],

      ranking:
        source.merchandising?.ranking,
    },

    seo: source.seo
      ? {
          ...source.seo,
          keywords: Array.isArray(
            source.seo.keywords,
          )
            ? source.seo.keywords
            : [],
        }
      : undefined,

    status:
      source.status ?? "draft",

    publishedAt:
      source.publishedAt,

    createdAt:
      source.createdAt ?? "",

    updatedAt:
      source.updatedAt ?? "",
  };
}

/* ============================================================
   PRICE
============================================================ */

function formatPrice(value: number): string {
  return `₹${Number(
    value ?? 0,
  ).toLocaleString("en-IN")}`;
}

/* ============================================================
   DISCOUNT
============================================================ */

function getDiscount(
  mrp: number,
  sellingPrice: number,
): number {
  if (
    mrp <= 0 ||
    sellingPrice >= mrp
  ) {
    return 0;
  }

  return Math.round(
    ((mrp - sellingPrice) / mrp) * 100,
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  /* ==========================================================
     SAFE DATA
  ========================================================== */

  const safeProduct = useMemo(
    () => normalizeProduct(product),
    [product],
  );

  const safeRecommendations = useMemo(
    () =>
      Array.isArray(recommendations)
        ? recommendations
            .filter(Boolean)
            .map(normalizeProduct)
        : [],
    [recommendations],
  );

  /* ==========================================================
     STATE
  ========================================================== */

  const [categoryName, setCategoryName] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [openSection, setOpenSection] =
    useState<string | null>("description");

  const [pincode, setPincode] =
    useState("");

  const [deliveryChecked, setDeliveryChecked] =
    useState(false);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [buyingNow, setBuyingNow] =
    useState(false);

  /* ==========================================================
     PRODUCT VALUES
  ========================================================== */

  const maxStock = getAvailableStock(
    safeProduct,
  );

  const inventoryStatus =
    getInventoryStatus(safeProduct);

  const mrp =
    safeProduct.pricing?.mrp ?? 0;

  const sellingPrice =
    safeProduct.pricing?.sellingPrice ??
    0;

  const discount = getDiscount(
    mrp,
    sellingPrice,
  );

  /* ==========================================================
     MEDIA
  ========================================================== */

  const media = Array.isArray(
    safeProduct.media,
  )
    ? safeProduct.media.filter(
        (item) =>
          item?.type === "image" &&
          Boolean(item?.src),
      )
    : [];

  const currentMedia =
    media[selectedImage] ??
    media[0] ??
    null;

  /* ==========================================================
     CATEGORY
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        const categories =
          await getCategories();

        if (!Array.isArray(categories)) {
          return;
        }

        const category =
          categories.find(
            (item) =>
              item.id ===
              safeProduct.categoryId,
          );

        if (!cancelled) {
          setCategoryName(
            category?.name ?? "",
          );
        }
      } catch (error) {
        console.error(
          "Failed to load product category:",
          error,
        );

        if (!cancelled) {
          setCategoryName("");
        }
      }
    }

    if (safeProduct.categoryId) {
      void loadCategory();
    } else {
      setCategoryName("");
    }

    return () => {
      cancelled = true;
    };
  }, [safeProduct.categoryId]);

  /* ==========================================================
     RESET
  ========================================================== */

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [safeProduct._id]);

  /* ==========================================================
     RECENTLY VIEWED
  ========================================================== */

  useEffect(() => {
    if (!safeProduct._id) {
      return;
    }

    addRecentlyViewed(
      safeProduct._id,
    );
  }, [safeProduct._id]);

  /* ==========================================================
     QUANTITY
  ========================================================== */

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(current - 1, 1),
    );
  }

  function increaseQuantity() {
    if (maxStock <= 0) {
      return;
    }

    setQuantity((current) =>
      Math.min(
        current + 1,
        maxStock,
      ),
    );
  }

  /* ==========================================================
     ADD TO CART
  ========================================================== */

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${safeProduct._id}`,
        )}`,
      );

      return;
    }

    if (
      !safeProduct._id ||
      maxStock <= 0
    ) {
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        safeProduct._id,
        quantity,
      );
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error,
      );
    } finally {
      setAddingToCart(false);
    }
  }

  /* ==========================================================
     BUY NOW
  ========================================================== */

  async function handleBuyNow() {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/products/${safeProduct._id}`,
        )}`,
      );

      return;
    }

    if (
      !safeProduct._id ||
      maxStock <= 0
    ) {
      return;
    }

    try {
      setBuyingNow(true);

      await addToCart(
        safeProduct._id,
        quantity,
      );

      router.push("/checkout");
    } catch (error) {
      console.error(
        "Failed to buy product:",
        error,
      );
    } finally {
      setBuyingNow(false);
    }
  }

  /* ==========================================================
     IMAGE NAVIGATION
  ========================================================== */

  function previousImage() {
    if (media.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current <= 0
        ? media.length - 1
        : current - 1,
    );
  }

  function nextImage() {
    if (media.length <= 1) {
      return;
    }

    setSelectedImage((current) =>
      current >= media.length - 1
        ? 0
        : current + 1,
    );
  }

  /* ==========================================================
     ACCORDION
  ========================================================== */

  function toggleSection(
    section: string,
  ) {
    setOpenSection((current) =>
      current === section
        ? null
        : section,
    );
  }

  /* ==========================================================
     PINCODE
  ========================================================== */

  function checkDelivery() {
    setDeliveryChecked(
      /^[1-9][0-9]{5}$/.test(
        pincode,
      ),
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="product-detail">

      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section className="product-detail__hero">
        <div className="product-detail__container">

          {/* Breadcrumb */}

          <nav
            className="product-detail__breadcrumb"
            aria-label="Breadcrumb"
          >
            <button
              type="button"
              onClick={() =>
                router.push("/shop")
              }
              className="product-detail__breadcrumb-link"
            >
              Shop
            </button>

            {categoryName && (
              <>
                <span
                  className="product-detail__breadcrumb-separator"
                  aria-hidden="true"
                >
                  /
                </span>

                <button
                  type="button"
                  className="product-detail__breadcrumb-link"
                  onClick={() =>
                    router.push(
                      `/shop?category=${encodeURIComponent(
                        safeProduct.categoryId,
                      )}`,
                    )
                  }
                >
                  {categoryName}
                </button>
              </>
            )}

            <span
              className="product-detail__breadcrumb-separator"
              aria-hidden="true"
            >
              /
            </span>

            <span className="product-detail__breadcrumb-current">
              {safeProduct.name}
            </span>
          </nav>

          {/* =================================================
              MAIN PRODUCT GRID
          ================================================= */}

          <div className="product-detail__main-grid">

            {/* =================================================
                MEDIA
            ================================================= */}

            <div className="product-detail__media-column">

              <div
                className={[
                  "product-detail__media-layout",
                  media.length > 1
                    ? "product-detail__media-layout--with-thumbnails"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >

                {/* Thumbnail Rail */}

                {media.length > 1 && (
                  <div
                    className="product-detail__thumbnails"
                    aria-label="Product images"
                  >
                    {media.map(
                      (
                        item,
                        index,
                      ) => (
                        <button
                          key={
                            item.id ??
                            `${item.src}-${index}`
                          }
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              index,
                            )
                          }
                          aria-label={`View image ${
                            index + 1
                          }`}
                          aria-current={
                            selectedImage ===
                            index
                          }
                          className={[
                            "product-detail__thumbnail",
                            selectedImage ===
                            index
                              ? "product-detail__thumbnail--active"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <img
                            src={item.src}
                            alt={
                              item.alt ||
                              safeProduct.name
                            }
                            className="product-detail__thumbnail-image"
                          />

                          <span className="product-detail__thumbnail-index">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                )}

                {/* Main Media */}

                <div className="product-detail__main-media">

                  {currentMedia?.src ? (
                    <img
                      src={currentMedia.src}
                      alt={
                        currentMedia.alt ||
                        safeProduct.name
                      }
                      className="product-detail__main-image"
                    />
                  ) : (
                    <div className="product-detail__image-placeholder">
                      <span>
                        No image available
                      </span>
                    </div>
                  )}

                  <div className="product-detail__media-overlay" />

                  {/* Badge */}

                  {safeProduct.merchandising
                    ?.badges?.length >
                    0 && (
                    <div className="product-detail__badge">
                      {safeProduct.merchandising.badges[0]
                        .replace(
                          /-/g,
                          " ",
                        )
                        .replace(
                          /\b\w/g,
                          (letter) =>
                            letter.toUpperCase(),
                        )}
                    </div>
                  )}

                  {/* Image Counter */}

                  {media.length > 1 && (
                    <div
                      className="product-detail__image-counter"
                      aria-live="polite"
                    >
                      <span>
                        {String(
                          selectedImage + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="product-detail__image-counter-divider">
                        /
                      </span>

                      <span>
                        {String(
                          media.length,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>
                  )}

                  {/* Navigation */}

                  {media.length > 1 && (
                    <div className="product-detail__image-controls">

                      <button
                        type="button"
                        onClick={
                          previousImage
                        }
                        aria-label="Previous image"
                        className="product-detail__image-control"
                      >
                        <ChevronLeft
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextImage
                        }
                        aria-label="Next image"
                        className="product-detail__image-control"
                      >
                        <ChevronRight
                          aria-hidden="true"
                        />
                      </button>

                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="product-detail__information">
              <div className="product-detail__information-inner">

                {/* Editorial label */}

                <div className="product-detail__eyebrow">
                  <span className="product-detail__eyebrow-line" />
                  <span>
                    AAYESHA EDIT
                  </span>
                </div>

                {/* Title */}

                <div className="product-detail__title-row">

                  <div className="product-detail__title-content">

                    {categoryName && (
                      <p className="product-detail__category">
                        {categoryName}
                      </p>
                    )}

                    <h1 className="product-detail__title">
                      {safeProduct.name}
                    </h1>

                  </div>

                  <div className="product-detail__title-actions">
                    <ProductShare
                      productName={
                        safeProduct.name
                      }
                    />

                    <WishlistButton
                      productId={
                        safeProduct._id
                      }
                      productName={
                        safeProduct.name
                      }
                      className="product-detail__wishlist"
                    />
                  </div>
                </div>

                {/* Intro divider */}

                <div className="product-detail__title-divider" />

                {/* Price */}

                <div className="product-detail__price-section">

                  <div className="product-detail__price-row">

                    <span className="product-detail__selling-price">
                      {formatPrice(
                        sellingPrice,
                      )}
                    </span>

                    {mrp >
                      sellingPrice && (
                      <>
                        <span className="product-detail__mrp">
                          {formatPrice(
                            mrp,
                          )}
                        </span>

                        {discount > 0 && (
                          <span className="product-detail__discount">
                            {discount}% OFF
                          </span>
                        )}
                      </>
                    )}

                  </div>

                  <p className="product-detail__tax-note">
                    Inclusive of applicable
                    taxes
                  </p>
                </div>

                {/* Availability */}

                <div className="product-detail__availability">

                  <div className="product-detail__availability-label">
                    <span className="product-detail__status-dot" />
                    Availability
                  </div>

                  <span
                    className={[
                      "product-detail__availability-value",
                      inventoryStatus ===
                      "out-of-stock"
                        ? "product-detail__availability-value--sold-out"
                        : inventoryStatus ===
                            "low-stock"
                          ? "product-detail__availability-value--low"
                          : "product-detail__availability-value--available",
                    ].join(" ")}
                  >
                    {inventoryStatus ===
                    "out-of-stock"
                      ? "Sold Out"
                      : inventoryStatus ===
                          "low-stock"
                        ? `Only ${maxStock} left`
                        : `${maxStock} available`}
                  </span>

                </div>

                {/* Purchase */}

                <div className="product-detail__purchase">

                  <div className="product-detail__purchase-heading">

                    <div>
                      <span className="product-detail__meta-label">
                        Quantity
                      </span>

                      <span className="product-detail__purchase-caption">
                        Select your preferred
                        quantity
                      </span>
                    </div>

                    <span className="product-detail__stock-note">
                      {maxStock > 0
                        ? `${maxStock} in stock`
                        : "Unavailable"}
                    </span>

                  </div>

                  <div className="product-detail__purchase-row">

                    {/* Quantity */}

                    <div className="product-detail__quantity">

                      <button
                        type="button"
                        onClick={
                          decreaseQuantity
                        }
                        disabled={
                          quantity <= 1 ||
                          maxStock <= 0
                        }
                        aria-label="Decrease quantity"
                        className="product-detail__quantity-button"
                      >
                        <Minus
                          aria-hidden="true"
                        />
                      </button>

                      <span
                        className="product-detail__quantity-value"
                        aria-live="polite"
                      >
                        {String(
                          quantity,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={
                          increaseQuantity
                        }
                        disabled={
                          maxStock <= 0 ||
                          quantity >=
                            maxStock
                        }
                        aria-label="Increase quantity"
                        className="product-detail__quantity-button"
                      >
                        <Plus
                          aria-hidden="true"
                        />
                      </button>

                    </div>

                    {/* Add To Bag */}

                    <button
                      type="button"
                      onClick={
                        handleAddToCart
                      }
                      disabled={
                        maxStock <= 0 ||
                        addingToCart ||
                        buyingNow
                      }
                      className="product-detail__add-button"
                    >
                      <span className="product-detail__add-button-main">

                        <ShoppingBag
                          aria-hidden="true"
                        />

                        <span>
                          {addingToCart
                            ? "Adding..."
                            : "Add to Bag"}
                        </span>

                      </span>

                      <span
                        className="product-detail__add-button-arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </button>

                  </div>

                  {/* Buy Now */}

                  <button
                    type="button"
                    onClick={
                      handleBuyNow
                    }
                    disabled={
                      maxStock <= 0 ||
                      addingToCart ||
                      buyingNow
                    }
                    className="product-detail__buy-button"
                  >
                    <span>
                      {buyingNow
                        ? "Processing..."
                        : "Buy Now"}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                    />
                  </button>

                </div>

                {/* Delivery */}

                <div className="product-detail__delivery">

                  <div className="product-detail__delivery-header">

                    <div className="product-detail__delivery-icon-wrap">
                      <MapPin
                        aria-hidden="true"
                      />
                    </div>

                    <div className="product-detail__delivery-content">

                      <div className="product-detail__delivery-heading">

                        <p className="product-detail__delivery-title">
                          Check Delivery
                        </p>

                        <span>
                          India
                        </span>

                      </div>

                      <p className="product-detail__delivery-description">
                        Enter your
                        pincode to
                        check delivery
                        availability.
                      </p>

                      <div className="product-detail__delivery-form">

                        <label
                          htmlFor="product-delivery-pincode"
                          className="sr-only"
                        >
                          Enter delivery
                          pincode
                        </label>

                        <input
                          id="product-delivery-pincode"
                          value={pincode}
                          onChange={(
                            event,
                          ) => {
                            setPincode(
                              event.target.value
                                .replace(
                                  /\D/g,
                                  "",
                                )
                                .slice(
                                  0,
                                  6,
                                ),
                            );

                            setDeliveryChecked(
                              false,
                            );
                          }}
                          onKeyDown={(
                            event,
                          ) => {
                            if (
                              event.key ===
                              "Enter"
                            ) {
                              checkDelivery();
                            }
                          }}
                          inputMode="numeric"
                          autoComplete="postal-code"
                          maxLength={6}
                          placeholder="Enter pincode"
                          className="product-detail__delivery-input"
                        />

                        <button
                          type="button"
                          onClick={
                            checkDelivery
                          }
                          className="product-detail__delivery-button"
                        >
                          Check
                        </button>

                      </div>

                      {deliveryChecked && (
                        <div
                          className="product-detail__delivery-result"
                          role="status"
                          aria-live="polite"
                        >
                          <Check
                            aria-hidden="true"
                          />

                          <span>
                            Delivery available
                          </span>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Service Features */}

                <div className="product-detail__service-features">

                  <div className="product-detail__service-feature">
                    <Truck
                      aria-hidden="true"
                    />

                    <div>
                      <p className="product-detail__service-title">
                        Delivery
                      </p>

                      <p className="product-detail__service-description">
                        Across India
                      </p>
                    </div>
                  </div>

                  <div className="product-detail__service-feature">
                    <ShieldCheck
                      aria-hidden="true"
                    />

                    <div>
                      <p className="product-detail__service-title">
                        Secure
                      </p>

                      <p className="product-detail__service-description">
                        Safe checkout
                      </p>
                    </div>
                  </div>

                  <div className="product-detail__service-feature">
                    <RotateCcw
                      aria-hidden="true"
                    />

                    <div>
                      <p className="product-detail__service-title">
                        Returns
                      </p>

                      <p className="product-detail__service-description">
                        Easy process
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <section className="product-detail__information-section">

        <div className="product-detail__container">

          <div className="product-detail__details-grid">

            {/* Accordions */}

            <div className="product-detail__accordions">

              <div className="product-detail__section-intro">

                <div className="product-detail__eyebrow">
                  <span className="product-detail__eyebrow-line" />
                  <span>
                    Product Information
                  </span>
                </div>

                <h2 className="product-detail__section-title">
                  Product Details
                </h2>

                <p className="product-detail__section-description">
                  Everything you need to know
                  about this piece.
                </p>

              </div>

              <div className="product-detail__accordion-list">

                {/* Description */}

                <div className="product-detail__accordion">

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "description",
                      )
                    }
                    aria-expanded={
                      openSection ===
                      "description"
                    }
                    className="product-detail__accordion-trigger"
                  >
                    <span>
                      <small>
                        01
                      </small>

                      Description
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={
                        openSection ===
                        "description"
                          ? "product-detail__accordion-icon product-detail__accordion-icon--open"
                          : "product-detail__accordion-icon"
                      }
                    />
                  </button>

                  {openSection ===
                    "description" && (
                    <div className="product-detail__accordion-content">

                      {safeProduct.content
                        ?.description ? (
                        <div
                          className="product-detail__description"
                          dangerouslySetInnerHTML={{
                            __html:
                              safeProduct
                                .content
                                .description,
                          }}
                        />
                      ) : (
                        <p className="product-detail__empty-copy">
                          Description will be
                          updated soon.
                        </p>
                      )}

                    </div>
                  )}

                </div>

                {/* Product Details */}

                <div className="product-detail__accordion">

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "details",
                      )
                    }
                    aria-expanded={
                      openSection ===
                      "details"
                    }
                    className="product-detail__accordion-trigger"
                  >
                    <span>
                      <small>
                        02
                      </small>

                      Product Details
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={
                        openSection ===
                        "details"
                          ? "product-detail__accordion-icon product-detail__accordion-icon--open"
                          : "product-detail__accordion-icon"
                      }
                    />
                  </button>

                  {openSection ===
                    "details" && (
                    <div className="product-detail__details-table">

                      {[
                        [
                          "Category",
                          categoryName ||
                            "—",
                        ],
                        [
                          "Status",
                          safeProduct.status,
                        ],
                        [
                          "Currency",
                          safeProduct
                            .pricing
                            ?.currency ??
                            "INR",
                        ],
                        [
                          "Available Stock",
                          String(
                            maxStock,
                          ),
                        ],
                      ].map(
                        ([label, value]) => (
                          <div
                            key={label}
                            className="product-detail__detail-row"
                          >
                            <p className="product-detail__detail-label">
                              {label}
                            </p>

                            <p className="product-detail__detail-value">
                              {value}
                            </p>
                          </div>
                        ),
                      )}

                    </div>
                  )}

                </div>

                {/* Shipping */}

                <div className="product-detail__accordion">

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "shipping",
                      )
                    }
                    aria-expanded={
                      openSection ===
                      "shipping"
                    }
                    className="product-detail__accordion-trigger"
                  >
                    <span>
                      <small>
                        03
                      </small>

                      Shipping & Delivery
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={
                        openSection ===
                        "shipping"
                          ? "product-detail__accordion-icon product-detail__accordion-icon--open"
                          : "product-detail__accordion-icon"
                      }
                    />
                  </button>

                  {openSection ===
                    "shipping" && (
                    <p className="product-detail__accordion-copy">
                      Shipping and delivery
                      availability is
                      calculated during
                      checkout based on
                      your delivery
                      address.
                    </p>
                  )}

                </div>

                {/* Returns */}

                <div className="product-detail__accordion">

                  <button
                    type="button"
                    onClick={() =>
                      toggleSection(
                        "returns",
                      )
                    }
                    aria-expanded={
                      openSection ===
                      "returns"
                    }
                    className="product-detail__accordion-trigger"
                  >
                    <span>
                      <small>
                        04
                      </small>

                      Returns & Exchange
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={
                        openSection ===
                        "returns"
                          ? "product-detail__accordion-icon product-detail__accordion-icon--open"
                          : "product-detail__accordion-icon"
                      }
                    />
                  </button>

                  {openSection ===
                    "returns" && (
                    <p className="product-detail__accordion-copy">
                      Please refer to the
                      store return and
                      exchange policy
                      applicable to this
                      product.
                    </p>
                  )}

                </div>

              </div>
            </div>

            {/* Brand Panel */}

            <aside className="product-detail__brand-panel">

              <div className="product-detail__brand-mark">
                AA
              </div>

              <p className="product-detail__brand-eyebrow">
                AAYESHA FASHION
              </p>

              <h3 className="product-detail__brand-title">
                Thoughtfully
                <br />
                designed.
              </h3>

              <p className="product-detail__brand-description">
                Designed with an
                emphasis on elegance,
                comfort and timeless
                style.
              </p>

              <div className="product-detail__brand-divider" />

              <div className="product-detail__brand-meta">

                <div>
                  <p className="product-detail__brand-meta-label">
                    Price
                  </p>

                  <p className="product-detail__brand-meta-value">
                    {formatPrice(
                      sellingPrice,
                    )}
                  </p>
                </div>

                <div>
                  <p className="product-detail__brand-meta-label">
                    Availability
                  </p>

                  <p className="product-detail__brand-meta-value">
                    {maxStock > 0
                      ? `${maxStock} available`
                      : "Currently unavailable"}
                  </p>
                </div>

              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* =====================================================
          RECOMMENDATIONS
      ===================================================== */}

      {safeRecommendations.length >
        0 && (
        <section className="product-detail__recommendations">

          <div className="product-detail__container">

            <div className="product-detail__recommendations-header">

              <div>

                <div className="product-detail__eyebrow">
                  <span className="product-detail__eyebrow-line" />

                  <span>
                    You May Also Like
                  </span>
                </div>

                <h2 className="product-detail__section-title">
                  More from this edit
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/shop?category=${encodeURIComponent(
                      safeProduct.categoryId,
                    )}`,
                  )
                }
                className="product-detail__view-all"
              >
                <span>
                  View All
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                />
              </button>

            </div>

            <div className="product-detail__recommendation-grid">

              {safeRecommendations.map(
                (item) => {
                  const image =
                    Array.isArray(
                      item.media,
                    )
                      ? item.media.find(
                          (
                            mediaItem,
                          ) =>
                            mediaItem?.type ===
                              "image" &&
                            Boolean(
                              mediaItem?.src,
                            ),
                        )
                      : null;

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() =>
                        router.push(
                          `/products/${item._id}`,
                        )
                      }
                      className="product-detail__recommendation"
                    >

                      <div className="product-detail__recommendation-media">

                        {image ? (
                          <img
                            src={image.src}
                            alt={
                              image.alt ||
                              item.name
                            }
                            className="product-detail__recommendation-image"
                          />
                        ) : (
                          <div className="product-detail__recommendation-placeholder">
                            No image
                          </div>
                        )}

                        <span className="product-detail__recommendation-arrow">
                          ↗
                        </span>

                      </div>

                      <div className="product-detail__recommendation-content">

                        <p className="product-detail__recommendation-name">
                          {item.name}
                        </p>

                        <p className="product-detail__recommendation-price">
                          {formatPrice(
                            item.pricing
                              ?.sellingPrice ??
                              0,
                          )}
                        </p>

                      </div>

                    </button>
                  );
                },
              )}

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          RECENTLY VIEWED
      ===================================================== */}

      <RecentlyViewed
        currentProductId={
          safeProduct._id
        }
      />

    </main>
  );
}