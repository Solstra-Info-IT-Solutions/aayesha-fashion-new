# REQUIREMENTS_GAP_ANALYSIS

Existing implementation compared with what a production fashion store needs. Business behaviour that is not defined by the client is marked **REQUIRES CLIENT CONFIRMATION** — nothing has been invented.

## G1. Product sizes / colours

- **Current behaviour:** The product page has no size or colour selector. A product has one price and one stock number. The "Sizes" and "Colors" masters exist in the admin catalogue but are not attached to purchasable variants.
- **Expected behaviour:** Garments are usually sold by size (and sometimes colour) with stock per size, and the customer must choose before adding to the bag.
- **Missing information:** Whether sizes/colours are sold, whether tailoring is made-to-measure, size charts
- **Risk:** Customers cannot specify size → wrong items, returns, support load
- **Blocking production?** YES (if sizes are sold)
- **Recommended action:** REQUIRES CLIENT CONFIRMATION. If sizes are needed this is a feature build (variant model, per-size stock, cart/order line, admin UI), not a bug fix.

## G2. Shipping charges and free-shipping threshold

- **Current behaviour:** Backend constants: standard ₹99, express ₹199, free standard shipping at ₹2,999. Storefront promo text repeats ₹2,999.
- **Expected behaviour:** Client-defined shipping rules.
- **Missing information:** Charges, threshold, zones, express availability
- **Risk:** Wrong charges are shown to every customer
- **Blocking production?** YES
- **Recommended action:** Client to confirm the rule; then move the values into admin-editable settings (small change) so they never need a code release.

## G3. Cancellation policy

- **Current behaviour:** No cancellation-policy page exists. Customers can only cancel while a Bank/UPI payment is still pending (auto-cancel after the hold time). A customer cannot cancel a paid order from the site.
- **Expected behaviour:** Clear rules and (if allowed) a self-service cancel before dispatch.
- **Missing information:** Whether cancellation is allowed, until when, fees, how a customer requests it
- **Risk:** Disputes, chargebacks, unclear expectations
- **Blocking production?** YES
- **Recommended action:** REQUIRES CLIENT CONFIRMATION; then add a policy page and, if wanted, a "Request cancellation" action.

## G4. GST / tax invoice

- **Current behaviour:** Prices are tax-inclusive. The invoice shows a GSTIN field but no per-line tax, HSN or tax split.
- **Expected behaviour:** A compliant GST tax invoice if the business is GST-registered.
- **Missing information:** Registration status, GSTIN, rates, HSN, invoice format
- **Risk:** Invoices may not be legally valid
- **Blocking production?** YES (if GST registered)
- **Recommended action:** REQUIRES CLIENT CONFIRMATION with the client's accountant.

## G5. Transactional email

- **Current behaviour:** Order confirmation and shipping emails are not sent at all (only OTP / verification, stock-alert and cart-reminder emails exist). In production, SMTP must be configured or verification / reset / OTP emails fail.
- **Expected behaviour:** Order confirmation emails, shipping updates, and a working mail server.
- **Missing information:** SMTP provider + sender domain; decision on which order emails are wanted (WhatsApp bill and invoice already exist)
- **Risk:** No email proof of purchase; sign-up verification impossible without SMTP
- **Blocking production?** YES (SMTP)
- **Recommended action:** Client supplies SMTP. Recommended next feature: order-confirmation email using the existing invoice PDF.

## G6. Newsletter sign-up

- **Current behaviour:** The email box accepted an address, showed "Welcome" and discarded the address — nothing was stored.
- **Expected behaviour:** Real opt-in.
- **Missing information:** Which tool (Mailchimp / Brevo / WhatsApp list)
- **Risk:** Customers believed they had subscribed
- **Blocking production?** NO
- **Recommended action:** FIXED in this audit: the box is replaced by a "Join on WhatsApp" button (a real opt-in). Client to choose an email tool if they want email newsletters.

## G7. Guest order tracking

