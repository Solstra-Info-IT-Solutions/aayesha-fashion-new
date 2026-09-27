/* =========================================================
   AAYESHA FASHION — FRESH PRODUCT DETAIL PAGE
   Self-contained PDP component.
   Keeps existing product, cart, auth, wishlist and category APIs.
========================================================= */

"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Heart,
  MapPin,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Product, ProductMedia } from "@/types/product";
import {
  getAvailableStock,
  getInventoryStatus,
} from "@/types/product";
import { getCategories } from "@/services/category.service";
import { addToCart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";
import { ProductCard } from "@/components/product/product-card";

import "./ProductDetail.css";

interface ProductDetailProps {
  product: Product;
  recommendations?: Product[];
}

type DetailRow = {
  label: string;
  value: string;
};

const money = (value = 0) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function getDiscount(mrp: number, price: number) {
  if (!mrp || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function sortMedia(media: ProductMedia[] = []) {
  return [...media]
    .filter(Boolean)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function parseDescription(description = ""): DetailRow[] {
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const clean = line.replace(/^[-*]\s*/, "").trim();
      const match = clean.match(
        /^\**([^:*]+?)\**\s*:\s*\**(.+?)\**$/,
      );

      if (!match) return null;

      return {
        label: match[1].replace(/\*\*/g, "").trim(),
        value: match[2].replace(/\*\*/g, "").trim(),
      };
    })
    .filter(Boolean) as DetailRow[];
}

function getParagraphs(description = "") {
  return description
    .split(/\r?\n\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter(
      (item) =>
        !item.startsWith("**Product Content**") &&
        !item.startsWith("- **"),
    );
}

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const wishlistIds = useWishlistStore(
    (state) => state.productIds,
  );
  const toggleWishlist = useWishlistStore(
    (state) => state.toggle,
  );

  const productId = product._id || product.id;
  const media = useMemo(
    () => sortMedia(product.media),
    [product.media],
  );

  const stock = getAvailableStock(product);
  const inventoryStatus = getInventoryStatus(product);
  const mrp = product.pricing?.mrp ?? 0;
  const sellingPrice = product.pricing?.sellingPrice ?? 0;
  const discount = getDiscount(mrp, sellingPrice);
  const available = product.status === "active" && stock > 0;
  const wishlisted = wishlistIds.includes(productId);

  const detailRows = useMemo(
    () => parseDescription(product.content?.description ?? ""),
    [product.content?.description],
  );

  const paragraphs = useMemo(
    () => getParagraphs(product.content?.description ?? ""),
    [product.content?.description],
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [categoryName, setCategoryName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
const [loginAction, setLoginAction] =
  useState<"cart" | "wishlist">("cart");

  const [openSection, setOpenSection] = useState<string | null>(
    "details",
  );
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  const activeMedia = media[activeIndex] ?? null;

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      if (!product.categoryId) {
        setCategoryName("");
        return;
      }

      try {
        const categories = await getCategories();
        const category = categories.find(
          (item) => item.id === product.categoryId,
        );

        if (!cancelled) {
          setCategoryName(category?.name ?? "");
        }
      } catch (error) {
        console.error("Failed to load product category:", error);

        if (!cancelled) {
          setCategoryName("");
        }
      }
    }

    void loadCategory();

    return () => {
      cancelled = true;
    };
  }, [product.categoryId]);

  useEffect(() => {
    setActiveIndex(0);
    setQuantity(1);
    setDeliveryChecked(false);
  }, [productId]);

  useEffect(() => {
    if (!shareOpen && !lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          setShareOpen(false);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shareOpen, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          media.length <= 1
            ? current
            : current <= 0
              ? media.length - 1
              : current - 1,
        );
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          media.length <= 1
            ? current
            : current >= media.length - 1
              ? 0
              : current + 1,
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, media.length]);

  function previousMedia() {
    if (media.length <= 1) return;

    setActiveIndex((current) =>
      current <= 0 ? media.length - 1 : current - 1,
    );
  }

  function nextMedia() {
    if (media.length <= 1) return;

    setActiveIndex((current) =>
      current >= media.length - 1 ? 0 : current + 1,
    );
  }

  const requireAuth = (
  action: "cart" | "wishlist" = "cart",
) => {
  if (!isInitialized) {
    return false;
  }

  if (!isAuthenticated) {
    setLoginAction(action);
    setLoginOpen(true);

    return false;
  }

  return true;
};

  async function handleAddToCart() {
    if (!available) {
      toast.error("This product is currently unavailable.");
      return;
    }

    if (adding || buying || !requireAuth()) return;

    try {
      setAdding(true);
      await addToCart(productId, quantity);

      toast.success(
        quantity > 1
          ? `${quantity} × ${product.name} added to your bag.`
          : `${product.name} added to your bag.`,
      );
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleBuyNow() {
    if (!available) {
      toast.error("This product is currently unavailable.");
      return;
    }

    if (adding || buying || !requireAuth()) return;

    try {
      setBuying(true);
      await addToCart(productId, quantity);
      router.push("/checkout");
    } catch (error) {
      console.error("BUY NOW ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to continue to checkout.",
      );

      setBuying(false);
    }
  }

  function handleWishlist() {
    if (!requireAuth("wishlist")) return;

    toggleWishlist(productId);

    toast.success(
      wishlisted
        ? "Removed from wishlist."
        : "Added to wishlist.",
    );
  }

  async function copyProductLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied.");
    } catch {
      toast.error("Unable to copy the product link.");
    }
  }

  async function nativeShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Take a look at ${product.name} from Aayesha Fashion.`,
          url,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }

    await copyProductLink();
  }

  function shareWhatsApp() {
    const message = `Take a look at ${product.name} from Aayesha Fashion.\n\n${window.location.href}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function checkDelivery() {
    const valid = /^[1-9][0-9]{5}$/.test(pincode);
    setDeliveryChecked(valid);

    if (!valid) {
      toast.error("Please enter a valid 6-digit pincode.");
    }
  }

  function toggleSection(section: string) {
    setOpenSection((current) =>
      current === section ? null : section,
    );
  }

  const trustItems = [
    {
      icon: Truck,
      title: "Reliable Delivery",
      text: "Secure delivery across India",
    },
    {
      icon: RotateCcw,
      title: "Easy Exchange",
      text: "Support for eligible orders",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      text: "Protected checkout experience",
    },
    {
      icon: Sparkles,
      title: "Curated Quality",
      text: "Thoughtfully selected designs",
    },
  ];

  return (
    <>
      <main className="product-detail">
        {/* =====================================================
            BREADCRUMB
        ===================================================== */}
        <div className="product-detail__breadcrumb-wrap">
          <div className="product-detail__container product-detail__breadcrumb">
            <Link href="/shop">Shop</Link>
            {categoryName && (
              <>
                <span>/</span>
                <span>{categoryName}</span>
              </>
            )}
            <span>/</span>
            <span className="product-detail__breadcrumb-current">
              {product.name}
            </span>
          </div>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="product-detail__main">
          <div className="product-detail__grid">
            {/* =================================================
                GALLERY
            ================================================= */}
            <div className="product-detail__gallery">
              <div className="product-detail__media">
                {media.length > 1 && (
                  <div className="product-detail__thumbnails">
                    {media.map((item, index) => (
                      <button
                        key={item.id || `${item.src}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={[
                          "product-detail__thumbnail",
                          index === activeIndex
                            ? "product-detail__thumbnail--active"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-label={`View product media ${index + 1}`}
                      >
                        {item.type === "video" ? (
                          <video
                            src={item.src}
                            poster={item.poster}
                            muted
                            playsInline
                          />
                        ) : (
                          <Image
                            src={item.thumbnail || item.src}
                            alt={item.alt || product.name}
                            fill
                            sizes="100px"
                          />
                        )}
                        <span className="product-detail__thumbnail-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="product-detail__media-stage"
                  onDoubleClick={() => setLightboxOpen(true)}
                >
                  {product.merchandising?.isNew && (
                    <span className="product-detail__media-badge">
                      New Arrival
                    </span>
                  )}

                  {activeMedia?.type === "video" ? (
                    <video
                      src={activeMedia.src}
                      poster={activeMedia.poster}
                      controls
                      playsInline
                      className="product-detail__media-element"
                    />
                  ) : activeMedia ? (
                    <Image
                      src={activeMedia.src}
                      alt={activeMedia.alt || product.name}
                      fill
                      priority
                      sizes="(max-width: 760px) 100vw, 65vw"
                      className="product-detail__media-element"
                    />
                  ) : (
                    <div className="product-detail__media-placeholder">
                      <span>No image available</span>
                    </div>
                  )}

                  {media.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousMedia}
                        aria-label="Previous product media"
                        className="product-detail__media-nav product-detail__media-nav--prev"
                      >
                        <ArrowLeft size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={nextMedia}
                        aria-label="Next product media"
                        className="product-detail__media-nav product-detail__media-nav--next"
                      >
                        <ArrowRight size={17} />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="product-detail__view-button"
                  >
                    View full screen
                  </button>

                  <div className="product-detail__media-count">
                    {String(activeIndex + 1).padStart(2, "0")}{" "}
                    /{" "}
                    {String(Math.max(media.length, 1)).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PRODUCT INFO
            ================================================= */}
            <aside className="product-detail__info">
              <div className="product-detail__brand-row">
                <div className="product-detail__eyebrow">
                  Aayesha Fashion
                </div>

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={!isInitialized}
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={wishlisted}
                  className={[
                    "product-detail__round-action",
                    wishlisted
                      ? "product-detail__round-action--active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Heart
                    size={19}
                    strokeWidth={1.35}
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <h1 className="product-detail__title">
                {product.name}
              </h1>

              <p className="product-detail__description">
                {product.content?.description ||
                  "A thoughtfully crafted piece from the Aayesha Fashion collection."}
              </p>

              <div className="product-detail__price-block">
                <div className="product-detail__price-row">
                  <strong className="product-detail__price">
                    {money(sellingPrice)}
                  </strong>

                  {mrp > sellingPrice && (
                    <span className="product-detail__mrp">
                      {money(mrp)}
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="product-detail__discount">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <p className="product-detail__tax">
                  Inclusive of applicable taxes
                </p>
              </div>

              <div
                className={[
                  "product-detail__stock",
                  `product-detail__stock--${inventoryStatus}`,
                ].join(" ")}
              >
                <span className="product-detail__stock-dot" />

                {inventoryStatus === "low-stock"
                  ? `Only ${stock} left in stock`
                  : inventoryStatus === "in-stock"
                    ? "In stock · Ready to ship"
                    : "Currently sold out"}
              </div>

              {/* PURCHASE */}
              <div className="product-detail__purchase">
                <div className="product-detail__purchase-label-row">
                  <span>Quantity</span>

                  <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    className="product-detail__text-action"
                  >
                    <Share2 size={15} />
                    Share
                  </button>
                </div>

                <div className="product-detail__purchase-row">
                  <div className="product-detail__quantity">
                    <button
                      type="button"
                      disabled={quantity <= 1 || adding || buying}
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(1, current - 1),
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>

                    <span className="product-detail__quantity-value">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={
                        !available ||
                        quantity >= stock ||
                        adding ||
                        buying
                      }
                      onClick={() =>
                        setQuantity((current) =>
                          Math.min(stock, current + 1),
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleAddToCart()}
                    disabled={
                      !available ||
                      adding ||
                      buying ||
                      !isInitialized
                    }
                    className="product-detail__add-button"
                  >
                    <ShoppingBag size={17} />
                    {adding
                      ? "Adding..."
                      : available
                        ? "Add to Bag"
                        : "Sold Out"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => void handleBuyNow()}
                  disabled={
                    !available ||
                    adding ||
                    buying ||
                    !isInitialized
                  }
                  className="product-detail__buy-button"
                >
                  {buying ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {/* DELIVERY CHECK */}
              <div className="product-detail__delivery">
                <div className="product-detail__delivery-icon">
                  <MapPin size={16} />
                </div>

                <div className="product-detail__delivery-copy">
                  <p>Check delivery</p>
                  <span>
                    Enter your pincode to check delivery availability.
                  </span>

                  <div className="product-detail__pincode">
                    <input
                      value={pincode}
                      onChange={(event) => {
                        setPincode(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        );
                        setDeliveryChecked(false);
                      }}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter pincode"
                      aria-label="Delivery pincode"
                    />

                    <button
                      type="button"
                      onClick={checkDelivery}
                    >
                      Check
                    </button>
                  </div>

                  {deliveryChecked && (
                    <p className="product-detail__delivery-success">
                      <Check size={13} />
                      Delivery available to {pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* TRUST */}
              <div className="product-detail__trust">
                {trustItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={[
                        "product-detail__trust-item",
                        index % 2 === 0
                          ? "product-detail__trust-item--right"
                          : "",
                        index < 2
                          ? "product-detail__trust-item--bottom"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="product-detail__trust-icon">
                        <Icon size={17} strokeWidth={1.4} />
                      </span>

                      <div>
                        <p className="product-detail__trust-title">
                          {item.title}
                        </p>
                        <p className="product-detail__trust-text">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>

        {/* =====================================================
            DETAILS EDITORIAL SECTION
        ===================================================== */}
        <section className="product-detail__editorial">
          <div className="product-detail__container">
            <div className="product-detail__editorial-grid">
              <div className="product-detail__editorial-heading">
                <p className="product-detail__section-eyebrow">
                  The Details
                </p>

                <h2>
                  Made for moments
                  <br />
                  worth remembering.
                </h2>

                <span className="product-detail__editorial-mark">
                  AAYESHA / 01
                </span>
              </div>

              <div className="product-detail__editorial-content">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>
                      {paragraph.replace(/\*\*/g, "")}
                    </p>
                  ))
                ) : (
                  <p>
                    Every detail of this piece is presented with
                    craftsmanship, comfort and occasion in mind.
                  </p>
                )}

                {detailRows.length > 0 && (
                  <div className="product-detail__details-grid">
                    {detailRows.map((row) => (
                      <div
                        key={`${row.label}-${row.value}`}
                        className="product-detail__detail"
                      >
                        <span className="product-detail__detail-label">
                          {row.label}
                        </span>
                        <span className="product-detail__detail-value">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACCORDIONS
        ===================================================== */}
        <section className="product-detail__accordions">
          <div className="product-detail__container product-detail__accordion-container">
            {[
              {
                id: "details",
                title: "Product Details",
                content:
                  product.content?.description ||
                  "Product details are currently unavailable.",
              },
              {
                id: "shipping",
                title: "Shipping & Delivery",
                content:
                  "Secure delivery across India. Delivery updates are provided during order processing.",
              },
              {
                id: "returns",
                title: "Returns & Exchange",
                content:
                  "Exchange and return support is available for eligible orders according to the applicable order policy.",
              },
            ].map((section) => {
              const open = openSection === section.id;

              return (
                <div
                  key={section.id}
                  className="product-detail__accordion"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={open}
                    className="product-detail__accordion-trigger"
                  >
                    <span>{section.title}</span>

                    {open ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {open && (
                    <div className="product-detail__accordion-body">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            RECOMMENDATIONS
        ===================================================== */}
        {recommendations.length > 0 && (
          <section className="product-detail__recommendations">
            <div className="product-detail__container">
              <div className="product-detail__recommendations-heading">
                <div>
                  <p className="product-detail__section-eyebrow">
                    Curated for you
                  </p>

                  <h2>You may also like.</h2>

                  <p>
                    Explore more pieces selected to complement
                    your current choice.
                  </p>
                </div>

                <Link href="/shop">
                  View collection <ArrowRight size={15} />
                </Link>
              </div>

              <div className="product-detail__recommendations-grid">
                {recommendations.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item.id || item._id}
                    product={item}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =======================================================
          MOBILE STICKY BUY BAR
      ======================================================= */}
      <div className="product-detail__sticky-buy">
        <div className="product-detail__sticky-buy-inner">
          <div className="product-detail__sticky-product">
            <span>{product.name}</span>
            <strong>{money(sellingPrice)}</strong>
          </div>

          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={!available || adding || buying || !isInitialized}
          >
            <ShoppingBag size={16} />
            {adding ? "Adding..." : available ? "Add to Bag" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* =======================================================
          SHARE MODAL
      ======================================================= */}
      {shareOpen && (
        <div
          className="product-detail__modal-backdrop"
          role="presentation"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="product-detail__share-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Share product"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="product-detail__modal-head">
              <div>
                <p className="product-detail__section-eyebrow">
                  Aayesha Fashion
                </p>
                <h3>Share this piece</h3>
              </div>

              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Close share dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p className="product-detail__share-name">
              {product.name}
            </p>

            <div className="product-detail__share-actions">
              <button type="button" onClick={() => void nativeShare()}>
                <Share2 size={17} />
                <span>Share</span>
              </button>

              <button type="button" onClick={shareWhatsApp}>
                <span className="product-detail__whatsapp-icon">W</span>
                <span>WhatsApp</span>
              </button>

              <button type="button" onClick={() => void copyProductLink()}>
                <Copy size={17} />
                <span>Copy link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          FULLSCREEN MEDIA
      ======================================================= */}
      {lightboxOpen && activeMedia && mounted
        ? createPortal(
            <div
              className="product-detail__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} fullscreen gallery`}
        >
          <div className="product-detail__lightbox-actions">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="product-detail__lightbox-exit"
              aria-label="Exit fullscreen gallery"
            >
              <Minimize2 size={15} strokeWidth={1.7} />
              <span>Exit Fullscreen</span>
            </button>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="product-detail__lightbox-close"
              aria-label="Close gallery"
            >
              <X size={20} strokeWidth={1.7} />
            </button>
          </div>

          <div className="product-detail__lightbox-top">
            <span>AAYESHA / PRODUCT VIEW</span>
            <strong>{product.name}</strong>
          </div>

          <div className="product-detail__lightbox-stage">
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.src}
                poster={activeMedia.poster}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <Image
                src={activeMedia.src}
                alt={activeMedia.alt || product.name}
                fill
                sizes="100vw"
                className="product-detail__lightbox-image"
                priority
              />
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousMedia}
                  className="product-detail__lightbox-nav product-detail__lightbox-nav--prev"
                  aria-label="Previous media"
                >
                  <ArrowLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={nextMedia}
                  className="product-detail__lightbox-nav product-detail__lightbox-nav--next"
                  aria-label="Next media"
                >
                  <ArrowRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="product-detail__lightbox-counter">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(media.length).padStart(2, "0")}
          </div>
            </div>,
            document.body,
          )
        : null}

      <LoginRequiredPopup
  open={loginOpen}
  onClose={() => setLoginOpen(false)}
  action={loginAction}
/>
    </>
  );
}

export default ProductDetail;
