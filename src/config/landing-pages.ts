import type { ProductSort } from "@/types/product";

/* =========================================================
   SEO LANDING PAGES  →  /shop/<slug>

   Each page targets a real shopping search ("sharara sets
   online", "ethnic wear under 3000"...). Products come live
   from the catalogue using `query`; if a page has no matching
   products it is automatically set to noindex and left out of
   the sitemap, so thin pages never reach Google.

   Copy states only what the store actually offers.
========================================================= */

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingPage {
  slug: string;
  /** Visible H1 */
  title: string;
  eyebrow: string;
  /** <title> without the brand suffix */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  /** "Why shop with us" bullets */
  highlights: string[];
  /** Styling / buying guidance, one block per heading */
  guide: Array<{ heading: string; body: string }>;
  faqs: LandingFaq[];
  related: string[];
  /** Linked from the footer */
  featured?: boolean;
  query: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    sort?: ProductSort;
  };
}

/** Facts reused across pages (keep in sync with the policy pages). */
const COMMON_FAQS = (what: string): LandingFaq[] => [
  {
    question: "How do I pay?",
    answer:
      "After you place your order we send the bill, with a UPI QR code, straight to your WhatsApp. Pay by UPI or bank transfer within 30 minutes to confirm the order.",
  },
  {
    question: "Is shipping free?",
    answer: `Standard shipping is free on orders above ₹2,999. We deliver ${what} across India.`,
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "Returns and exchanges are available on eligible orders as described on our Returns & Exchange page.",
  },
];

