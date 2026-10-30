# Mobile-number login and the store order alert

> **Login OTP by SMS (Pearl SMS)** is now the first real channel: when `PEARLSMS_API_KEY` is set on the backend the customer gets a 6-digit OTP by SMS (valid 5 minutes). See `docs/SMS_OTP_PEARLSMS.md` in the backend repo. Mode order: test OTP > SMS > WhatsApp > Firebase.
>
> **Order details on WhatsApp:** when the customer presses *Place Order*, a WhatsApp tab opens on **8237423742** with the full order (order no., payment, customer, address, every item with SKU/qty/price, discounts, shipping, total) already typed in; the success page also has a *Send order details on WhatsApp* button. Change the number with `NEXT_PUBLIC_ORDER_WHATSAPP_NUMBER` (91 + 10 digits). This is a click-to-chat link, so the message is sent from the customer's own WhatsApp when they press send; automatic sending needs the WhatsApp Cloud API (see `WHATSAPP_META_SETUP.md`).

> **WhatsApp is now the main OTP channel.** Set it up with the backend guide `docs/WHATSAPP_META_SETUP.md` (aayesha-fashion-backend): Meta keys, templates, webhook callback URL and env vars. The login screen picks the mode from the backend: test OTP → WhatsApp → Firebase SMS.

## What changed
- The only way to log in is **mobile number + OTP**. There is no sign-up, password, forgot-password or email-verification screen (those URLs redirect to `/login`).
- The first successful login creates the account. Name, email, birthday and so on are added later in **Edit account** (new customers are sent there after their first login). The mobile number is the login, so it cannot be edited; the email is optional and can be verified from the profile.
- Admin login (email + password) in the admin panel is unchanged.

## Test mode (OTP 123456)
The backend decides the mode (`GET /api/auth/mobile/config`):
- Outside production it is **on by default**: any valid mobile number logs in with `123456`, no SMS is sent.
- On Render (`NODE_ENV=production`) set `MOBILE_AUTH_TEST_MODE=true` to test. **Turn it off (remove the variable or set `false`) before launch** — while it is on, anyone can log in to any customer's account with `123456`.

## Real SMS OTP with Firebase
The Firebase project **`aayesha-fashion`** exists. Its web config was checked against Google: it is valid, and the authorized domains are `localhost`, `aayesha-fashion.firebaseapp.com`, `aayesha-fashion.web.app` and `aayesha-fashion-new.vercel.app`. **Add `aayeshafashion.in` (and `www.`) once the domain is attached.** Whether the **Phone** sign-in provider is switched on could not be confirmed from here — check it in the console (step 2 below).

Values to set (the API key is a public web key, but it is kept out of the repo; copy it from Firebase → Project settings → Your apps):

| Where | Variable | Value |
|---|---|---|
| Vercel (storefront) | `NEXT_PUBLIC_FIREBASE_API_KEY` | the web `apiKey` |
| Vercel | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `aayesha-fashion.firebaseapp.com` |
| Vercel | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `aayesha-fashion` |
| Vercel | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:365198237786:web:b347500170e39fdca3b863` |
| Render (backend) | `FIREBASE_PROJECT_ID` | `aayesha-fashion` |
| Render | `MOBILE_AUTH_TEST_MODE` | `false` (real SMS) or `true` (OTP 123456) |

Restrict the API key in Google Cloud Console → APIs & Services → Credentials → HTTP referrers (the Vercel and live domains) so it cannot be used from other sites.

Setup steps, if the project is ever recreated:
1. https://console.firebase.google.com → Add project → (e.g. `aayesha-fashion`).
2. Build → **Authentication** → Get started → Sign-in method → enable **Phone**.
3. Authentication → Settings → **Authorized domains**: add the storefront domains (the Vercel domain and `aayeshafashion.in`).
4. Project settings → Your apps → add a **Web app** → copy `apiKey`, `authDomain`, `projectId`, `appId`.
5. Vercel (storefront) env: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`. Redeploy.
6. Render (backend) env: `FIREBASE_PROJECT_ID=<projectId>` and `MOBILE_AUTH_TEST_MODE=false`. No service-account key is needed: the backend verifies Firebase's signed tokens against Google's public certificates.
7. Sending SMS to Indian numbers can need Firebase's pay-as-you-go (Blaze) plan; check the console for the current terms. Firebase also lets you list **test phone numbers with fixed codes** (Authentication → Sign-in method → Phone) if you want to test the real flow without sending SMS.

## Order alert on WhatsApp (testing)
Every new order sends its full details (order number, time, payment method and status, customer name/phone/email, delivery address, every item with SKU, quantity and price, discounts, shipping, total) to **8237423742** (`ORDER_ALERT_WHATSAPP_NUMBER`, default `918237423742`). It is sent once per order and never delays or fails the customer's order; failures are only logged.

It needs the WhatsApp Cloud API credentials on Render (`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`). Without them the alert is skipped and a warning is logged.

WhatsApp only delivers a plain text message if that number messaged the business number in the last 24 hours. To reach it at any time, create this **Utility** template in Meta WhatsApp Manager (language `en`) and set `WHATSAPP_ORDER_ALERT_TEMPLATE_NAME` to its name:

```
New order {{1}} received.

Customer: {{2}}
Phone: {{3}}
Email: {{4}}

Delivery address: {{5}}

Items: {{6}}

Payment: {{7}}
Amount: {{8}}
```

Variables are filled in this order: 1 order number, 2 customer name, 3 customer phone, 4 customer email, 5 delivery address, 6 items, 7 payment method and status, 8 subtotal / discounts / shipping / total.

## Not verified yet
Real Firebase SMS and the real WhatsApp delivery could not be exercised without the client's Firebase project and Meta credentials. Both paths are covered by automated tests with the external services mocked.
