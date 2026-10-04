# CLIENT_REQUIREMENTS_BEFORE_PRODUCTION

Everything the client must supply, confirm or approve before the store can go live. Nothing here is assumed: where the codebase contains a developer default (for example shipping charges) it is listed so the client can confirm or change it.

**Legend** — *Status*: `CLIENT INPUT REQUIRED` = nothing supplied yet. *Blocking production?* YES = the store must not launch without it.


## A. BRANDING

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 1 | [ ] Final logo (round mark + wordmark) for dark backgrounds | Header, footer, sign-in, invoices and emails still show the earlier pink round logo, which does not suit the approved obsidian / champagne look | YES | SVG (preferred) + PNG 1024px transparent; a light and a dark version | Champagne or white wordmark on transparent | CLIENT INPUT REQUIRED | **YES** |
| 2 | [ ] Brand name spelling and tagline approval | "AAYESHA FASHION" / "Elegance in every detail" appear in the intro, metadata and emails | YES | Text | AAYESHA FASHION — Elegance in every detail | Approved by client in preview | **NO** |
| 3 | [ ] Approved colour palette confirmation | Whole site and admin were re-themed to obsidian #111111 / champagne #B79A6A on request | YES | Hex values | Obsidian #111111, Champagne #B79A6A | Client liked the theme (per conversation) | **NO** |

## B. CONTENT

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 4 | [ ] Homepage copy (hero headline, sub-text, section titles) | Currently developer placeholder text | YES | Text per section | "Contemporary Indian Womenswear — hand finished silhouettes" | CLIENT INPUT REQUIRED | **YES** |
| 5 | [ ] Brand story / values text | Our Story page text was written by the developer | YES | Text, approved | — | Written draft exists; needs client approval | **YES** |
| 6 | [ ] Testimonials / reviews policy | Reviews are shown from real customers only; empty until orders are delivered | YES | Decision | Seed with genuine reviews only | CLIENT INPUT REQUIRED | **NO** |

## C. PRODUCTS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 7 | [ ] Complete live catalogue (name, description, fabric, care, SKU) | The store is only useful with real products; test data is shown today | YES | CSV (the admin has an import tool) or entered in admin | Ivory Noor Kurta Set · SKU AF-0012 · Chanderi silk · dry clean | CLIENT INPUT REQUIRED | **YES** |
| 8 | [ ] Product categories and sub-categories | Navigation, filters and SEO pages depend on them | YES | List | Suits, Garara, Festive, Ethnic, Contemporary | CLIENT INPUT REQUIRED | **YES** |
| 9 | [ ] Collections (New Arrivals, Best Sellers, Festive Edit) rules | Which products appear in each collection | YES | Rules or manual list | Festive Edit = products tagged Festive | CLIENT INPUT REQUIRED | **NO** |

## D. PRODUCT IMAGES

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 10 | [ ] High-resolution product photos (min 3 per product) | Gallery, zoom and listing cards | YES | JPG/WebP, ≥1600px long edge, consistent 4:5 ratio, plain or in-situ background | front / back / detail | CLIENT INPUT REQUIRED | **YES** |
| 11 | [ ] Image alt text / model descriptions | Accessibility and image SEO | YES | One line per image | "Model wearing ivory chanderi kurta set with gold border" | CLIENT INPUT REQUIRED | **NO** |
| 12 | [ ] Image usage rights confirmation | Avoid copyright claims | YES | Written confirmation | Photographer / AI-generated disclosure | CLIENT INPUT REQUIRED | **YES** |

## E. PRODUCT PRICING

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 13 | [ ] MRP and selling price per product (GST inclusive?) | The store shows "Inclusive of applicable taxes"; orders use selling price | YES | INR, whole rupees | MRP 6,999 · Selling 4,999 | CLIENT INPUT REQUIRED | **YES** |
| 14 | [ ] Discount policy (sale, coupons, first-order offer) | Banner shows WELCOME10 (10% above ₹2,999) and FREESHIP — these are admin-created coupons and must match real offers | YES | Rules | 10% off above ₹2,999, once per customer | CLIENT INPUT REQUIRED | **YES** |

