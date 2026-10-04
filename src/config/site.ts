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

  contact: {
    email: "",
    phone: "918788158087",
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
    whatsapp: `https://wa.me/918788158087`,
  },
} as const;