"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  Share2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import "./ProductShare.css";

interface ProductShareProps {
  productName: string;
  productUrl?: string;
}

export function ProductShare({
  productName,
  productUrl,
}: ProductShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (productUrl) {
      return productUrl;
    }

    if (typeof window !== "undefined") {
      return window.location.href;
    }

    return "";
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();

    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Take a look at ${productName} from Aayesha Fashion.`,
          url,
        });
      } catch (error) {
        if ((error as DOMException)?.name !== "AbortError") {
          toast.error("Unable to open sharing options.");
        }
      }

      return;
    }

    await handleCopy();
  };

  const handleCopy = async () => {
    const url = getShareUrl();

    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);
      toast.success("Product link copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Unable to copy the product link.");
    }
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();

    if (!url) return;

    const message = `Take a look at ${productName} from Aayesha Fashion.\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleFacebook = () => {
    const url = getShareUrl();

    if (!url) return;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleX = () => {
    const url = getShareUrl();

    if (!url) return;

    const text = `Take a look at ${productName} from Aayesha Fashion.`;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="product-share">
      <button
        type="button"
        className="product-share__trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Share2 size={17} strokeWidth={1.5} />
        <span>Share</span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="product-share__backdrop"
            aria-label="Close sharing options"
            onClick={() => setOpen(false)}
          />

          <div
            className="product-share__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Share product"
          >
            <div className="product-share__header">
              <div>
                <span className="product-share__eyebrow">
                  AAYESHA
                </span>

                <h3>Share this piece</h3>
              </div>

              <button
                type="button"
                className="product-share__close"
                onClick={() => setOpen(false)}
                aria-label="Close sharing options"
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </div>

            <p className="product-share__product">
              {productName}
            </p>

            <div className="product-share__options">
              <button
                type="button"
                className="product-share__option"
                onClick={handleNativeShare}
              >
                <span className="product-share__option-icon">
                  <Share2 size={18} strokeWidth={1.5} />
                </span>

                <span>
                  <strong>Share</strong>
                  <small>More options</small>
                </span>
              </button>

              <button
                type="button"
                className="product-share__option"
                onClick={handleWhatsApp}
              >
                <span className="product-share__option-icon">
                  <span className="product-share__whatsapp">W</span>
                </span>

                <span>
                  <strong>WhatsApp</strong>
                  <small>Send to someone</small>
                </span>
              </button>

              <button
                type="button"
                className="product-share__option"
                onClick={handleCopy}
              >
                <span className="product-share__option-icon">
                  {copied ? (
                    <Check size={18} strokeWidth={1.5} />
                  ) : (
                    <Copy size={18} strokeWidth={1.5} />
                  )}
                </span>

                <span>
                  <strong>{copied ? "Copied" : "Copy link"}</strong>
                  <small>
                    {copied ? "Link copied" : "Save the product link"}
                  </small>
                </span>
              </button>

              <button
                type="button"
                className="product-share__option"
                onClick={handleFacebook}
              >
                <span className="product-share__option-icon">
                  <Facebook size={18} strokeWidth={1.5} />
                </span>

                <span>
                  <strong>Facebook</strong>
                  <small>Share with friends</small>
                </span>
              </button>

              <button
                type="button"
                className="product-share__option"
                onClick={handleX}
              >
                <span className="product-share__option-icon">
                  <X size={18} strokeWidth={1.5} />
                </span>

                <span>
                  <strong>X</strong>
                  <small>Share on X</small>
                </span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}