export const landingPages: LandingPage[] = [
  /* ------------------------------ STYLES ------------------------------ */
  {
    slug: "sharara-sets-online",
    title: "Sharara Sets Online",
    eyebrow: "Sharara Edit",
    metaTitle: "Sharara Sets for Women Online",
    metaDescription:
      "Shop elegant sharara sets for weddings, festivals and celebrations. Hand finished Indian womenswear with free shipping above ₹2,999.",
    keywords: ["sharara set online", "sharara suit for women", "festive sharara", "wedding sharara"],
    intro: [
      "A sharara set is the easiest way to look festive without feeling weighed down. The flared, flowing legs move beautifully, and paired with a fitted kurta and a light dupatta the whole look feels graceful and effortless.",
      "Browse the Aayesha Fashion sharara edit below: contemporary Indian silhouettes, finished by hand, for weddings, Eid, Diwali and every celebration in between.",
    ],
    highlights: [
      "Flared silhouettes designed to move comfortably",
      "Pairs with a kurta and dupatta as a complete set",
      "Pay by UPI or bank transfer with a bill on WhatsApp",
    ],
    guide: [
      {
        heading: "How to choose a sharara set",
        body: "Start with the occasion. Softer fabrics and lighter embroidery suit daytime events, while richer work and deeper tones feel right in the evening. Check the length of the kurta against your height, and choose a dupatta you are comfortable carrying for several hours.",
      },
      {
        heading: "Styling ideas",
        body: "Keep jewellery balanced: statement earrings with a simple neckline, or a layered necklace with a plain kurta. Block heels or embellished juttis both work, and a sleek bun lets the neckline and dupatta take centre stage.",
      },
    ],
    faqs: [
      {
        question: "What should I wear with a sharara set?",
        answer:
          "A sharara set comes styled as a kurta, sharara and dupatta. Add earrings or a necklace that suits the neckline, and heels or juttis to finish the look.",
      },
      ...COMMON_FAQS("sharara sets"),
    ],
    related: ["garara-suits-online", "festive-wear-for-women", "wedding-guest-outfits"],
    featured: true,
    query: { search: "sharara" },
  },
  {
    slug: "garara-suits-online",
    title: "Garara Suits Online",
    eyebrow: "Garara Edit",
    metaTitle: "Garara Suits for Women Online",
    metaDescription:
      "Explore garara suits with graceful flare and fine finishing, made for weddings and festive days. Free shipping above ₹2,999.",
    keywords: ["garara suit online", "garara set for wedding", "gharara dress women"],
    intro: [
      "The garara is a classic for a reason: a fitted upper leg that opens into a generous flare gives a regal, old-world feel that still looks right today.",
      "Our garara suits are designed for celebrations. Browse the collection below and find a set that suits your occasion.",
    ],
    highlights: [
      "Traditional flare with a contemporary finish",
      "Complete suit with kurta and dupatta",
      "Delivered across India with easy returns on eligible orders",
    ],
    guide: [
      {
        heading: "Garara vs sharara",
        body: "A garara is fitted to the knee and flares from there, often with gathered detailing at the seam. A sharara flares from the hip. If you want a more structured, traditional look, choose a garara; for a lighter, flowing feel, choose a sharara.",
      },
      {
        heading: "Care tips",
        body: "Follow the care label on your garara suit. Store embroidered pieces folded in a breathable cover, and steam rather than press directly over embellishments.",
      },
    ],
    faqs: [
      {
        question: "Is a garara comfortable to wear all day?",
        answer:
          "Garara suits are designed with a flared leg for ease of movement. Choose a lighter fabric if you will be wearing it through a long day.",
      },
      ...COMMON_FAQS("garara suits"),
    ],
    related: ["sharara-sets-online", "lehenga-sets-online", "festive-wear-for-women"],
    featured: true,
    query: { search: "garara" },
  },
  {
    slug: "lehenga-sets-online",
    title: "Lehenga Sets Online",
    eyebrow: "Lehenga Edit",
    metaTitle: "Lehenga Sets for Women Online",
    metaDescription:
      "Shop lehenga sets for weddings, engagements and festive evenings. Elegant Indian womenswear from Aayesha Fashion with free shipping above ₹2,999.",
    keywords: ["lehenga online", "lehenga set for women", "wedding lehenga", "festive lehenga"],
    intro: [
      "A lehenga is the outfit people remember. Browse our lehenga sets below, designed for the moments that call for something special.",
      "Every piece is presented with clear photos and pricing so you can decide with confidence.",
    ],
    highlights: [
      "Occasion-ready lehenga sets",
      "Clear product details and photos",
      "Simple payment: UPI bill sent on WhatsApp",
    ],
    guide: [
      {
        heading: "Choosing your lehenga",
        body: "Think about how long you will wear it and how much you plan to move. Lighter flare and softer fabrics are easier for dancing and long events; heavier work looks striking for ceremonies and photographs.",
      },
      {
        heading: "Completing the look",
        body: "Match the metal tone of your jewellery to the embroidery, keep makeup balanced with the colour of the outfit, and try on your footwear with the lehenga length in mind.",
      },
    ],
    faqs: [
      {
        question: "Does a lehenga set include a dupatta?",
        answer:
          "Each product page lists what is included in the set. Please check the details on the product you are interested in.",
      },
      ...COMMON_FAQS("lehenga sets"),
    ],
    related: ["wedding-guest-outfits", "festive-wear-for-women", "gowns-for-women-online"],
    featured: true,
    query: { search: "leh" },
  },
  {
    slug: "gowns-for-women-online",
    title: "Gowns for Women Online",
    eyebrow: "Gown Edit",
    metaTitle: "Indo-Western & Ethnic Gowns for Women",
    metaDescription:
      "Discover graceful gowns for parties, receptions and festive evenings. Contemporary Indian womenswear with free shipping above ₹2,999.",
    keywords: ["gown for women online", "ethnic gown", "party wear gown", "reception gown"],
    intro: [
      "Gowns give you drama in a single piece: no layering to plan, just one confident silhouette. Our gown edit blends Indian craft with a contemporary line.",
    ],
    highlights: [
      "One-piece elegance for evenings and receptions",
      "Contemporary silhouettes with Indian finishing",
      "Free shipping above ₹2,999",
    ],
    guide: [
      {
        heading: "Finding the right fit",
        body: "Check the product page for size details and compare against a gown you already own. If you are between sizes, consider the occasion: a slightly relaxed fit is easier for dining and dancing.",
      },
    ],
    faqs: COMMON_FAQS("gowns"),
    related: ["party-wear-ethnic-suits", "festive-wear-for-women", "frock-suits-online"],
    query: { search: "gown" },
  },
  {
    slug: "frock-suits-online",
    title: "Frock Suits Online",
    eyebrow: "Frock Suit Edit",
    metaTitle: "Frock Suits for Women Online",
    metaDescription:
      "Shop flowing frock suits that combine comfort with festive charm. Aayesha Fashion: free shipping above ₹2,999.",
    keywords: ["frock suit online", "anarkali frock suit", "long frock kurti set"],
    intro: [
      "A frock suit gives you the swing of an anarkali with an easy, wearable shape. It is a favourite for festivals, family functions and dinners.",
    ],
    highlights: [
      "Easy flowing shape",
      "Complete sets styled for celebrations",
      "Simple returns on eligible orders",
    ],
    guide: [
      {
        heading: "When to wear a frock suit",
        body: "From Eid lunches to wedding sangeets, a frock suit works wherever you want to look dressed up but stay comfortable. Pair it with churidar or straight pants depending on the set.",
      },
    ],
    faqs: COMMON_FAQS("frock suits"),
    related: ["palazzo-suits-online", "festive-wear-for-women", "gowns-for-women-online"],
    query: { search: "frock" },
  },
  {
    slug: "palazzo-suits-online",
    title: "Palazzo Suits Online",
    eyebrow: "Palazzo Edit",
    metaTitle: "Palazzo Suits for Women Online",
    metaDescription:
      "Comfortable, elegant palazzo suits for festive days and everyday celebrations. Free shipping above ₹2,999.",
    keywords: ["palazzo suit online", "plazo suit for women", "kurta palazzo set"],
    intro: [
      "Palazzo suits are the sweet spot between ease and elegance. The wide leg is breezy to wear and looks polished from a family lunch to an evening function.",
    ],
    highlights: [
      "Wide-leg comfort",
      "Complete sets with dupatta",
      "Pay by UPI or bank transfer via WhatsApp bill",
    ],
    guide: [
      {
        heading: "Fabric matters",
        body: "Lighter fabrics drape well and feel cool through the day. For cooler evenings, look for richer weaves with a little more body.",
      },
    ],
    faqs: COMMON_FAQS("palazzo suits"),
    related: ["pant-suits-for-women", "frock-suits-online", "ethnic-wear-under-3000"],
    query: { search: "plaz" },
  },
  {
    slug: "pant-suits-for-women",
    title: "Pant Suits for Women",
    eyebrow: "Pant Suit Edit",
    metaTitle: "Indian Pant Suits for Women Online",
    metaDescription:
      "Shop tailored Indian pant suits that move easily from festive gatherings to dinners out. Aayesha Fashion, free shipping above ₹2,999.",
    keywords: ["pant suit for women", "kurta with pants", "indian pant suit"],
    intro: [
      "A pant suit is a sleek, easy-to-wear take on the classic kurta set. Straight lines, a clean finish, and plenty of room to move.",
    ],
    highlights: [
      "Sleek straight-leg styling",
      "Dressed up or down with accessories",
      "Delivered across India",
    ],
    guide: [
      {
        heading: "Styling a pant suit",
        body: "Keep it polished with a statement earring and flats or low heels for daytime; add a dupatta and heels for evening occasions.",
      },
    ],
    faqs: COMMON_FAQS("pant suits"),
    related: ["palazzo-suits-online", "ethnic-wear-under-3000", "party-wear-ethnic-suits"],
    query: { search: "pant" },
  },
  {
    slug: "farshi-shalwar-suits",
    title: "Farshi Shalwar Suits",
    eyebrow: "Farshi Edit",
    metaTitle: "Farshi Shalwar Suits for Women",
    metaDescription:
      "Discover farshi shalwar suits with a dramatic flowing hem, made for weddings and celebrations. Free shipping above ₹2,999.",
    keywords: ["farshi shalwar suit", "farshi pajama set", "farshi salwar online"],
    intro: [
      "The farshi shalwar is known for its long, sweeping hem that pools elegantly at the floor. It brings a graceful, formal air to any festive outfit.",
    ],
    highlights: [
      "Long, sweeping silhouette",
      "Occasion-ready complete sets",
      "Easy online ordering with multiple payment options",
    ],
    guide: [
      {
        heading: "Wearing a farshi",
        body: "Choose heels that sit comfortably under the hem so you can walk with ease, and have the length checked against the footwear you plan to wear.",
      },
    ],
    faqs: COMMON_FAQS("farshi shalwar suits"),
    related: ["garara-suits-online", "sharara-sets-online", "wedding-guest-outfits"],
    query: { search: "farshi" },
  },

  /* ----------------------------- OCCASIONS ----------------------------- */
  {
    slug: "festive-wear-for-women",
    title: "Festive Wear for Women",
    eyebrow: "Festive Edit",
    metaTitle: "Festive Wear for Women Online",
    metaDescription:
      "Festive Indian wear for Eid, Diwali, weddings and family celebrations. Shop the Aayesha Fashion festive edit with free shipping above ₹2,999.",
    keywords: ["festive wear for women", "diwali outfits", "eid outfits for women", "festive suits"],
    intro: [
      "Festivals are for dressing up. This edit brings together our most-loved pieces for Eid, Diwali, weddings and every gathering that deserves something beautiful.",
      "Each piece is chosen for how it looks and how comfortable it is to wear through a long day of celebrations.",
    ],
    highlights: [
      "Hand-picked featured styles",
      "Delivered across India",
      "Pay by UPI, bill sent on WhatsApp",
    ],
    guide: [
      {
        heading: "Plan your festive outfit early",
        body: "Order a little ahead of the date so you have time to try the outfit, plan accessories and, if needed, arrange an exchange on eligible orders.",
      },
    ],
    faqs: COMMON_FAQS("festive outfits"),
    related: ["sharara-sets-online", "lehenga-sets-online", "ethnic-wear-under-5000"],
    featured: true,
    query: { isFeatured: true },
  },
  {
    slug: "wedding-guest-outfits",
    title: "Wedding Guest Outfits for Women",
    eyebrow: "Wedding Season",
    metaTitle: "Wedding Guest Outfits for Women",
    metaDescription:
      "Find the perfect Indian wedding guest outfit: sharara, garara, lehenga and suit sets that look elegant without overshadowing the bride.",
    keywords: ["wedding guest outfits women", "outfit for friend's wedding", "indian wedding guest dress"],
    intro: [
      "A wedding guest outfit should be festive, comfortable and photograph beautifully, without competing with the bride. These best-selling sets strike that balance.",
    ],
    highlights: [
      "Best-selling celebration sets",
      "Elegant without being over-the-top",
      "Free shipping above ₹2,999",
    ],
    guide: [
      {
        heading: "Etiquette basics",
        body: "Avoid head-to-toe white or very bridal reds unless the family says otherwise. Rich jewel tones, soft pastels and champagne shades are safe, flattering choices.",
      },
      {
        heading: "Think about the whole day",
        body: "Consider seating, travel and multiple events. A comfortable fabric and a fit you can move in will keep you feeling good from the first ritual to the last dance.",
      },
    ],
    faqs: COMMON_FAQS("wedding outfits"),
    related: ["lehenga-sets-online", "sharara-sets-online", "party-wear-ethnic-suits"],
    query: { isBestSeller: true, sort: "best-selling" },
  },
  {
    slug: "party-wear-ethnic-suits",
    title: "Party Wear Ethnic Suits",
    eyebrow: "New In",
    metaTitle: "Party Wear Ethnic Suits for Women",
    metaDescription:
      "Our newest party wear ethnic suits and sets, fresh from the studio. Contemporary Indian womenswear with free shipping above ₹2,999.",
    keywords: ["party wear suits", "ethnic party wear", "new arrivals ethnic wear"],
    intro: [
      "Looking for something new for the next dinner, reception or get-together? Start with our latest arrivals, updated as new pieces join the collection.",
    ],
    highlights: [
      "Newest styles first",
      "Contemporary silhouettes",
      "Easy online ordering",
    ],
    guide: [
      {
        heading: "Make it yours",
        body: "A single accessory can change the mood of an outfit. Swap a dupatta, add a clutch or choose a bolder earring to make a set feel personal.",
      },
    ],
    faqs: COMMON_FAQS("new arrivals"),
    related: ["gowns-for-women-online", "pant-suits-for-women", "festive-wear-for-women"],
    query: { isNew: true, sort: "newest" },
  },

  /* ------------------------------- PRICE ------------------------------- */
  {
    slug: "ethnic-wear-under-3000",
    title: "Ethnic Wear Under ₹3,000",
    eyebrow: "Under ₹3,000",
    metaTitle: "Ethnic Wear for Women Under ₹3,000",
    metaDescription:
      "Beautiful ethnic wear under ₹3,000: suits and sets that look festive without stretching your budget. Aayesha Fashion, free shipping above ₹2,999.",
    keywords: ["ethnic wear under 3000", "suits under 3000", "budget festive wear"],
    intro: [
      "Great style does not need a big budget. Here are our styles priced at ₹3,000 and below, sorted from the lowest price up.",
    ],
    highlights: [
      "Lowest prices first",
      "Add a little more to reach free shipping above ₹2,999",
      "Pay by UPI, bill sent on WhatsApp",
    ],
    guide: [
      {
        heading: "Getting the most from your budget",
        body: "Pick versatile colours you can restyle with different dupattas and jewellery, and consider ordering two pieces together to enjoy free shipping.",
      },
    ],
    faqs: COMMON_FAQS("these styles"),
    related: ["ethnic-wear-under-5000", "palazzo-suits-online", "pant-suits-for-women"],
    query: { maxPrice: 3000, sort: "price-low" },
  },
  {
    slug: "ethnic-wear-under-5000",
    title: "Ethnic Wear Under ₹5,000",
    eyebrow: "Under ₹5,000",
    metaTitle: "Ethnic Wear for Women Under ₹5,000",
    metaDescription:
      "Shop festive and occasion ethnic wear under ₹5,000. Elegant suits and sets from Aayesha Fashion with free shipping above ₹2,999.",
    keywords: ["ethnic wear under 5000", "festive suits under 5000", "party wear under 5000"],
    intro: [
      "Occasion-ready outfits at ₹5,000 and below. Explore sets that feel special without a luxury price tag, sorted from the lowest price up.",
    ],
    highlights: [
      "Occasion-ready sets",
      "Free shipping on orders above ₹2,999",
      "Simple UPI payment via WhatsApp bill",
    ],
    guide: [
      {
        heading: "Spend smart",
        body: "Look for sets that include the dupatta so you do not need to buy extras, and choose timeless colours you will wear again.",
      },
    ],
    faqs: COMMON_FAQS("these styles"),
    related: ["ethnic-wear-under-3000", "festive-wear-for-women", "sharara-sets-online"],
    query: { maxPrice: 5000, sort: "price-low" },
  },
];

export const getLandingPage = (slug: string) =>
  landingPages.find((page) => page.slug === slug);

export const getRelatedLandingPages = (page: LandingPage) =>
  page.related
    .map((slug) => getLandingPage(slug))
    .filter((item): item is LandingPage => Boolean(item));

export const featuredLandingPages = landingPages.filter(
  (page) => page.featured,
);