## F. PRODUCT VARIANTS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 15 | [ ] Are sizes and colours sold? (stitched sizes, made-to-measure, free size?) | The product page currently has NO size or colour selector and stock is a single number per product. A fashion store normally needs sizes | YES | Decision + size chart | Sizes S–XXL with per-size stock — REQUIRES CLIENT CONFIRMATION | CLIENT INPUT REQUIRED | **YES** |
| 16 | [ ] Size chart(s) | Reduces returns | YES | Image or table | Bust / waist / length per size | CLIENT INPUT REQUIRED | **NO** |

## G. CATEGORIES

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 17 | [ ] Category images (square or 4:5) and descriptions | Category cards and category pages | YES | JPG/WebP | Suits.jpg + one-line description | CLIENT INPUT REQUIRED | **NO** |

## H. BANNERS / HERO SECTIONS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 18 | [ ] Hero banner images (desktop ≥1920×900 and mobile ≥900×1200) WITHOUT text baked in | Current hero images are low resolution (503×348) with text in the picture, which clashes with the live headline | YES | JPG/WebP + headline/CTA text separately | Campaign photo, text added in the admin | CLIENT INPUT REQUIRED | **YES** |
| 19 | [ ] Featured collection and promotional banner image + copy | Home page sections managed in admin | YES | Image + text | "The Festive Edit" | CLIENT INPUT REQUIRED | **NO** |

## I. LOGO / FAVICON

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 20 | [ ] Favicon / app icon from the final logo (512px, 192px, 32px, 16px) | Browser tab and mobile home-screen icon | YES | PNG/SVG square | — | CLIENT INPUT REQUIRED | **NO** |
| 21 | [ ] Open Graph share image 1200×630 | Link previews on WhatsApp / social | YES | JPG | Brand image with logo | CLIENT INPUT REQUIRED | **NO** |

## J. ABOUT US CONTENT

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 22 | [ ] Founder / brand story, photos, workshop details | Our Story page | YES | Text + photos | — | Draft exists; needs approval | **NO** |

## K. CONTACT INFORMATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 23 | [ ] Customer-care phone / WhatsApp number | Contact page, floating chat, footer | YES | +91 digits | +91 87881 58087 (currently configured) | Configured — client to confirm it is the final number | **YES** |
| 24 | [ ] Customer-care email address | Contact page, emails, policy pages — currently EMPTY in the code | YES | Email | care@aayeshafashion.in | CLIENT INPUT REQUIRED | **YES** |
| 25 | [ ] Business hours / response time promise | Contact page and policies | YES | Text | Mon–Sat 10am–7pm IST | CLIENT INPUT REQUIRED | **NO** |

## L. BUSINESS INFORMATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 26 | [ ] Registered business name, address, PAN, GSTIN | Invoices, footer, privacy policy and legal pages | YES | Text | Aayesha Fashion · address · GSTIN 07XXXXX | CLIENT INPUT REQUIRED | **YES** |
| 27 | [ ] Pickup / dispatch address and courier partner(s) | Shipping policy and delivery promises | YES | Text | Delhi · Delhivery / India Post | CLIENT INPUT REQUIRED | **YES** |

## M. SOCIAL MEDIA LINKS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 28 | [ ] Instagram, Facebook, YouTube, X/Twitter URLs | Footer icons appear only when a URL is set (env NEXT_PUBLIC_*_URL) | YES | URLs | https://instagram.com/aayeshafashion | CLIENT INPUT REQUIRED | **NO** |
| 29 | [ ] Instagram gallery images / feed handling | Home section shows static images | YES | Images or approval for static section | — | CLIENT INPUT REQUIRED | **NO** |

## N. POLICIES

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 30 | [ ] Final approval of every policy page | The six policy pages were drafted by the developer; they must be reviewed by the client (and ideally a lawyer) | YES | Written approval | Approved version dated | CLIENT INPUT REQUIRED | **YES** |

## O. SHIPPING POLICY

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 31 | [ ] Shipping charges and free-shipping threshold | Code currently charges ₹99 standard, ₹199 express, free above ₹2,999 — these were developer defaults, not client decisions | YES | Rules | Free above ₹999, otherwise ₹80 | CLIENT INPUT REQUIRED | **YES** |
| 32 | [ ] Delivery timelines per zone, serviceable pincodes, international shipping yes/no | Shown on product page and in the policy | YES | Table | Metro 3–5 days; rest 5–9 days | CLIENT INPUT REQUIRED | **YES** |

