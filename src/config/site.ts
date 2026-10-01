export const siteConfig = {
  name: "Aayesha Fashion",

  description:
    "Discover timeless fashion designed for elegance, confidence, and everyday beauty.",

  url: "https://aayeshafashion.in",

  locale: "en_IN",

  currency: "INR",

  currencySymbol: "₹",

  /*
   * Online (Razorpay) payments stay off unless explicitly enabled; the
   * store currently takes payment through the WhatsApp bill (UPI /
   * bank transfer) or Cash on Delivery.
   */
  features: {
    onlinePayment:
      process.env.NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT === "true",
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