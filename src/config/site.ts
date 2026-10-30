/** Client WhatsApp / contact number (India, 91 + 10 digits). */
const CLIENT_WHATSAPP_NUMBER = "918237423742";

/**
 * WhatsApp number that receives the full details of every new order (the WhatsApp message
 * is prepared when the customer places the order). It is the client's own number; it can be
 * overridden with NEXT_PUBLIC_ORDER_WHATSAPP_NUMBER (91 + 10 digits).
 */
const ORDER_WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_ORDER_WHATSAPP_NUMBER ?? "").replace(/\D/g, "") ||
  CLIENT_WHATSAPP_NUMBER;

export const siteConfig = {
  name: "Aayesha Fashion",

  description:
    "Discover timeless fashion designed for elegance, confidence, and everyday beauty.",

  /*
   * Public address of the live store. Set NEXT_PUBLIC_SITE_URL once the real domain is
   * attached; until then canonical / sitemap / Open Graph URLs use the default below.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://aayeshafashion.in"
  ).replace(/\/+$/, ""),

  /*
   * Search engines are told to stay away unless NEXT_PUBLIC_ALLOW_INDEXING=true is set on the
   * production deployment. Preview / staging / default *.vercel.app deployments therefore
   * can never be indexed by accident. Flip it on at go-live.
   */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  locale: "en_IN",

  currency: "INR",

  currencySymbol: "₹",

  /*
   * Online (Razorpay) payments stay off unless explicitly enabled; the
   * store currently takes payment through the WhatsApp bill (UPI /
   * bank transfer).
   */
  features: {
    onlinePayment:
      process.env.NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT === "true",

    /* Cash on Delivery is off: payment is by the WhatsApp bill. */
    cashOnDelivery:
      process.env.NEXT_PUBLIC_ENABLE_COD === "true",
  },

  /** Receives the details of every new order on WhatsApp. */
  orderWhatsapp: {
    number: ORDER_WHATSAPP_NUMBER,
  },

  contact: {
    email: "",
    phone: CLIENT_WHATSAPP_NUMBER,
  },

  /*
   * Social profiles. Each one appears as an icon in the footer as soon
   * as it has a URL — set it here, or through the matching
   * NEXT_PUBLIC_*_URL environment variable. Empty ones are skipped.
   */
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
    whatsapp: `https://wa.me/${CLIENT_WHATSAPP_NUMBER}`,
  },
} as const;