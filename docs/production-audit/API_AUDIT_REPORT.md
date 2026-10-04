# API_AUDIT_REPORT

Generated from the live route table of the backend (`npm test` boots the real Express app and calls every route anonymously and with a customer token). Statuses in the "Anonymous" / "Customer" columns are what the route answers **before** touching the database (401/403 = blocked at the gate; 400 = rejected by validation; 429 = rate limited; 500 / -1 here only means the handler ran and found no database in the test harness).

**Routes discovered: 226**  ·  Admin routes: 142  ·  all answer 401 anonymously and 403 to a customer token (PASS).

| Method | Path | Class | Anonymous | Customer token | Notes |
|---|---|---|---|---|---|
| GET | `/api/admin/` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/:id/read` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/abandoned-carts/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/audit-logs/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/audit-logs/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/attributes` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/attributes` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/attributes/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/attributes/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/badges` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/badges` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/badges/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/badges/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/categories` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/categories` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/categories/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/categories/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/collections` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/collections` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/collections/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/collections/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/colors` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/colors` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/colors/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/colors/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/sizes` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/sizes` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/sizes/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/sizes/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/catalog/tags` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/catalog/tags` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/catalog/tags/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/catalog/tags/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/content/pages` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/content/pages` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/content/pages/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/content/pages/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/coupons/` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/coupons/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/coupons/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/coupons/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/coupons/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/coupons/:id/status` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/coupons/stats` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/customers/:userId` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/:userId` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/customers/:userId` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/:userId/activity` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/:userId/addresses` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/customers/:userId/archive` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/:userId/orders` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/:userId/orders/:orderNumber` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/customers/:userId/restore` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/customers/:userId/status` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/customers/stats` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/dashboard/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/dashboard/export` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/homepage/announcements` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/homepage/announcements` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/homepage/announcements/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/homepage/hero` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/homepage/hero` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/homepage/hero/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/marketing/campaigns` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/marketing/campaigns` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/marketing/campaigns/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/marketing/campaigns/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/marketing/campaigns/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/marketing/campaigns/:id/archive` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/marketing/campaigns/:id/restore` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/marketing/campaigns/:id/status` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/marketing/stats` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/orders/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/orders/:orderNumber` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/orders/:orderNumber/cancel` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/orders/:orderNumber/notes` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/orders/:orderNumber/payment` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/orders/:orderNumber/shipping` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/orders/:orderNumber/status` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/orders/summary` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/payment-config/` | ADMIN (RBAC) | 401 | 403 |  |
| PUT | `/api/admin/payment-config/` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/payment-config/verify-whatsapp` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/products/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/products/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/products/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/products/:id/archive` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/:id/media` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/products/:id/media` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/products/:id/media/:mediaId` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/products/:id/media/:mediaId` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/:id/merchandising` | ADMIN (RBAC) | 401 | 403 |  |
| PUT | `/api/admin/products/:id/merchandising` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/products/:id/publish` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/products/:id/seo` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/:id/seo` | ADMIN (RBAC) | 401 | 403 |  |
| PUT | `/api/admin/products/:id/seo` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/products/:id/unpublish` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/products/import` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/products/import/template` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/read-all` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reports/orders` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reports/products` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reports/sales` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/returns/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/returns/:requestNumber` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/exchange` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/inspection` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/picked-up` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/pickup` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/received` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/returns/:requestNumber/refund` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/returns/:requestNumber/refund/complete` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/returns/:requestNumber/status` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reviews/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/reviews/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reviews/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/reviews/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/reviews/:id/featured` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/reviews/:id/moderate` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/reviews/stats` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/settings/` | ADMIN (RBAC) | 401 | 403 |  |
| PUT | `/api/admin/settings/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/settings/:key` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/settings/:key` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/settings/:key/public` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/settings/public` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/stock-alerts/` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/support/` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/support/:id` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/support/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/support/:id` | ADMIN (RBAC) | 401 | 403 |  |
| PATCH | `/api/admin/support/:id/close` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/support/stats` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/unread-count` | ADMIN (RBAC) | 401 | 403 |  |
| DELETE | `/api/admin/uploads` | ADMIN (RBAC) | 401 | 403 |  |
| GET | `/api/admin/uploads` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/admin/uploads` | ADMIN (RBAC) | 401 | 403 |  |
| POST | `/api/auth/change-password` | AUTH required | 401 | 400 |  |
| POST | `/api/auth/forgot-password` | PUBLIC | 400 | 400 | rate limit 6/15 min/IP |
| POST | `/api/auth/login` | PUBLIC | 400 | 400 | rate limit 30/15 min/IP; zod validation |
| POST | `/api/auth/logout` | PUBLIC | 200 | 200 |  |
| GET | `/api/auth/me` | AUTH required | 401 | 500 |  |
| POST | `/api/auth/otp/request` | PUBLIC | 400 | 400 | rate limit 6/10 min/IP |
| POST | `/api/auth/otp/verify` | PUBLIC | 400 | 400 | rate limit 12/10 min/IP |
| POST | `/api/auth/refresh` | AUTH required | 401 | 401 |  |
| POST | `/api/auth/register` | PUBLIC | 400 | 400 | rate limit 15/h/IP |
| POST | `/api/auth/resend-verification` | PUBLIC | 400 | 400 |  |
| POST | `/api/auth/reset-password` | PUBLIC | 400 | 400 | rate limit 12/15 min/IP |
| POST | `/api/auth/verify-email` | PUBLIC | 400 | 400 | rate limit 12/10 min/IP (added in audit) |
| POST | `/api/auth/verify-reset-otp` | PUBLIC | 400 | 400 |  |
| DELETE | `/api/carts/` | AUTH required | 401 | 500 |  |
| GET | `/api/carts/` | AUTH required | 401 | 500 |  |
| POST | `/api/carts/` | AUTH required | 401 | 400 |  |
| DELETE | `/api/carts/:productId` | AUTH required | 401 | 500 |  |
| PATCH | `/api/carts/:productId` | AUTH required | 401 | 400 |  |
| GET | `/api/categories/` | PUBLIC | 500 | 500 |  |
| POST | `/api/categories/` | AUTH required | 401 | 403 |  |
| DELETE | `/api/categories/:id` | AUTH required | 401 | 403 |  |
| PATCH | `/api/categories/:id` | AUTH required | 401 | 403 |  |
| GET | `/api/categories/slug/:slug` | PUBLIC | 500 | 500 |  |
| GET | `/api/collections/` | PUBLIC | 500 | 500 |  |
| POST | `/api/collections/` | AUTH required | 401 | 403 |  |
| DELETE | `/api/collections/:id` | AUTH required | 401 | 403 |  |
| PATCH | `/api/collections/:id` | AUTH required | 401 | 403 |  |
| GET | `/api/collections/slug/:slug` | PUBLIC | 500 | 500 |  |
| GET | `/api/coupons/available` | PUBLIC | 500 | 500 | rate limit 60/10 min (added) |
| POST | `/api/coupons/validate` | PUBLIC | 400 | 400 | rate limit 40/10 min (added) |
| DELETE | `/api/customer/account` | AUTH required | 401 | 500 |  |
| GET | `/api/customer/addresses` | AUTH required | 401 | 500 |  |
| POST | `/api/customer/addresses` | AUTH required | 401 | 400 |  |
| GET | `/api/customer/addresses/` | AUTH required | 401 | 500 |  |
| POST | `/api/customer/addresses/` | AUTH required | 401 | 400 |  |
| DELETE | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| DELETE | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| GET | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| GET | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| PATCH | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| PATCH | `/api/customer/addresses/:id` | AUTH required | 401 | 500 |  |
| PATCH | `/api/customer/addresses/:id/default` | AUTH required | 401 | 500 |  |
| PATCH | `/api/customer/addresses/:id/default` | AUTH required | 401 | 500 |  |
| GET | `/api/customer/profile` | AUTH required | 401 | 500 |  |
| PATCH | `/api/customer/profile` | AUTH required | 401 | 500 |  |
| GET | `/api/health` | PUBLIC | 200 | 200 | public, no data |
| GET | `/api/homepage/` | PUBLIC | 500 | 500 |  |
| GET | `/api/marketing/featured-collection` | PUBLIC | 500 | 500 |  |
| GET | `/api/marketing/promotional-banner` | PUBLIC | 500 | 500 |  |
| GET | `/api/notifications/` | AUTH required | 401 | 500 |  |
| PATCH | `/api/notifications/:id/read` | AUTH required | 401 | 500 |  |
| PATCH | `/api/notifications/read-all` | AUTH required | 401 | 500 |  |
| GET | `/api/notifications/unread-count` | AUTH required | 401 | 500 |  |
| POST | `/api/orders/` | PUBLIC | 400 | 400 | guest allowed; rate limit 20/h/IP (added); server recomputes prices/totals/coupon; format validation (added) |
| GET | `/api/orders/:id` | AUTH required | 401 | 401 | requires per-order access token (256-bit); rate limit 120/10 min |
| GET | `/api/orders/my-orders` | AUTH required | 401 | 500 |  |
| GET | `/api/orders/my-orders/:id` | AUTH required | 401 | 500 |  |
| POST | `/api/orders/my-orders/:id/send-invoice` | AUTH required | 401 | 500 |  |
| POST | `/api/payments/bank-upi/claim` | PUBLIC | 404 | 500 | order access token or owner; rate limit |
| POST | `/api/payments/bank-upi/resend-bill` | PUBLIC | 404 | 500 | order access token or owner; cooldown + rate limit |
| POST | `/api/payments/cancel` | PUBLIC | 400 | 400 | order access token; rate limit |
| POST | `/api/payments/razorpay/order` | PUBLIC | 400 | 400 | order access token; rate limit 60/15 min (added); amount from DB |
| POST | `/api/payments/razorpay/verify` | PUBLIC | 400 | 400 | HMAC signature verified server-side; idempotent |
| POST | `/api/payments/razorpay/webhook` | PUBLIC | 400 | 400 | HMAC signature over raw body; idempotent |
| GET | `/api/products/` | PUBLIC | 500 | 500 |  |
| POST | `/api/products/` | AUTH required | 401 | 403 |  |
| DELETE | `/api/products/:id` | AUTH required | 401 | 403 |  |
| GET | `/api/products/:id` | PUBLIC | 500 | 500 |  |
| PATCH | `/api/products/:id` | AUTH required | 401 | 403 |  |
| GET | `/api/products/:id/social-proof` | PUBLIC | 500 | 500 |  |
| POST | `/api/products/:id/stock-alert` | PUBLIC | 400 | 400 | rate limit 10/h (added) |
| GET | `/api/products/insights` | PUBLIC | 200 | 200 |  |
| GET | `/api/products/slug/:slug` | PUBLIC | 500 | 500 |  |
| GET | `/api/returns/` | AUTH required | 401 | 500 |  |
| POST | `/api/returns/` | PUBLIC | 400 | 400 | rate limit 10/h (added) |
| GET | `/api/returns/:requestNumber` | PUBLIC | 403 | 403 | requires access token; rate limit 60/10 min (added) |
| POST | `/api/reviews/` | AUTH required | 401 | 400 |  |
| DELETE | `/api/reviews/:id` | AUTH required | 401 | 500 |  |
| PATCH | `/api/reviews/:id` | AUTH required | 401 | 400 |  |
| GET | `/api/reviews/featured` | PUBLIC | 500 | 500 |  |
| POST | `/api/reviews/media` | AUTH required | 401 | 400 |  |
| GET | `/api/reviews/mine` | AUTH required | 401 | 500 |  |
| GET | `/api/reviews/product/:productId` | PUBLIC | 500 | 500 |  |
| GET | `/api/reviews/product/:productId/eligibility` | AUTH required | 401 | 500 |  |