## P. RETURN / REFUND POLICY

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 33 | [ ] Return / exchange window, conditions, non-returnable items, who pays shipping | Return requests and refund workflow exist in admin and need rules to enforce | YES | Rules | 7 days, unworn with tags, custom stitching non-returnable | CLIENT INPUT REQUIRED | **YES** |
| 34 | [ ] Refund method and timeline | Refund module exists; money movement is manual for Bank/UPI | YES | Rules | To original method within 7 working days | CLIENT INPUT REQUIRED | **YES** |

## Q. CANCELLATION POLICY

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 35 | [ ] Order cancellation rules (before dispatch? fee?) | There is NO separate cancellation policy page; unpaid orders auto-cancel after the payment window | YES | Text + decision | Free cancellation before dispatch | CLIENT INPUT REQUIRED | **YES** |
| 36 | [ ] Unpaid Bank/UPI order hold time | Backend env PAYMENT_CLAIM_HOLD_MINUTES / order expiry (currently 30 minutes) | YES | Minutes | 30 | CLIENT INPUT REQUIRED | **NO** |

## R. PRIVACY POLICY

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 37 | [ ] Approved privacy policy incl. grievance officer details (India) | Collects name, email, phone, address; cookies / analytics with consent | YES | Text | Grievance officer name + email | CLIENT INPUT REQUIRED | **YES** |

## S. TERMS & CONDITIONS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 38 | [ ] Approved terms (jurisdiction, pricing errors, order acceptance) | Legal protection | YES | Text | Courts of Delhi | CLIENT INPUT REQUIRED | **YES** |

## T. PAYMENT CONFIGURATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 39 | [ ] UPI ID, bank account details, account holder, QR | Bill sent on WhatsApp encodes the UPI QR; entered in admin → Payments & WhatsApp (or env STORE_*) | YES | Text | aayesha@okhdfcbank | CLIENT INPUT REQUIRED | **YES** |
| 40 | [ ] Razorpay live keys (KEY_ID, KEY_SECRET, WEBHOOK_SECRET) — only if online card/UPI payments are wanted | Online payments are OFF by default; to enable: backend keys + webhook URL + NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT=true | YES | Keys from Razorpay dashboard (KYC complete) | rzp_live_… (do not paste in chat) | CLIENT INPUT REQUIRED | **NO** |
| 41 | [ ] Cash on delivery yes/no | Off by default (COD_ENABLED / NEXT_PUBLIC_ENABLE_COD) | YES | Decision | No | CLIENT INPUT REQUIRED | **NO** |

## U. SHIPPING CONFIGURATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 42 | [ ] Courier account / tracking process | Admin can store tracking info per order; no courier API is integrated | YES | Decision | Manual tracking via Delhivery link | CLIENT INPUT REQUIRED | **NO** |

## V. TAX / GST INFORMATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 43 | [ ] GST registration status, GSTIN, rates per product category, HSN codes | Prices are shown tax-inclusive; the invoice has a GSTIN field but no per-line GST split, so a legally compliant tax invoice needs the client's accountant to specify the format | YES | Text + accountant sign-off | 5% on garments under ₹1,000, 12% above | CLIENT INPUT REQUIRED | **YES** |

## W. EMAIL CONFIGURATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 44 | [ ] SMTP provider and credentials (SMTP_HOST/PORT/USER/PASS/FROM) + verified sender domain (SPF/DKIM) | In production the backend REFUSES to send mail without SMTP — registration verification, password reset and OTP login all fail until this is set | YES | Provider account (e.g. Zoho, SES, Brevo) | noreply@aayeshafashion.in | CLIENT INPUT REQUIRED | **YES** |
| 45 | [ ] Email template wording and branding approval | Verification, reset and order emails | YES | Text | — | CLIENT INPUT REQUIRED | **NO** |

## X. WHATSAPP CONFIGURATION

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 46 | [ ] Meta WhatsApp Cloud API: access token, phone-number ID, approved templates (bill + invoice) | The "bill on WhatsApp" payment flow depends on it; without it orders are placed but no bill is sent | YES | Meta business verification + templates | Template names set in admin | CLIENT INPUT REQUIRED | **YES** |

