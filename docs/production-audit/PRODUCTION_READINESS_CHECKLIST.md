# PRODUCTION READINESS CHECKLIST

Legend: ✅ done · ⚠ partly / recommended · ❌ blocked / missing

## Security
- ✅ Admin routes enforce role (matrix test) · ✅ Orders/addresses scoped to owner · ✅ P0 order-data leak removed
- ✅ Rate limits on public write endpoints · ✅ Input validation on orders · ✅ Upload magic-byte check · ✅ JWT HS256 pinned
- ✅ Security headers both sites · ✅ Admin noindex · ✅ No secrets in repos or history ("none detected") · ✅ `npm audit`: 0 vulnerabilities
- ⚠ Full CSP not set · ⚠ No admin 2FA · ❌ Rotation of any previously shared credentials must be confirmed by client
## Payments / integrations
- ❌ Razorpay live keys + webhook secret + end-to-end test · ❌ SMTP · ❌ WhatsApp Cloud API · ❌ Cloudinary production account confirmation
## Data
- ❌ MongoDB Atlas tier, backups, IP allow-list reviewed · ⚠ Mongoose duplicate-index warnings (cosmetic)
## Hosting / operations
- ❌ Render paid plan (free sleeps ~50 s) · ❌ Domain aayeshafashion.in attached to Vercel · ❌ Env vars set: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=true` at go-live
- ❌ Error tracking and uptime monitoring · ⚠ Unused heavy assets in `public/`
## SEO
- ✅ Sitemap, robots guard, titles, canonical base · ❌ Indexing deliberately OFF until go-live
## Business / legal (client)
- ❌ Shipping fees confirmation · ❌ Return/cancellation/privacy/terms texts · ❌ GST invoice format · ❌ Size/colour variants decision · ❌ Final logo and hero imagery
