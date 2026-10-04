# Aayesha Fashion — storefront keys and configuration

Repository: `aayesha-fashion-new` (Next.js, deployed on Vercel).
Companion document for the admin panel and the backend keys: `aayesha-fashion-admin/docs/ENVIRONMENT_KEYS.md`.

> Rule of thumb: anything starting with `NEXT_PUBLIC_` is bundled into the browser.
> Never put a secret in one. Secrets (Razorpay, WhatsApp, SMS, SMTP, JWT, Cloudinary)
> live **only** on the backend (Render).

## 1. Keys this repository reads

| Key | Required | Where it is used | If missing | Status |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | **Yes (production)** | `src/lib/api.ts` — base URL of every API call | Falls back to `http://localhost:5000/api`, so the live site cannot reach the backend | Implemented |
| `BACKEND_URL` | Local dev only | `next.config.mjs` — target of the `/api/*` rewrite | Defaults to `http://localhost:4000` | Implemented |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Product page canonical URL / JSON-LD | Falls back to `https://aayeshafashion.in` | Implemented |
| `NEXT_PUBLIC_ENABLE_ONLINE_PAYMENT` | No | `src/config/site.ts` — shows the Razorpay option at checkout when `"true"` | Option hidden (store currently takes payment through the WhatsApp bill) | UI implemented; **not tested with real Razorpay keys** |
| `NEXT_PUBLIC_ENABLE_COD` | No | `src/config/site.ts` — shows Cash on Delivery when `"true"` | Option hidden. The backend must also have `COD_ENABLED=true` or it rejects COD orders | Implemented |
| `NEXT_PUBLIC_SITE_URL` | **Yes at go-live** | `src/config/site.ts` — canonical, sitemap, Open Graph and JSON-LD URLs | Falls back to `https://aayeshafashion.in` | Implemented; set to the real domain |
| `NEXT_PUBLIC_ALLOW_INDEXING` | **Yes at go-live** | `src/config/site.ts`, `robots.ts`, metadata — `"true"` lets search engines index the site | Site sends `noindex` and `Disallow: /` (safe default for staging / previews) | Implemented; **turn on only for the live domain** |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | `analytics-scripts.tsx` — Google Analytics 4 | No GA script loaded | Implemented (consent-gated); **ID not set** |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | `analytics-scripts.tsx` — Meta Pixel | No pixel loaded | Implemented (consent-gated); **ID not set** |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | `app/layout.tsx` meta tag | Tag omitted | Implemented; **token not set** |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | No | `app/layout.tsx` meta tag | Tag omitted | Implemented; **token not set** |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `_FACEBOOK_URL` / `_YOUTUBE_URL` / `_TWITTER_URL` | No | Footer social icons (`config/site.ts`) | Icon not shown | Implemented; **URLs not set** |

### Removed from `.env.example` in this change
These were listed but nothing in the code reads them, and one was a secret:

* `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT_NUMBER` — WhatsApp sending is done by the **backend**; the storefront never uses them. A WhatsApp token must never be set on Vercel.
* `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — "Sign in with Google" is **not implemented** yet (the backend user model has a `googleSubject` field only).

## 2. Values hard-coded in source (not environment keys)

Change these in `src/config/site.ts` if they are wrong:

* Site URL `https://aayeshafashion.in`
* Contact phone / WhatsApp number `918788158087` and `https://wa.me/918788158087`
* Contact e-mail is empty in config — set `contact.email` if you want one shown wherever the site uses it

## 3. Backend keys the storefront depends on (set on Render, not here)

| Feature on the site | Backend keys | Status |
| --- | --- | --- |
| Login / sessions | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Implemented, required |
| Browser access (CORS) | `FRONTEND_URL`, `ADMIN_FRONTEND_URL`, optional `CORS_ALLOWED_ORIGINS` | Implemented, required |
| Product / banner images | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Implemented, required |
| Pay by UPI / bank transfer (WhatsApp bill) | `STORE_UPI_ID`, `STORE_BANK_DETAILS` (or fill them in admin → Payments & WhatsApp) | Implemented; **values not confirmed** |
| WhatsApp bills & invoices | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_INVOICE_TEMPLATE_NAME`, `WHATSAPP_BILL_TEMPLATE_NAME` (or admin → Payments & WhatsApp) | Implemented; **never tested with real credentials** — message delivery unverified |
| Phone OTP login | `SMS_PROVIDER` (`console`/`msg91`/`twilio`) + provider keys | `console` works (prints OTP in logs, dev only); MSG91/Twilio implemented but **untested** |
| E-mail OTP / reminders | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Implemented; **untested** |
| Online payment (Razorpay) | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Implemented; **no live keys configured, untested** |
| Cash on Delivery | `COD_ENABLED=true` | Implemented, off by default |
| Abandoned-cart reminders | `CART_REMINDERS_ENABLED` | Implemented, on by default |

## 4. What is left / not done

* **Sign in with Google** — not built. Needs a Google OAuth client, a backend verify endpoint and a button.
* **Razorpay online payments** — code present but switched off and never exercised with real keys. Enable only after test-mode checks (order, verify, webhook).
* **WhatsApp delivery** — needs a Meta Business account, approved templates and a permanent token; none could be tested here.
* **SMS / e-mail OTP providers** — choose and configure one (MSG91 or Twilio; SMTP) before relying on OTP login in production.
* **Analytics and search-console IDs** — add GA4 / Meta Pixel / verification tokens when ready.
* **Social URLs and contact e-mail** — empty until you provide them.
* **Live checks** — everything in this repository was tested against a mock API in a browser, not the live Render API; run one real order end to end after deploying.

## 5. Navigation fix (checkout history stack)

Cart → Checkout → "Back to Bag" used to push a **new** history entry each time, so repeating the loop stacked
cart/checkout pages and the browser Back button bounced between them (4 loops added 9 history entries).
"Back to Bag" and the cart's "Continue Shopping" now go back in history when the visitor came from that page and
otherwise replace the current entry (`src/lib/nav-history.ts`, `components/navigation/*`). The same 4 loops now add
2 entries and Back leaves the bag area.
