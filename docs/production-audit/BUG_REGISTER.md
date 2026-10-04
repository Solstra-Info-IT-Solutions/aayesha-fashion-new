# BUG_REGISTER

Every issue found in the audit. Severity: P0 blocker · P1 critical · P2 high · P3 medium · P4 low.

| ID | Sev | Area | Issue | Status | Notes |
|---|---|---|---|---|---|
| B01 | P0 | Security / Backend | Public endpoint GET /api/orders/internal/:id returned the full order (name, phone, email, address, payment data) to anyone who knew or guessed an order number | **FIXED** | Route removed; regression test added; order numbers also now use a cryptographic random suffix. |
| B02 | P1 | SEO / Deployment | Search engines were allowed to index every deployment (robots.txt allowed all, pages said index,follow) while canonical URLs point at a domain that is not attached yet | **FIXED** | Indexing is off by default; turn on with NEXT_PUBLIC_ALLOW_INDEXING=true at go-live. Product and landing pages can no longer override it. |
| B03 | P1 | Integration | Production requires SMTP: without it registration verification, password reset and OTP login emails fail | **CLIENT / CREDENTIALS REQUIRED** | Client must supply an SMTP provider (see client requirements W). |
| B04 | P1 | Business | No size / colour variants: the product page has no selector and stock is a single number | **REQUIRES CLIENT CONFIRMATION** | Feature build if sizes are sold (gap G1). |
| B05 | P1 | Deployment | Backend on Render free plan sleeps (~50 s first request); MongoDB tier / backups unknown | **CLIENT DECISION REQUIRED** | Upgrade plan; confirm Atlas backups (gaps G11, G12). |
| B06 | P1 | Business / Legal | Shipping charges, return / cancellation rules and GST invoice format are developer defaults or missing | **REQUIRES CLIENT CONFIRMATION** | See CLIENT_CONFIRMATION_REQUIRED.md. |
| B07 | P2 | Security / Backend | Public endpoints that create orders, validate coupons, subscribe to stock alerts, create returns, drive payments and verify email had no rate limits | **FIXED** | Per-IP limits added (shared limiter), test proves the order limiter trips. |
| B08 | P2 | Backend | Order creation only checked "not empty": junk email, phone, address and postal code, 500-character names and 1000-line orders were accepted | **FIXED** | Server-side format and size validation; test covers 7 bad inputs. |
| B09 | P2 | Security / Frontend | Product description was rendered as raw HTML (stored XSS if an admin account or CSV import is abused) | **FIXED** | Rendered as text. |
| B10 | P2 | Security / Deployment | No security headers on storefront or admin; admin panel was indexable | **FIXED** | frame-ancestors / X-Frame-Options, nosniff, referrer and permissions policy; admin sends X-Robots-Tag noindex and robots.txt disallow. |
| B11 | P2 | UI / Functional | Toast notifications: dark text on a dark background (introduced by the theme change) and two toast containers mounted at once | **FIXED** | Single container, light text. |
| B12 | P2 | Functional / SEO | When the API was unreachable, collection pages answered 404 (search engines would drop them) | **FIXED** | 404 only for a genuinely missing category; otherwise the retryable error page (500). |
| B13 | P2 | Deployment | Home page build/prerender could fail if the marketing API call failed | **FIXED** | Featured collection and promo banner fail soft. |
| B14 | P2 | Frontend | API client had no timeout and surfaced raw "Failed to fetch" | **FIXED** | 30 s timeout and plain-language network messages (admin: plain-language message). |
| B15 | P2 | Functional | Newsletter form accepted an address, said "Welcome", and discarded it | **FIXED** | Replaced by a real WhatsApp opt-in. |
| B16 | P2 | Functional (UX) | Guests cannot reopen their order page once the browser tab is closed (no lookup by number + phone) | **OPEN — client priority** | Gap G7. |
| B17 | P2 | Observability | No error tracking or uptime monitoring | **OPEN — recommended before launch** | Add Sentry + uptime check on /api/health. |
| B18 | P3 | Accessibility | Admin: unnamed account button, 6 unlabeled selects, focusable content inside aria-hidden sparklines | **FIXED** | axe: 0 violations on 17 admin pages x 2 viewports. |
| B19 | P3 | Accessibility | Storefront: low-contrast eyebrow labels and auth brand text (axe serious) | **FIXED** | axe: 0 violations on 16 key pages x 2 viewports. |
| B20 | P3 | Frontend | No global error boundary on the storefront and none at all in the admin | **FIXED** | error.tsx / global-error.tsx / not-found.tsx added. |
| B21 | P3 | Backend | Malformed JSON and oversized bodies returned HTTP 500 | **FIXED** | 400 INVALID_JSON and 413. |
| B22 | P3 | Security | Image upload trusted the browser-declared MIME type | **FIXED** | File signature (magic bytes) is verified; unit test added. |
| B23 | P3 | Backend | Debug logging of request.user and order lines on every order request | **FIXED** | Removed. |
| B24 | P3 | Performance / Design | Home page shows a ~5 s branded reveal before the chooser: measured home LCP 6.8 s on desktop (production build); other pages 0.2-1.6 s | **OPEN — client awareness** | Design choice approved by client; consider shortening or showing once per session. |
| B25 | P3 | Security | No Content-Security-Policy beyond frame-ancestors | **OPEN — recommended** | A full CSP needs a report-only trial because of the payment script and Next.js inline scripts. |
| B26 | P4 | Backend | JWT verification did not pin the algorithm; order-number random suffix used Math.random | **FIXED** | HS256 pinned; crypto.randomInt. |
| B27 | P4 | Database | Mongoose warnings: duplicate index on Otp.expiresAt; reserved path name "isNew" on Product | **OPEN** | Cosmetic; changing the schema is not worth the risk before launch. |
| B28 | P4 | Performance | Unused heavy files in public/ (a 9.3 MB video, 2.4 MB hero PNG, several 2 MB JPEGs) | **OPEN** | Not served to users unless requested; remove or compress to cut deploy size. |
| B29 | P4 | SEO | Home page title lacked keywords; My Coupons page had no title | **FIXED** |  |
| B30 | P4 | Code quality | Admin has pre-existing React-hooks lint errors (set-state-in-effect) | **OPEN** | Pre-existing; no new ones added. |
| B31 | P4 | Security | Admin has no two-factor authentication | **OPEN — recommended** | Gap G14. |