"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  MapPin,
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

/* =========================================================
   TYPES
========================================================= */

type ProductApiResponse = {
  sourceUrl: string;
  title: string;
  description: string;
  mainContent: string;
  headings: string[];
  links: string[];
};

type ProductDetailPageProps = {
  product: ProductApiResponse;

  /*
   * Optional image URLs.
   *
   * If your API already provides images, pass them here.
   * If not, the page will show an elegant media placeholder.
   */
  images?: string[];

  price?: number;
  mrp?: number;
  stock?: number;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductDetailPage({
  product,
  images = [],
  price = 3500,
  mrp = 0,
  stock = 10,
}: ProductDetailPageProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] =
    useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openAccordion, setOpenAccordion] =
    useState<string | null>("Product Details");

  /* =======================================================
     PRICE
  ======================================================= */

  const actualPrice = price || 3500;

  const discount =
    mrp > actualPrice
      ? Math.round(
          ((mrp - actualPrice) / mrp) * 100,
        )
      : 0;

  /* =======================================================
     PRODUCT CONTENT
  ======================================================= */

  const productContent = useMemo(() => {
    const content = product.mainContent || "";

    const parts = content.split(
      /\*\*Product Content\*\*/i,
    );

    const intro = parts[0]?.trim() || "";

    const specifications =
      parts[1]
        ?.split("\n")
        .map((line) =>
          line
            .replace(/^- /, "")
            .trim(),
        )
        .filter(Boolean) || [];

    return {
      intro,
      specifications,
    };
  }, [product.mainContent]);

  /* =======================================================
     SPECIFICATIONS
  ======================================================= */

  const specificationRows =
    productContent.specifications
      .map((item) => {
        const clean = item.replace(
          /\*\*/g,
          "",
        );

        const separatorIndex =
          clean.indexOf(":");

        if (separatorIndex === -1) {
          return {
            label: "",
            value: clean,
          };
        }

        return {
          label: clean
            .slice(0, separatorIndex)
            .trim(),
          value: clean
            .slice(separatorIndex + 1)
            .trim(),
        };
      })
      .filter(
        (item) =>
          item.label ||
          item.value,
      );

  /* =======================================================
     IMAGE NAVIGATION
  ======================================================= */

  const hasImages = images.length > 0;

  const previousImage = () => {
    if (!hasImages) return;

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  };

  const nextImage = () => {
    if (!hasImages) return;

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );
  };

  /* =======================================================
     DELIVERY
  ======================================================= */

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryChecked(false);
      toast.error(
        "Please enter a valid 6-digit pincode.",
      );
      return;
    }

    setDeliveryChecked(true);
    toast.success(
      "Delivery is available at this location.",
    );
  };

  /* =======================================================
     SHARE
  ======================================================= */

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : product.sourceUrl;

  const handleShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: shareUrl,
        });
      } catch {
        // User cancelled native share.
      }

      return;
    }

    setShareOpen(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        shareUrl,
      );

      setCopied(true);
      toast.success("Product link copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      toast.error(
        "Unable to copy product link.",
      );
    }
  };

  const shareWhatsApp = () => {
    const message = `Take a look at ${product.title} from Aayesha Fashion.\n\n${shareUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        message,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  /* =======================================================
     ADD TO BAG
  ======================================================= */

  const handleAddToBag = () => {
    if (stock <= 0) {
      toast.error(
        "This product is currently sold out.",
      );
      return;
    }

    toast.success(
      quantity > 1
        ? `${quantity} × ${product.title} added to your bag.`
        : `${product.title} added to your bag.`,
    );
  };

  /* =======================================================
     BUY NOW
  ======================================================= */

  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error(
        "This product is currently sold out.",
      );
      return;
    }

    toast.success("Proceeding to checkout.");
  };

  /* =======================================================
     ACCORDION
  ======================================================= */

  const toggleAccordion = (
    heading: string,
  ) => {
    setOpenAccordion((current) =>
      current === heading
        ? null
        : heading,
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="pdp">
      {/* ===================================================
          PAGE STYLE
      =================================================== */}

      <style jsx global>{`
        :root {
          --pdp-bg: #f8f5f1;
          --pdp-surface: #ffffff;
          --pdp-surface-soft: #f2eee9;
          --pdp-text: #201c19;
          --pdp-muted: #7b726b;
          --pdp-border: #ddd5ce;
          --pdp-accent: #9a6b50;
          --pdp-accent-dark: #6f4936;
          --pdp-dark: #211d1a;
          --pdp-radius: 2px;
        }

        .pdp {
          min-height: 100vh;
          background: var(--pdp-bg);
          color: var(--pdp-text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .pdp *,
        .pdp *::before,
        .pdp *::after {
          box-sizing: border-box;
        }

        .pdp button,
        .pdp input {
          font: inherit;
        }

        .pdp button {
          cursor: pointer;
        }

        .pdp__container {
          width: min(
            1480px,
            calc(100% - 40px)
          );
          margin: 0 auto;
        }

        /* ================================================
           BREADCRUMB
        ================================================ */

        .pdp__breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 0;
          color: var(--pdp-muted);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .pdp__breadcrumb a {
          color: inherit;
          text-decoration: none;
        }

        .pdp__breadcrumb a:hover {
          color: var(--pdp-text);
        }

        .pdp__breadcrumb-separator {
          opacity: 0.45;
        }

        .pdp__breadcrumb-current {
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ================================================
           MAIN PRODUCT GRID
        ================================================ */

        .pdp__hero {
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(420px, 0.92fr);
          gap: clamp(44px, 6vw, 110px);
          align-items: start;
          padding-bottom: 110px;
        }

        /* ================================================
           MEDIA
        ================================================ */

        .pdp__media {
          position: sticky;
          top: 24px;
          min-width: 0;
        }

        .pdp__media-main {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 35%,
              #eee4da 0%,
              #ddd0c4 38%,
              #c9b7a8 100%
            );
        }

        .pdp__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdp__media-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pdp__placeholder-shape {
          width: 54%;
          height: 76%;
          border-radius: 46% 46% 8% 8%;
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.75),
              rgba(112,76,56,0.3)
            );
          box-shadow:
            0 30px 70px
            rgba(54,38,28,0.18);
          transform:
            rotate(-4deg);
        }

        .pdp__placeholder-copy {
          position: absolute;
          bottom: 42px;
          left: 42px;
          right: 42px;
        }

        .pdp__placeholder-eyebrow {
          margin: 0 0 8px;
          color: rgba(255,255,255,0.78);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .pdp__placeholder-title {
          max-width: 520px;
          margin: 0;
          color: white;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(
            28px,
            4vw,
            54px
          );
          font-weight: 400;
          line-height: 0.98;
        }

        .pdp__media-count {
          position: absolute;
          right: 20px;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          color: white;
          background: rgba(20,17,15,0.55);
          backdrop-filter: blur(12px);
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .pdp__media-arrow {
          position: absolute;
          top: 50%;
          z-index: 2;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 50%;
          color: white;
          background: rgba(25,21,18,0.24);
          backdrop-filter: blur(12px);
          transform: translateY(-50%);
          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .pdp__media-arrow:hover {
          background: rgba(25,21,18,0.55);
        }

        .pdp__media-arrow--left {
          left: 20px;
        }

        .pdp__media-arrow--right {
          right: 20px;
        }

        .pdp__media-thumbs {
          display: grid;
          grid-template-columns: repeat(
            5,
            minmax(0, 1fr)
          );
          gap: 8px;
          margin-top: 8px;
        }

        .pdp__thumb {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid transparent;
          background: #e7ded6;
          padding: 0;
        }

        .pdp__thumb--active {
          border-color: var(--pdp-text);
        }

        .pdp__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ================================================
           INFO
        ================================================ */

        .pdp__info {
          min-width: 0;
          padding-top: 10px;
        }

        .pdp__category {
          margin: 0 0 16px;
          color: var(--pdp-accent);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .pdp__title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .pdp__title {
          max-width: 720px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(
            38px,
            5vw,
            72px
          );
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 0.96;
        }

        .pdp__wishlist {
          flex: 0 0 auto;
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border: 1px solid var(--pdp-border);
          border-radius: 50%;
          color: var(--pdp-text);
          background: transparent;
          transition:
            color 180ms ease,
            background 180ms ease,
            border-color 180ms ease;
        }

        .pdp__wishlist:hover,
        .pdp__wishlist--active {
          color: white;
          border-color: var(--pdp-dark);
          background: var(--pdp-dark);
        }

        .pdp__description {
          max-width: 650px;
          margin: 28px 0 0;
          color: var(--pdp-muted);
          font-size: 14px;
          line-height: 1.9;
        }

        /* ================================================
           PRICE
        ================================================ */

        .pdp__price-block {
          margin-top: 34px;
          padding: 24px 0;
          border-top: 1px solid var(--pdp-border);
          border-bottom: 1px solid var(--pdp-border);
        }

        .pdp__price-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 14px;
        }

        .pdp__price {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 32px;
        }

        .pdp__mrp {
          color: #a09892;
          font-size: 15px;
          text-decoration: line-through;
        }

        .pdp__discount {
          padding: 5px 8px;
          color: var(--pdp-accent-dark);
          background: #eee2d8;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .pdp__tax {
          margin: 8px 0 0;
          color: var(--pdp-muted);
          font-size: 10px;
        }

        /* ================================================
           PURCHASE
        ================================================ */

        .pdp__purchase {
          margin-top: 30px;
        }

        .pdp__purchase-label-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .pdp__purchase-label,
        .pdp__stock {
          margin: 0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pdp__stock {
          color: #4e795f;
        }

        .pdp__purchase-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 10px;
        }

        .pdp__quantity {
          display: grid;
          grid-template-columns: 36px 1fr 36px;
          min-height: 58px;
          border: 1px solid var(--pdp-border);
          background: var(--pdp-surface);
        }

        .pdp__quantity button {
          border: 0;
          background: transparent;
          color: var(--pdp-text);
        }

        .pdp__quantity button:disabled {
          cursor: not-allowed;
          opacity: 0.3;
        }

        .pdp__quantity-value {
          display: grid;
          place-items: center;
          border-inline:
            1px solid var(--pdp-border);
          font-size: 13px;
        }

        .pdp__add {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid var(--pdp-dark);
          color: white;
          background: var(--pdp-dark);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .pdp__add:hover {
          background: var(--pdp-accent-dark);
        }

        .pdp__buy {
          width: 100%;
          min-height: 56px;
          margin-top: 10px;
          border: 1px solid var(--pdp-dark);
          color: var(--pdp-dark);
          background: transparent;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          transition:
            color 180ms ease,
            background 180ms ease;
        }

        .pdp__buy:hover {
          color: white;
          background: var(--pdp-dark);
        }

        /* ================================================
           ACTIONS
        ================================================ */

        .pdp__actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 18px;
        }

        .pdp__share {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          border: 0;
          color: var(--pdp-muted);
          background: transparent;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pdp__share:hover {
          color: var(--pdp-text);
        }

        /* ================================================
           DELIVERY
        ================================================ */

        .pdp__delivery {
          margin-top: 34px;
          padding: 22px;
          background: var(--pdp-surface-soft);
        }

        .pdp__delivery-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdp__delivery-icon {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid var(--pdp-border);
          border-radius: 50%;
          background: white;
        }

        .pdp__delivery-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
        }

        .pdp__delivery-copy {
          margin: 3px 0 0;
          color: var(--pdp-muted);
          font-size: 10px;
        }

        .pdp__delivery-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          margin-top: 18px;
        }

        .pdp__delivery-input {
          min-width: 0;
          height: 48px;
          padding: 0 14px;
          border: 1px solid var(--pdp-border);
          outline: none;
          background: white;
          color: var(--pdp-text);
          font-size: 12px;
        }

        .pdp__delivery-input:focus {
          border-color: var(--pdp-text);
        }

        .pdp__delivery-button {
          min-width: 90px;
          border: 1px solid var(--pdp-dark);
          color: white;
          background: var(--pdp-dark);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .pdp__delivery-result {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--pdp-border);
          color: #4d7359;
          font-size: 11px;
        }

        /* ================================================
           TRUST
        ================================================ */

        .pdp__trust {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 26px;
          border-top: 1px solid var(--pdp-border);
          border-left: 1px solid var(--pdp-border);
        }

        .pdp__trust-item {
          display: flex;
          gap: 12px;
          min-height: 105px;
          padding: 17px;
          border-right: 1px solid var(--pdp-border);
          border-bottom: 1px solid var(--pdp-border);
        }

        .pdp__trust-icon {
          flex: 0 0 auto;
          color: var(--pdp-accent);
        }

        .pdp__trust-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
        }

        .pdp__trust-text {
          margin: 5px 0 0;
          color: var(--pdp-muted);
          font-size: 9px;
          line-height: 1.6;
        }

        /* ================================================
           CONTENT SECTION
        ================================================ */

        .pdp__details {
          padding: 90px 0 120px;
          border-top: 1px solid var(--pdp-border);
          background: var(--pdp-surface);
        }

        .pdp__details-grid {
          display: grid;
          grid-template-columns:
            minmax(250px, 0.7fr)
            minmax(0, 1.3fr);
          gap: 100px;
        }

        .pdp__details-eyebrow {
          margin: 0 0 14px;
          color: var(--pdp-accent);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .pdp__details-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(
            36px,
            4vw,
            58px
          );
          font-weight: 400;
          line-height: 0.98;
        }

        .pdp__details-intro {
          margin: 20px 0 0;
          color: var(--pdp-muted);
          font-size: 12px;
          line-height: 1.9;
        }

        .pdp__accordions {
          border-top: 1px solid var(--pdp-border);
        }

        .pdp__accordion {
          border-bottom: 1px solid var(--pdp-border);
        }

        .pdp__accordion-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 23px 0;
          border: 0;
          color: var(--pdp-text);
          background: transparent;
          text-align: left;
        }

        .pdp__accordion-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
        }

        .pdp__accordion-content {
          padding: 0 0 26px;
        }

        .pdp__specs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid var(--pdp-border);
          border-left: 1px solid var(--pdp-border);
        }

        .pdp__spec {
          min-height: 68px;
          padding: 13px 15px;
          border-right: 1px solid var(--pdp-border);
          border-bottom: 1px solid var(--pdp-border);
        }

        .pdp__spec-label {
          display: block;
          margin-bottom: 5px;
          color: var(--pdp-muted);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .pdp__spec-value {
          display: block;
          color: var(--pdp-text);
          font-size: 11px;
          line-height: 1.5;
        }

        .pdp__shipping-copy,
        .pdp__returns-copy {
          max-width: 680px;
          color: var(--pdp-muted);
          font-size: 12px;
          line-height: 1.9;
        }

        /* ================================================
           SHARE MODAL
        ================================================ */

        .pdp__share-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(20,17,15,0.55);
          backdrop-filter: blur(10px);
        }

        .pdp__share-panel {
          width: min(440px, 100%);
          padding: 30px;
          background: white;
          box-shadow:
            0 30px 100px
            rgba(0,0,0,0.22);
        }

        .pdp__share-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .pdp__share-eyebrow {
          margin: 0 0 7px;
          color: var(--pdp-accent);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .pdp__share-title {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 400;
        }

        .pdp__share-close {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border: 1px solid var(--pdp-border);
          border-radius: 50%;
          background: white;
        }

        .pdp__share-product {
          margin: 24px 0;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--pdp-border);
          color: var(--pdp-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .pdp__share-options {
          display: grid;
          gap: 8px;
        }

        .pdp__share-option {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 14px;
          border: 1px solid var(--pdp-border);
          background: white;
          text-align: left;
        }

        .pdp__share-option:hover {
          border-color: var(--pdp-text);
          background: var(--pdp-bg);
        }

        .pdp__share-option-icon {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          place-items: center;
          background: var(--pdp-surface-soft);
        }

        .pdp__share-option strong {
          display: block;
          font-size: 11px;
        }

        .pdp__share-option small {
          display: block;
          margin-top: 3px;
          color: var(--pdp-muted);
          font-size: 9px;
        }

        /* ================================================
           MOBILE STICKY BAR
        ================================================ */

        .pdp__sticky {
          display: none;
        }

        /* ================================================
           RESPONSIVE
        ================================================ */

        @media (max-width: 1100px) {
          .pdp__hero {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .pdp__media {
            position: relative;
            top: auto;
          }

          .pdp__media-main {
            max-width: 820px;
          }

          .pdp__info {
            max-width: 820px;
          }

          .pdp__details-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }
        }

        @media (max-width: 700px) {
          .pdp__container {
            width: min(
              100% - 28px,
              600px
            );
          }

          .pdp__breadcrumb {
            padding: 17px 0;
            font-size: 8px;
          }

          .pdp__hero {
            gap: 34px;
            padding-bottom: 60px;
          }

          .pdp__media-main {
            aspect-ratio: 0.82;
            margin-inline: -14px;
          }

          .pdp__media-thumbs {
            grid-template-columns: repeat(
              4,
              1fr
            );
          }

          .pdp__thumb:nth-child(n + 5) {
            display: none;
          }

          .pdp__title-row {
            gap: 12px;
          }

          .pdp__title {
            font-size: 42px;
          }

          .pdp__wishlist {
            width: 42px;
            height: 42px;
          }

          .pdp__description {
            font-size: 12px;
            line-height: 1.8;
          }

          .pdp__purchase-row {
            grid-template-columns: 100px 1fr;
          }

          .pdp__trust {
            grid-template-columns: 1fr 1fr;
          }

          .pdp__trust-item {
            min-height: 95px;
            padding: 12px;
          }

          .pdp__trust-title {
            font-size: 12px;
          }

          .pdp__trust-text {
            font-size: 8px;
          }

          .pdp__details {
            padding: 60px 0 90px;
          }

          .pdp__details-grid {
            gap: 36px;
          }

          .pdp__specs {
            grid-template-columns: 1fr;
          }

          .pdp__sticky {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-top: 1px solid var(--pdp-border);
            background: rgba(255,255,255,0.96);
            backdrop-filter: blur(16px);
          }

          .pdp__sticky-info {
            min-width: 0;
            flex: 1;
          }

          .pdp__sticky-name {
            overflow: hidden;
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 13px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .pdp__sticky-price {
            margin: 3px 0 0;
            color: var(--pdp-muted);
            font-size: 10px;
          }

          .pdp__sticky-button {
            min-width: 135px;
            height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: 0;
            color: white;
            background: var(--pdp-dark);
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          .pdp {
            padding-bottom: 70px;
          }
        }

        @media (max-width: 420px) {
          .pdp__title {
            font-size: 36px;
          }

          .pdp__purchase-row {
            grid-template-columns: 88px 1fr;
          }

          .pdp__quantity {
            grid-template-columns: 28px 1fr 28px;
          }

          .pdp__trust-item {
            display: block;
          }

          .pdp__trust-icon {
            display: block;
            margin-bottom: 8px;
          }

          .pdp__sticky-button {
            min-width: 120px;
          }
        }
      `}</style>

      {/* ===================================================
          BREADCRUMB
      =================================================== */}

      <div className="pdp__container">
        <nav
          className="pdp__breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link href="/">
            Home
          </Link>

          <span className="pdp__breadcrumb-separator">
            /
          </span>

          <Link href="/shop">
            Shop
          </Link>

          <span className="pdp__breadcrumb-separator">
            /
          </span>

          <span className="pdp__breadcrumb-current">
            {product.title}
          </span>
        </nav>
      </div>

      {/* ===================================================
          PRODUCT HERO
      =================================================== */}

      <section className="pdp__container pdp__hero">
        {/* =================================================
            MEDIA
        ================================================= */}

        <div className="pdp__media">
          <div className="pdp__media-main">
            {hasImages ? (
              <Image
                src={images[activeImage]}
                alt={`${product.title} - Product Image`}
                fill
                priority
                className="pdp__image"
                sizes="
                  (max-width: 700px) 100vw,
                  60vw
                "
              />
            ) : (
              <div
                className="pdp__media-placeholder"
                aria-label="Product image placeholder"
              >
                <div className="pdp__placeholder-shape" />

                <div className="pdp__placeholder-copy">
                  <p className="pdp__placeholder-eyebrow">
                    Aayesha Fashion
                  </p>

                  <p className="pdp__placeholder-title">
                    {product.title}
                  </p>
                </div>
              </div>
            )}

            {hasImages &&
              images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pdp__media-arrow pdp__media-arrow--left"
                    onClick={previousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      size={19}
                      strokeWidth={1.4}
                    />
                  </button>

                  <button
                    type="button"
                    className="pdp__media-arrow pdp__media-arrow--right"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight
                      size={19}
                      strokeWidth={1.4}
                    />
                  </button>

                  <div className="pdp__media-count">
                    {String(
                      activeImage + 1,
                    ).padStart(2, "0")}

                    <span>/</span>

                    {String(
                      images.length,
                    ).padStart(2, "0")}
                  </div>
                </>
              )}
          </div>

          {hasImages && (
            <div className="pdp__media-thumbs">
              {images.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        index,
                      )
                    }
                    className={[
                      "pdp__thumb",
                      index ===
                      activeImage
                        ? "pdp__thumb--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`View image ${
                      index + 1
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="120px"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div className="pdp__info">
          <p className="pdp__category">
            Ready-made Garara Collection
          </p>

          <div className="pdp__title-row">
            <h1 className="pdp__title">
              {product.title}
            </h1>

            <button
              type="button"
              onClick={() =>
                setWishlist(
                  (current) =>
                    !current,
                )
              }
              aria-label={
                wishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={[
                "pdp__wishlist",
                wishlist
                  ? "pdp__wishlist--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Heart
                size={20}
                strokeWidth={1.3}
                fill={
                  wishlist
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

          <p className="pdp__description">
            {product.description}
          </p>

          {/* PRICE */}

          <div className="pdp__price-block">
            <div className="pdp__price-row">
              <span className="pdp__price">
                ₹
                {actualPrice.toLocaleString(
                  "en-IN",
                )}
              </span>

              {mrp >
                actualPrice && (
                <>
                  <span className="pdp__mrp">
                    ₹
                    {mrp.toLocaleString(
                      "en-IN",
                    )}
                  </span>

                  <span className="pdp__discount">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="pdp__tax">
              Inclusive of applicable taxes
            </p>
          </div>

          {/* PURCHASE */}

          <div className="pdp__purchase">
            <div className="pdp__purchase-label-row">
              <p className="pdp__purchase-label">
                Quantity
              </p>

              <p className="pdp__stock">
                {stock > 0
                  ? `${stock} available`
                  : "Sold out"}
              </p>
            </div>

            <div className="pdp__purchase-row">
              <div
                className="pdp__quantity"
                aria-label="Product quantity"
              >
                <button
                  type="button"
                  disabled={
                    quantity <= 1
                  }
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current -
                            1,
                        ),
                    )
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus
                    size={14}
                    strokeWidth={1.4}
                  />
                </button>

                <span className="pdp__quantity-value">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    quantity >=
                    stock
                  }
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.min(
                          stock,
                          current +
                            1,
                        ),
                    )
                  }
                  aria-label="Increase quantity"
                >
                  <Plus
                    size={14}
                    strokeWidth={1.4}
                  />
                </button>
              </div>

              <button
                type="button"
                className="pdp__add"
                onClick={
                  handleAddToBag
                }
                disabled={
                  stock <= 0
                }
              >
                <ShoppingBag
                  size={17}
                  strokeWidth={1.5}
                />

                {stock > 0
                  ? "Add to Bag"
                  : "Sold Out"}
              </button>
            </div>

            <button
              type="button"
              className="pdp__buy"
              onClick={handleBuyNow}
              disabled={
                stock <= 0
              }
            >
              Buy Now
            </button>

            <div className="pdp__actions">
              <button
                type="button"
                className="pdp__share"
                onClick={handleShare}
              >
                <Share2
                  size={15}
                  strokeWidth={1.4}
                />

                Share this piece
              </button>
            </div>
          </div>

          {/* DELIVERY */}

          <div className="pdp__delivery">
            <div className="pdp__delivery-head">
              <span className="pdp__delivery-icon">
                <MapPin
                  size={17}
                  strokeWidth={1.4}
                />
              </span>

              <div>
                <p className="pdp__delivery-title">
                  Check delivery
                </p>

                <p className="pdp__delivery-copy">
                  Enter your pincode
                  for delivery
                  availability.
                </p>
              </div>
            </div>

            <div className="pdp__delivery-form">
              <input
                value={pincode}
                onChange={(event) => {
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
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    checkDelivery();
                  }
                }}
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit pincode"
                className="pdp__delivery-input"
                aria-label="Delivery pincode"
              />

              <button
                type="button"
                className="pdp__delivery-button"
                onClick={
                  checkDelivery
                }
              >
                Check
              </button>
            </div>

            {deliveryChecked && (
              <div
                className="pdp__delivery-result"
                role="status"
              >
                <Check
                  size={16}
                  strokeWidth={1.6}
                />

                <span>
                  Delivery available.
                  Estimated delivery
                  within 3–7 business
                  days.
                </span>
              </div>
            )}
          </div>

          {/* TRUST */}

          <div className="pdp__trust">
            <div className="pdp__trust-item">
              <Truck
                className="pdp__trust-icon"
                size={18}
                strokeWidth={1.4}
              />

              <div>
                <p className="pdp__trust-title">
                  Reliable Delivery
                </p>

                <p className="pdp__trust-text">
                  Secure delivery
                  across India
                </p>
              </div>
            </div>

            <div className="pdp__trust-item">
              <RotateCcw
                className="pdp__trust-icon"
                size={18}
                strokeWidth={1.4}
              />

              <div>
                <p className="pdp__trust-title">
                  Easy Exchange
                </p>

                <p className="pdp__trust-text">
                  Simple support
                  for eligible
                  orders
                </p>
              </div>
            </div>

            <div className="pdp__trust-item">
              <ShieldCheck
                className="pdp__trust-icon"
                size={18}
                strokeWidth={1.4}
              />

              <div>
                <p className="pdp__trust-title">
                  Secure Shopping
                </p>

                <p className="pdp__trust-text">
                  Protected
                  checkout
                  experience
                </p>
              </div>
            </div>

            <div className="pdp__trust-item">
              <Sparkles
                className="pdp__trust-icon"
                size={18}
                strokeWidth={1.4}
              />

              <div>
                <p className="pdp__trust-title">
                  Curated Quality
                </p>

                <p className="pdp__trust-text">
                  Thoughtfully
                  selected
                  designs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          DETAILS
      =================================================== */}

      <section className="pdp__details">
        <div className="pdp__container">
          <div className="pdp__details-grid">
            <div>
              <p className="pdp__details-eyebrow">
                The Details
              </p>

              <h2 className="pdp__details-title">
                Crafted for
                occasions.
              </h2>

              <p className="pdp__details-intro">
                {productContent.intro ||
                  product.description}
              </p>
            </div>

            <div className="pdp__accordions">
              {/* PRODUCT DETAILS */}

              <div className="pdp__accordion">
                <button
                  type="button"
                  className="pdp__accordion-button"
                  onClick={() =>
                    toggleAccordion(
                      "Product Details",
                    )
                  }
                  aria-expanded={
                    openAccordion ===
                    "Product Details"
                  }
                >
                  <span className="pdp__accordion-title">
                    Product Details
                  </span>

                  <ChevronDown
                    size={18}
                    strokeWidth={1.4}
                    style={{
                      transform:
                        openAccordion ===
                        "Product Details"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  />
                </button>

                {openAccordion ===
                  "Product Details" && (
                  <div className="pdp__accordion-content">
                    <div className="pdp__specs">
                      {specificationRows.map(
                        (
                          specification,
                          index,
                        ) => (
                          <div
                            key={`${specification.label}-${index}`}
                            className="pdp__spec"
                          >
                            {specification.label && (
                              <span className="pdp__spec-label">
                                {
                                  specification.label
                                }
                              </span>
                            )}

                            <span className="pdp__spec-value">
                              {
                                specification.value
                              }
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SHIPPING */}

              <div className="pdp__accordion">
                <button
                  type="button"
                  className="pdp__accordion-button"
                  onClick={() =>
                    toggleAccordion(
                      "Shipping & Delivery",
                    )
                  }
                  aria-expanded={
                    openAccordion ===
                    "Shipping & Delivery"
                  }
                >
                  <span className="pdp__accordion-title">
                    Shipping &
                    Delivery
                  </span>

                  <ChevronDown
                    size={18}
                    strokeWidth={1.4}
                    style={{
                      transform:
                        openAccordion ===
                        "Shipping & Delivery"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  />
                </button>

                {openAccordion ===
                  "Shipping & Delivery" && (
                  <div className="pdp__accordion-content">
                    <p className="pdp__shipping-copy">
                      Delivery details
                      are available
                      through the
                      pincode checker
                      above. For
                      product-specific
                      delivery
                      assistance,
                      please contact
                      Aayesha Fashion
                      through the
                      available support
                      channel.
                    </p>
                  </div>
                )}
              </div>

              {/* RETURNS */}

              <div className="pdp__accordion">
                <button
                  type="button"
                  className="pdp__accordion-button"
                  onClick={() =>
                    toggleAccordion(
                      "Returns & Exchange",
                    )
                  }
                  aria-expanded={
                    openAccordion ===
                    "Returns & Exchange"
                  }
                >
                  <span className="pdp__accordion-title">
                    Returns &
                    Exchange
                  </span>

                  <ChevronDown
                    size={18}
                    strokeWidth={1.4}
                    style={{
                      transform:
                        openAccordion ===
                        "Returns & Exchange"
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition:
                        "transform 180ms ease",
                    }}
                  />
                </button>

                {openAccordion ===
                  "Returns & Exchange" && (
                  <div className="pdp__accordion-content">
                    <p className="pdp__returns-copy">
                      Exchange and
                      return support
                      is available for
                      eligible orders.
                      Please contact
                      Aayesha Fashion
                      for assistance
                      regarding your
                      order.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SHARE MODAL
      =================================================== */}

      {shareOpen && (
        <div
          className="pdp__share-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Share product"
          onClick={() =>
            setShareOpen(false)
          }
        >
          <div
            className="pdp__share-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="pdp__share-head">
              <div>
                <p className="pdp__share-eyebrow">
                  AAYESHA FASHION
                </p>

                <h2 className="pdp__share-title">
                  Share this piece
                </h2>
              </div>

              <button
                type="button"
                className="pdp__share-close"
                onClick={() =>
                  setShareOpen(
                    false,
                  )
                }
                aria-label="Close"
              >
                <X
                  size={17}
                  strokeWidth={1.4}
                />
              </button>
            </div>

            <p className="pdp__share-product">
              {product.title}
            </p>

            <div className="pdp__share-options">
              <button
                type="button"
                className="pdp__share-option"
                onClick={
                  copyLink
                }
              >
                <span className="pdp__share-option-icon">
                  {copied ? (
                    <Check
                      size={17}
                    />
                  ) : (
                    <Copy
                      size={17}
                    />
                  )}
                </span>

                <span>
                  <strong>
                    {copied
                      ? "Copied"
                      : "Copy link"}
                  </strong>

                  <small>
                    {copied
                      ? "Product link copied"
                      : "Save the product link"}
                  </small>
                </span>
              </button>

              <button
                type="button"
                className="pdp__share-option"
                onClick={
                  shareWhatsApp
                }
              >
                <span className="pdp__share-option-icon">
                  <Share2
                    size={17}
                  />
                </span>

                <span>
                  <strong>
                    WhatsApp
                  </strong>

                  <small>
                    Send this piece
                    to someone
                  </small>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MOBILE STICKY BUY BAR
      =================================================== */}

      <div className="pdp__sticky">
        <div className="pdp__sticky-info">
          <p className="pdp__sticky-name">
            {product.title}
          </p>

          <p className="pdp__sticky-price">
            ₹
            {actualPrice.toLocaleString(
              "en-IN",
            )}
          </p>
        </div>

        <button
          type="button"
          className="pdp__sticky-button"
          onClick={
            handleAddToBag
          }
          disabled={
            stock <= 0
          }
        >
          <ShoppingBag
            size={16}
            strokeWidth={1.5}
          />

          {stock > 0
            ? "Add to Bag"
            : "Sold Out"}
        </button>
      </div>
    </main>
  );
}