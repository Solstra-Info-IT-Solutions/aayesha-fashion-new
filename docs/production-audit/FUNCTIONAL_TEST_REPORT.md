# FUNCTIONAL TEST REPORT

Method: automated Playwright journeys (Chromium, desktop 1440 and mobile 390) against a production-mode storefront with a throw-away API mock, plus a 12-test admin suite, a backend authorization matrix, axe-core accessibility sweeps and a 320–1920 px overflow sweep. The mock only stands in for the unreachable live API; no test result was faked.

**Not tested (honest list):** live Render API, real MongoDB, Razorpay payments, SMTP email, WhatsApp bills, Firefox, Safari, Edge, real phones, Lighthouse on production. See PRODUCTION_READINESS_CHECKLIST.md.

| Area | Result | Evidence |
|---|---|---|
| Storefront journeys (browse, search, product, cart, checkout form, order page, auth, wishlist, 404) | PASS 20/20 | `e2e/journeys.spec.ts` (10 tests × 2 viewports) |
| Admin (login, bad password, dashboard, orders, products, customers, settings, logout) | PASS 12/12 | `e2e/admin.spec.ts` |
| Backend authorization (226 routes; 142 admin routes: 401 anonymous, 403 customer) | PASS | `tests/authz-matrix.test.ts` |
| Backend unit (JWT, image signature, rate limit, order validation) | PASS 13/13 | `npm test` |
| Accessibility WCAG A/AA | PASS 0 violations after fixes (storefront 16 pages × 2, admin 17 pages × 2) | axe-core |
| Responsive 320/390/768/1024/1440/1920 | PASS no horizontal overflow (admin 17 pages; storefront sweep) | Playwright sweep |
| Negative input (bad JSON, oversized body, junk checkout data, bad file type) | PASS after fixes (400/413) | tests |
| Type-check / production build | PASS | `tsc`, `next build` |
| Performance (production build, mock API) | CLS 0.003–0.007; LCP 0.2–1.6 s on inner pages; **home 6.8 s desktop (brand reveal)** | custom script |
| Browser coverage | Chromium only | — |
| Payment (Razorpay) | BLOCKED — PRODUCTION CREDENTIALS REQUIRED (signature logic code-reviewed only) | — |
| Email (SMTP) | BLOCKED — PRODUCTION CREDENTIALS REQUIRED | — |
| WhatsApp | BLOCKED — PRODUCTION CREDENTIALS REQUIRED | — |
| Live database review | BLOCKED — Atlas access disabled in this environment | — |
| Live site / Render / Vercel verification | BLOCKED — network egress | — |

Two console errors seen at 820 px were mock-server overload, not application defects. The sweep reported two h1 on some pages; isolated checks show one (route-transition artefact).
