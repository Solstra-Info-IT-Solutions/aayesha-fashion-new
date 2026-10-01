import { apiFetch } from "@/lib/api";

export interface RazorpayOrderData {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function createRazorpayOrder(
  orderNumber: string,
  accessToken: string,
) {
  return apiFetch<RazorpayOrderData>(
    "/payments/razorpay/order",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, accessToken }),
    },
  );
}

export function verifyRazorpayPayment(input: {
  orderNumber: string;
  accessToken: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return apiFetch<{ orderNumber: string; paymentStatus: string }>(
    "/payments/razorpay/verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
}

export function cancelUnpaidOrder(
  orderNumber: string,
  accessToken: string,
  reason: string,
) {
  return apiFetch<{ orderNumber: string; status: string }>(
    "/payments/cancel",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, accessToken, reason }),
    },
  );
}

/* ============================================================
   RAZORPAY CHECKOUT.JS
============================================================ */

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: {
      error?: { description?: string };
    }) => void,
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type RazorpayResult =
  | { status: "paid"; response: RazorpaySuccess }
  | { status: "dismissed" }
  | { status: "failed"; message: string };

/** Opens the Razorpay modal and resolves once the customer finishes. */
export async function openRazorpayCheckout(
  data: RazorpayOrderData,
): Promise<RazorpayResult> {
  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    return {
      status: "failed",
      message:
        "Unable to load the payment window. Check your connection and try again.",
    };
  }

  const Razorpay = window.Razorpay;

  return new Promise<RazorpayResult>((resolve) => {
    const instance = new Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,
      name: "AAYESHA FASHION",
      description: `Order ${data.orderNumber}`,
      prefill: {
        name: data.customerName,
        email: data.customerEmail,
        contact: data.customerPhone,
      },
      theme: { color: "#111111" },
      handler: (response) =>
        resolve({ status: "paid", response }),
      modal: {
        ondismiss: () => resolve({ status: "dismissed" }),
      },
    });

    instance.on("payment.failed", (response) => {
      // Customer can retry inside the modal; only report if it is closed.
      console.error("Razorpay payment failed:", response?.error);
    });

    instance.open();
  });
}

/* ============================================================
   BANK / UPI VIA WHATSAPP
============================================================ */

/**
 * `publicAccessToken` is used right after checkout / for guests; a
 * signed-in owner can pass only `authToken`.
 */
export function claimBankUpiPayment(input: {
  orderNumber: string;
  reference: string;
  publicAccessToken?: string | null;
  authToken?: string | null;
}) {
  return apiFetch<{ orderNumber: string; paymentClaimedAt: string }>(
    "/payments/bank-upi/claim",
    {
      method: "POST",
      ...(input.authToken ? { accessToken: input.authToken } : {}),
      body: JSON.stringify({
        orderNumber: input.orderNumber,
        reference: input.reference,
        accessToken: input.publicAccessToken ?? "",
      }),
    },
  );
}

export function resendBankUpiBill(input: {
  orderNumber: string;
  publicAccessToken?: string | null;
  authToken?: string | null;
}) {
  return apiFetch<{ sent: true }>("/payments/bank-upi/resend-bill", {
    method: "POST",
    ...(input.authToken ? { accessToken: input.authToken } : {}),
    body: JSON.stringify({
      orderNumber: input.orderNumber,
      accessToken: input.publicAccessToken ?? "",
    }),
  });
}

/** Sends the invoice of a paid order to the customer's WhatsApp. */
export function sendMyInvoice(orderNumber: string, authToken: string) {
  return apiFetch<{ sent: true }>(
    `/orders/my-orders/${encodeURIComponent(orderNumber)}/send-invoice`,
    { method: "POST", accessToken: authToken },
  );
}
