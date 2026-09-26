"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Product } from "@/types/product";
import { addToCart } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { LoginRequiredPopup } from "@/components/product/login-required-popup";

import "./ProductDetail.css";

interface ProductDetailProps {
  product: Product;
  recommendations?: Product[];
}

const money = (value = 0) => `₹${value.toLocaleString("en-IN")}`;

function stockOf(product: Product) {
  return Math.max(
    0,
    (product.inventory?.stock ?? 0) -
      (product.inventory?.reserved ?? 0),
  );
}

function discountOf(product: Product) {
  const mrp = product.pricing?.mrp ?? 0;
  const price = product.pricing?.sellingPrice ?? 0;
  return mrp > price && mrp > 0
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;
}

function mediaOf(product: Product) {
  return [...(product.media ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

function detailsOf(product: Product) {
  const source = product.content?.description ?? "";
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^[-*]?\s*\**([^:*]+?)\**\s*:\s*\**(.+?)\**$/,
      );
      return match
        ? {
            label: match[1].replace(/\*\*/g, "").trim(),
            value: match[2].replace(/\*\*/g, "").trim(),
          }
        : null;
    })
    .filter(
      (
        item,
      ): item is { label: string; value: string } =>
        Boolean(item),
    );
}

export function ProductDetail({
  product,
  recommendations = [],
}: ProductDetailProps) {
  const media = mediaOf(product);
  const stock = stockOf(product);
  const discount = discountOf(product);
  const details = useMemo(
    () => detailsOf(product),
    [product],
  );

  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [login, setLogin] = useState(false);
  const [share, setShare] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [returnsOpen, setReturnsOpen] = useState(false);

  const authenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const initialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const wishlistIds = useWishlistStore(
    (state) => state.productIds,
  );
  const toggleWishlist = useWishlistStore(
    (state) => state.toggle,
  );

  const productId = product._id || product.id;
  const wishlisted = wishlistIds.includes(productId);
  const available = product.status === "active" && stock > 0;
  const currentMedia = media[active];

  const requireAuth = () => {
    if (!initialized) return false;
    if (!authenticated) {
      setLogin(true);
      return false;
    }
    return true;
  };

  const add = async () => {
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
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add this product to your bag.",
      );
    } finally {
      setAdding(false);
    }
  };

  const buy = async () => {
    if (!available) {
      toast.error("This product is currently unavailable.");
      return;
    }
    if (adding || buying || !requireAuth()) return;

    try {
      setBuying(true);
      await addToCart(productId, quantity);
      window.location.href = "/cart";
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to continue to checkout.",
      );
      setBuying(false);
    }
  };

  const wishlist = () => {
    if (!requireAuth()) return;
    toggleWishlist(productId);
    toast.success(
      wishlisted
        ? "Removed from wishlist."
        : "Added to wishlist.",
    );
  };

  const shareProduct = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "";
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Take a look at ${product.name} from Aayesha Fashion.`,
          url,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied.");
    } catch {
      toast.error("Unable to copy the product link.");
    }
  };

  const previous = () =>
    setActive((value) =>
      value <= 0 ? Math.max(media.length - 1, 0) : value - 1,
    );

  const next = () =>
    setActive((value) =>
      value >= media.length - 1 ? 0 : value + 1,
    );

  return (
    <>
      <main className="min-h-screen bg-[#f8f5f2] pb-20 text-[#352826]">
        <div className="border-b border-[#352826]/10">
          <div className="mx-auto max-w-[1500px] px-4 py-4 text-[9px] uppercase tracking-[.2em] text-[#806d67] sm:px-6 lg:px-10">
            <Link href="/">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop">Shop</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>
        </div>

        <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
            <div className="grid grid-cols-[72px_1fr] gap-3 sm:grid-cols-[90px_1fr]">
              <div className="flex max-h-[760px] flex-col gap-3 overflow-auto">
                {media.map((item, index) => (
                  <button
                    key={item.id || `${item.src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`relative aspect-[.78] overflow-hidden bg-[#e9dfda] ${
                      index === active
                        ? "ring-1 ring-[#352826] ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.thumbnail || item.src}
                        alt={item.alt || product.name}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative aspect-[.78] overflow-hidden bg-[#e9dfda]">
                {currentMedia?.type === "video" ? (
                  <video
                    src={currentMedia.src}
                    poster={currentMedia.poster}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : currentMedia ? (
                  <Image
                    src={currentMedia.src}
                    alt={currentMedia.alt || product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-[.18em]">
                    Image unavailable
                  </div>
                )}

                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previous}
                      aria-label="Previous product image"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next product image"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-[#352826]/80 px-3 py-2 text-[8px] tracking-[.18em] text-white">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(Math.max(media.length, 1)).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#352826]" />
                    <p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#806d67]">
                      Aayesha Fashion
                    </p>
                  </div>

                  <h1 className="max-w-[650px] font-serif text-[clamp(2.2rem,4.5vw,4.7rem)] leading-[.94] tracking-[-.045em]">
                    {product.name}
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={wishlist}
                  disabled={!initialized}
                  aria-label="Toggle wishlist"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#352826]/15"
                >
                  <Heart
                    size={19}
                    strokeWidth={1.3}
                    fill={
                      wishlisted ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>

              <p className="mt-6 max-w-xl text-[13px] leading-7 text-[#6d5b56] sm:text-sm">
                {product.content?.description ||
                  "A thoughtfully crafted piece from the Aayesha Fashion collection."}
              </p>

              <div className="mt-8 border-y border-[#352826]/10 py-6">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="font-serif text-3xl sm:text-4xl">
                    {money(product.pricing?.sellingPrice)}
                  </span>
                  {product.pricing?.mrp >
                    product.pricing?.sellingPrice && (
                    <span className="text-sm text-[#9a8983] line-through">
                      {money(product.pricing.mrp)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-[#352826] px-2 py-1 text-[8px] font-bold uppercase tracking-[.14em] text-white">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-[.14em] text-[#8a7872]">
                  Inclusive of applicable taxes
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-b border-[#352826]/10 pb-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#806d67]">
                    Availability
                  </p>
                  <p className="mt-2 text-sm">
                    {stock <= 0
                      ? "Currently sold out"
                      : stock <=
                          (product.inventory?.lowStockThreshold ?? 2)
                        ? `Only ${stock} left in stock`
                        : "In stock · Ready to ship"}
                  </p>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    stock > 0 ? "bg-[#53694f]" : "bg-[#9b6a62]"
                  }`}
                />
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[.18em] text-[#806d67]">
                    Quantity
                  </span>
                  <button
                    type="button"
                    onClick={() => setShare(true)}
                    className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.17em]"
                  >
                    <Share2 size={15} />
                    Share
                  </button>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-14 border border-[#352826]/15 bg-white/50">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) =>
                          Math.max(1, value - 1),
                        )
                      }
                      disabled={quantity <= 1 || adding || buying}
                      className="w-12 disabled:opacity-30"
                    >
                      <Minus size={15} className="mx-auto" />
                    </button>
                    <span className="flex w-8 items-center justify-center text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((value) =>
                          Math.min(Math.max(stock, 1), value + 1),
                        )
                      }
                      disabled={
                        !available ||
                        quantity >= stock ||
                        adding ||
                        buying
                      }
                      className="w-12 disabled:opacity-30"
                    >
                      <Plus size={15} className="mx-auto" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => void add()}
                    disabled={
                      !available ||
                      adding ||
                      buying ||
                      !initialized
                    }
                    className="flex h-14 flex-1 items-center justify-center gap-3 bg-[#352826] text-[9px] font-bold uppercase tracking-[.2em] text-white disabled:opacity-50"
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
                  onClick={() => void buy()}
                  disabled={
                    !available ||
                    adding ||
                    buying ||
                    !initialized
                  }
                  className="mt-3 h-14 w-full border border-[#352826] text-[9px] font-bold uppercase tracking-[.2em] hover:bg-[#352826] hover:text-white disabled:opacity-40"
                >
                  {buying ? "Processing..." : "Buy Now"}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 border-y border-[#352826]/10">
                {[
                  [Truck, "Delivery", "Secure delivery across India"],
                  [RotateCcw, "Exchange", "Support for eligible orders"],
                  [ShieldCheck, "Secure", "Protected checkout"],
                  [Sparkles, "Quality", "Thoughtfully selected designs"],
                ].map(([Icon, title, text], index) => {
                  const ItemIcon = Icon as typeof Truck;
                  return (
                    <div
                      key={String(title)}
                      className={`flex gap-3 p-4 sm:p-5 ${
                        index < 2
                          ? "border-b border-[#352826]/10"
                          : ""
                      } ${index % 2 === 0 ? "border-r border-[#352826]/10" : ""}`}
                    >
                      <ItemIcon size={17} className="shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[.13em]">
                          {String(title)}
                        </p>
                        <p className="mt-1 text-[10px] leading-5 text-[#806d67]">
                          {String(text)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#352826]/10 bg-[#eee6e1]">
          <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#806d67]">
                  The Details
                </p>
                <h2 className="mt-4 max-w-md font-serif text-4xl leading-[.98] tracking-[-.035em] sm:text-6xl">
                  Designed to be remembered.
                </h2>
              </div>

              <div>
                <p className="max-w-3xl text-[13px] leading-8 text-[#604f4a] sm:text-[15px]">
                  {product.content?.description ||
                    "Every detail of this piece is presented with the craftsmanship and occasion in mind."}
                </p>

                {details.length > 0 && (
                  <div className="mt-10 border-t border-[#352826]/15">
                    {details.map((item) => (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="grid grid-cols-[.65fr_1.35fr] gap-5 border-b border-[#352826]/10 py-4 text-[11px] sm:text-xs"
                      >
                        <span className="font-semibold uppercase tracking-[.12em] text-[#806d67]">
                          {item.label}
                        </span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 sm:py-20">
          {[
            ["Product Details", detailsOpen, setDetailsOpen, product.content?.description || "Product details are currently unavailable."],
            ["Shipping & Delivery", shippingOpen, setShippingOpen, "Secure delivery across India. Delivery updates are provided during checkout."],
            ["Returns & Exchange", returnsOpen, setReturnsOpen, "Exchange and return support is available for eligible orders according to the applicable order policy."],
          ].map(([title, open, setOpen, text]) => (
            <div key={String(title)} className="border-t border-[#352826]/15">
              <button
                type="button"
                onClick={() =>
                  (setOpen as React.Dispatch<React.SetStateAction<boolean>>)(
                    !Boolean(open),
                  )
                }
                className="flex w-full items-center justify-between border-b border-[#352826]/15 py-6 text-left"
              >
                <span className="text-[10px] font-bold uppercase tracking-[.2em]">
                  {String(title)}
                </span>
                {Boolean(open) ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>
              {Boolean(open) && (
                <div className="border-b border-[#352826]/15 py-6 text-[12px] leading-7 text-[#6d5b56]">
                  {String(text)}
                </div>
              )}
            </div>
          ))}
        </section>

        {recommendations.length > 0 && (
          <section className="border-t border-[#352826]/10 bg-[#f1ebe7]">
            <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-10">
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#806d67]">
                Curated for you
              </p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                You may also like.
              </h2>

              <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {recommendations.slice(0, 4).map((item) => {
                  const image = mediaOf(item).find(
                    (m) => m.type === "image",
                  );

                  return (
                    <Link
                      key={item.id || item._id}
                      href={`/products/${item._id || item.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[.78] overflow-hidden bg-[#e5dcd7]">
                        {image && (
                          <Image
                            src={image.src}
                            alt={image.alt || item.name}
                            fill
                            sizes="25vw"
                            className="object-cover transition duration-700 group-hover:scale-[1.035]"
                          />
                        )}
                      </div>
                      <p className="mt-4 line-clamp-2 text-[11px] leading-5">
                        {item.name}
                      </p>
                      <p className="mt-2 text-xs">
                        {money(item.pricing?.sellingPrice)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {share && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setShare(false)}
        >
          <div
            className="w-full max-w-md bg-[#f8f5f2] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.2em]">
                  Aayesha Fashion
                </p>
                <h3 className="mt-2 font-serif text-3xl">
                  Share this piece
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShare(false)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-6 text-xs leading-6 text-[#6d5b56]">
              {product.name}
            </p>

            <button
              type="button"
              onClick={() => void shareProduct()}
              className="mt-6 flex w-full items-center justify-center gap-3 bg-[#352826] px-5 py-4 text-[9px] font-bold uppercase tracking-[.2em] text-white"
            >
              <Share2 size={17} />
              Share / Copy Product Link
            </button>
          </div>
        </div>
      )}

      <LoginRequiredPopup
        open={login}
        onClose={() => setLogin(false)}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#352826]/10 bg-[#f8f5f2]/95 p-3 shadow-[0_-8px_30px_rgba(53,40,38,.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px]">{product.name}</p>
            <p className="mt-1 text-sm font-semibold">
              {money(product.pricing?.sellingPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void add()}
            disabled={!available || adding || buying || !initialized}
            className="flex h-12 items-center gap-2 bg-[#352826] px-5 text-[8px] font-bold uppercase tracking-[.16em] text-white disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            {adding ? "Adding" : available ? "Add to Bag" : "Sold Out"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