## Y. ADMIN ACCOUNT

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 47 | [ ] Who will administer the store (names, emails) and their roles | RBAC roles exist; initial admin is created through the seed process | YES | List | Owner (super admin), staff (orders only) | CLIENT INPUT REQUIRED | **YES** |
| 48 | [ ] Password policy / 2FA decision | No 2FA exists today | YES | Decision | Strong passwords; consider 2FA later | CLIENT INPUT REQUIRED | **NO** |

## Z. DOMAIN / HOSTING

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 49 | [ ] Domain name and registrar access (aayeshafashion.in is assumed in the code but is NOT attached to the Vercel project) | Canonical URLs, sitemap, emails and CORS depend on the real domain | YES | Domain + DNS access | aayeshafashion.in | CLIENT INPUT REQUIRED | **YES** |
| 50 | [ ] Backend hosting plan | Render FREE plan sleeps after inactivity (first request after idle takes ~50 s) — unacceptable for a store | YES | Paid plan approval (~US$7/month) and/or paid MongoDB Atlas tier | Render Starter + Atlas M10 or at least backups | CLIENT INPUT REQUIRED | **YES** |

## AA. DNS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 51 | [ ] DNS records for storefront (apex + www), optional api. and admin. sub-domains, mail (SPF, DKIM, DMARC) | Go-live and email deliverability | YES | DNS panel access | A/CNAME to Vercel; TXT for mail | CLIENT INPUT REQUIRED | **YES** |

## AB. SSL

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 52 | [ ] SSL certificates | Issued automatically by Vercel / Render once DNS points at them | YES | — | — | Automatic after DNS | **NO** |

## AC. SEO

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 53 | [ ] Unique page titles / descriptions for key pages and product copy | Ranking and click-through | YES | Text | — | Defaults exist; client to review | **NO** |
| 54 | [ ] Switch on indexing at launch (NEXT_PUBLIC_ALLOW_INDEXING=true) and set NEXT_PUBLIC_SITE_URL | Search engines are blocked by default so staging can never be indexed | YES | Developer action on client go-ahead | — | Done by developer at go-live | **YES** |

## AD. ANALYTICS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 55 | [ ] Google Analytics 4 measurement ID; Meta Pixel ID (optional) | Loaded only after cookie consent | YES | IDs | G-XXXXXXXXXX | CLIENT INPUT REQUIRED | **NO** |

## AE. SEARCH CONSOLE

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 56 | [ ] Google Search Console and Bing Webmaster ownership (verification tokens) and sitemap submission | Visibility in search | YES | Account access or tokens | NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION | CLIENT INPUT REQUIRED | **NO** |

## AF. META / SOCIAL SHARING

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 57 | [ ] Approved share image, title and description | Previews on WhatsApp, Facebook, X | YES | Image 1200×630 + text | — | CLIENT INPUT REQUIRED | **NO** |

## AG. LEGAL / COMPLIANCE

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 58 | [ ] Legal review of policies; FSSAI/other not applicable; consumer-protection e-commerce rules (seller details, grievance officer, return info on product pages) | India e-commerce rules require seller identity, grievance officer and clear return terms | YES | Lawyer / accountant sign-off | — | CLIENT INPUT REQUIRED | **YES** |
| 59 | [ ] Cookie consent wording approval | A consent banner exists (analytics / marketing off by default) | YES | Text | — | CLIENT INPUT REQUIRED | **NO** |

## AH. PRODUCTION APPROVALS

| # | Requirement | Why it is required | Required from client? | Required format | Example | Status | Blocking production? |
|---|---|---|---|---|---|---|---|
| 60 | [ ] Written client approval of the final design (storefront + admin) | Release gate | YES | Email / signed note | — | CLIENT INPUT REQUIRED | **YES** |
| 61 | [ ] Client sign-off after User Acceptance Testing on staging with real catalogue | Release gate | YES | Email | — | CLIENT INPUT REQUIRED | **YES** |
| 62 | [ ] Backup and recovery plan approval (Atlas backups, who restores) | Business continuity | YES | Decision | Daily backup, 7-day retention | CLIENT INPUT REQUIRED | **YES** |

---
**Total items: 62  ·  blocking: 36**