- **Current behaviour:** After checkout a guest can open the order only while the browser tab keeps the secure token. Reopening the link later shows "Order unavailable". There is no "track my order by number + phone".
- **Expected behaviour:** Guests should be able to find their order again.
- **Missing information:** Decision to add lookup by order number + phone/email
- **Risk:** Support calls; poor experience
- **Blocking production?** NO
- **Recommended action:** Recommended small feature; REQUIRES CLIENT CONFIRMATION of priority.

## G8. Order cancellation / returns self-service

- **Current behaviour:** Return requests exist (customer + admin). Exchange service exists in the backend. Rules (window, conditions) are not configured by the client.
- **Expected behaviour:** Policy-driven returns.
- **Missing information:** Return window, reasons, shipping cost responsibility, refund timing
- **Risk:** Rules cannot be enforced; admin decides manually
- **Blocking production?** YES
- **Recommended action:** REQUIRES CLIENT CONFIRMATION.

## G9. Online payments

- **Current behaviour:** Razorpay integration is implemented but switched off (flag + keys missing). The store takes payment via a UPI/bank bill sent on WhatsApp and confirms it manually after the customer sends proof.
- **Expected behaviour:** Client decision between manual UPI/bank confirmation and an online gateway.
- **Missing information:** Gateway keys and KYC, or confirmation that manual payment is the intended model
- **Risk:** Manual confirmation is slow and error-prone at volume
- **Blocking production?** NO
- **Recommended action:** REQUIRES CLIENT CONFIRMATION. If online payments are enabled, a full payment test with live-mode test cards is mandatory (BLOCKED here: no credentials).

## G10. Courier / tracking integration

- **Current behaviour:** Tracking details are typed by an admin per order. No courier API.
- **Expected behaviour:** Automatic tracking updates.
- **Missing information:** Courier partner
- **Risk:** Manual work
- **Blocking production?** NO
- **Recommended action:** Optional improvement.

## G11. Error monitoring and alerting

- **Current behaviour:** No error-tracking service (Sentry or similar) and no uptime monitor configured. Render logs only.
- **Expected behaviour:** Know about production errors before customers report them.
- **Missing information:** Account / budget for monitoring
- **Risk:** Silent failures
- **Blocking production?** NO
- **Recommended action:** Recommended before launch: add Sentry (free tier) and an uptime check on /api/health.

## G12. Backups and recovery

- **Current behaviour:** Database is MongoDB Atlas; the plan and backup schedule are not visible from the code. Free (M0) clusters have no backups.
- **Expected behaviour:** Tested recovery plan.
- **Missing information:** Atlas tier, backup frequency, restore owner
- **Risk:** Total data loss risk
- **Blocking production?** YES
- **Recommended action:** REQUIRES CLIENT CONFIRMATION (cost) — see PRODUCTION_READINESS_CHECKLIST.

## G13. Hosting performance

- **Current behaviour:** Backend runs on Render's free plan: the service sleeps after idle and the first request can take ~50 seconds.
- **Expected behaviour:** Always-on API.
- **Missing information:** Approval of a paid plan
- **Risk:** First visitor after idle sees a long delay or an error
- **Blocking production?** YES
- **Recommended action:** Upgrade the Render plan (or keep-alive as a stop-gap).

## G14. Admin two-factor authentication

- **Current behaviour:** None. Admin login is email + password with rate limiting.
- **Expected behaviour:** Optional hardening for owner accounts.
- **Missing information:** Decision
- **Risk:** Account takeover risk if a password leaks
- **Blocking production?** NO
- **Recommended action:** Recommended later; strong unique passwords now.

## G15. Content for legal pages

- **Current behaviour:** Drafted by the developer; dated September 2026; contain business terms the client has not confirmed.
- **Expected behaviour:** Client / lawyer approved text.
- **Missing information:** Approvals (see client requirements N–S)
- **Risk:** Legal exposure
- **Blocking production?** YES
- **Recommended action:** REQUIRES CLIENT CONFIRMATION.

## G16. Real catalogue and imagery

- **Current behaviour:** The storefront shows test products; hero images are low-resolution and contain baked-in text; the logo is the earlier pink mark.
- **Expected behaviour:** Final content.
- **Missing information:** See client requirements C, D, H, I
- **Risk:** Store looks unfinished
- **Blocking production?** YES
- **Recommended action:** Client supplies assets.
