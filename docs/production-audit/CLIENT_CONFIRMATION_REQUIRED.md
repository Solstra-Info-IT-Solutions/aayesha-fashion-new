# CLIENT_CONFIRMATION_REQUIRED

Decisions the developer must not guess. Each needs an answer from the client before launch (or an explicit "leave as is").

## C1. Product sizes and colours are not selectable

- **Issue:** Product sizes and colours are not selectable
- **Current behavior:** The product page has no size/colour choice; one stock figure per product.
- **Possible options:** (a) Free-size / made-to-measure only — no change; (b) sizes with per-size stock and a size chart (feature build); (c) sizes as free text note at checkout (stop-gap).
- **Recommended option:** (b) if garments come in standard sizes; (a) if everything is stitched to order.
- **Why client confirmation is required:** Changes what a customer buys and how stock is counted; only the client knows the business model.
- **Production blocking:** YES

## C2. Shipping charges and free-shipping threshold

- **Issue:** Shipping charges and free-shipping threshold
- **Current behavior:** Standard ₹99, express ₹199, free standard shipping above ₹2,999 (developer defaults).
- **Possible options:** Keep as is; change values; free shipping for all; zone-based charges.
- **Recommended option:** Confirm the real rule, then make it admin-editable.
- **Why client confirmation is required:** These are commercial decisions that directly change what customers pay.
- **Production blocking:** YES

## C3. Cancellation rules

- **Issue:** Cancellation rules
- **Current behavior:** No policy page. Customers cannot cancel a paid order from the site.
- **Possible options:** No cancellations after payment; cancel until dispatch via support; self-service cancel button before dispatch.
- **Recommended option:** Cancel until dispatch via WhatsApp/support, documented in a policy page.
- **Why client confirmation is required:** Affects refunds, stock and legal terms.
- **Production blocking:** YES

## C4. Return / exchange / refund rules

- **Issue:** Return / exchange / refund rules
- **Current behavior:** Return module exists but window, eligibility and refund timing are not configured by the client.
- **Possible options:** 7-day / 10-day / 14-day windows; exchange-only for custom pieces.
- **Recommended option:** Client to set; publish on the returns page.
- **Why client confirmation is required:** Binding commercial and legal promise.
- **Production blocking:** YES

## C5. GST and tax invoice format

- **Issue:** GST and tax invoice format
- **Current behavior:** Tax-inclusive prices; invoice has a GSTIN field only.
- **Possible options:** Keep simple invoice; full GST tax invoice with HSN and CGST/SGST/IGST split.
- **Recommended option:** Full GST invoice if registered (accountant to specify).
- **Why client confirmation is required:** Legal compliance depends on registration status.
- **Production blocking:** YES

## C6. Payment model

- **Issue:** Payment model
- **Current behavior:** Manual UPI/bank bill on WhatsApp is live; Razorpay is implemented but off.
- **Possible options:** Manual only; Razorpay only; both.
- **Recommended option:** Both, with Razorpay enabled after live-mode tests.
- **Why client confirmation is required:** Needs client KYC and a business decision about fees and refunds.
- **Production blocking:** NO

## C7. Cash on delivery

- **Issue:** Cash on delivery
- **Current behavior:** Off.
- **Possible options:** Enable with a COD fee / limit; keep off.
- **Recommended option:** Keep off until courier arrangement is confirmed.
- **Why client confirmation is required:** Operational and risk decision (fake / returned orders).
- **Production blocking:** NO

## C8. Newsletter tool

- **Issue:** Newsletter tool
- **Current behavior:** Fake email box replaced by a WhatsApp opt-in (this audit).
- **Possible options:** Keep WhatsApp; add Mailchimp/Brevo; custom subscriber list.
- **Recommended option:** Keep WhatsApp for now; choose an email tool later.
- **Why client confirmation is required:** Needs an account and consent wording.
- **Production blocking:** NO

## C9. Guest order lookup

- **Issue:** Guest order lookup
- **Current behavior:** Guests lose access to the order page when the browser tab closes.
- **Possible options:** Do nothing; add "Track order" by number + phone; email a secure link.
- **Recommended option:** Track order by number + phone.
- **Why client confirmation is required:** Small feature affecting support load; client priority.
- **Production blocking:** NO

## C10. Order emails

- **Issue:** Order emails
- **Current behavior:** Only OTP / stock-alert / cart-reminder emails exist.
- **Possible options:** WhatsApp only; add order-confirmation / shipped emails.
- **Recommended option:** Add confirmation + shipped emails once SMTP is live.
- **Why client confirmation is required:** Needs SMTP and wording approval.
- **Production blocking:** NO

## C11. Admin 2FA

- **Issue:** Admin 2FA
- **Current behavior:** Not implemented.
- **Possible options:** Leave; add TOTP; add email OTP.
- **Recommended option:** Add later; use strong unique passwords now.
- **Why client confirmation is required:** Security vs convenience for the owner.
- **Production blocking:** NO

## C12. Order number format

- **Issue:** Order number format
- **Current behavior:** AY + 10 digits of time + 4 random digits (now cryptographically random).
- **Possible options:** Keep; shorter human-friendly numbers (e.g. AF-10234).
- **Recommended option:** Keep for now.
- **Why client confirmation is required:** Customers quote it; changing it affects admin search and existing orders.
- **Production blocking:** NO

## C13. Return of low-stock holds

- **Issue:** Return of low-stock holds
- **Current behavior:** Stock is taken when an order is created and returned if an unpaid Bank/UPI order expires (30 min).
- **Possible options:** Longer / shorter hold; manual release.
- **Recommended option:** Keep 30 minutes.
- **Why client confirmation is required:** Affects how long a customer has to pay before the item is released.
- **Production blocking:** NO

## C14. Indexing go-live switch

- **Issue:** Indexing go-live switch
- **Current behavior:** Search engines are blocked by default.
- **Possible options:** Turn on at launch (developer sets NEXT_PUBLIC_ALLOW_INDEXING=true).
- **Recommended option:** Turn on only after the real domain and content are live.
- **Why client confirmation is required:** Premature indexing of test content would harm SEO.
- **Production blocking:** YES
