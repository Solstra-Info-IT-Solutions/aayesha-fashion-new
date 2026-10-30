import { siteConfig } from "../config/site";

/** Everything the message needs. `OrderDetails` from the API satisfies it. */
export interface OrderWhatsAppInput {
  orderNumber: string;
  createdAt?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  items: Array<{
    name: string;
    sku?: string;
    /** Product image (absolute URL, or a path on this site). */
    image?: string;
    quantity: number;
    sellingPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  productDiscount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingAmount: number;
  total: number;
}

const PAYMENT_LABEL: Record<string, string> = {
  cod: "Cash on Delivery",
  online: "Online payment",
  bank_upi: "UPI / bank transfer",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

const MAX_ITEMS_LISTED = 30;

const rupees = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const clean = (value: unknown) => String(value ?? "").trim();

/**
 * click-to-chat cannot attach a picture, so each item carries a link to its image: it opens
 * on tap and WhatsApp previews the first link.
 */
export function absoluteImageUrl(image: string | undefined): string {
  const value = clean(image);

  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;

  return `${siteConfig.url}${value.startsWith("/") ? "" : "/"}${value}`;
}

/** 91 + 10 digits, from however the number was written. */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  return digits.length === 10 ? `91${digits}` : digits;
}

/**
 * A readable, template-style order summary: sections with WhatsApp *bold* headings.
 */
export function buildOrderWhatsAppMessage(order: OrderWhatsAppInput): string {
  const a = order.shippingAddress;

  const placed = new Date(order.createdAt ?? Date.now()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const addressLines = [
    [clean(a.firstName), clean(a.lastName)].filter(Boolean).join(" "),
    clean(a.addressLine1),
    clean(a.addressLine2),
    clean(a.landmark) ? `Landmark: ${clean(a.landmark)}` : "",
    `${[clean(a.city), clean(a.state)].filter(Boolean).join(", ")} - ${clean(a.postalCode)}`,
    clean(a.country),
  ].filter(Boolean);

  const listed = order.items.slice(0, MAX_ITEMS_LISTED);

  const itemLines = listed.flatMap((item, index) => {
    const image = absoluteImageUrl(item.image);

    return [
      `${index + 1}. ${clean(item.name)}${item.sku ? ` (SKU: ${clean(item.sku)})` : ""}`,
      `    ${item.quantity} x ${rupees(item.sellingPrice)} = ${rupees(item.lineTotal)}`,
      ...(image ? [`    Image: ${image}`] : []),
    ];
  });

  if (order.items.length > listed.length) {
    itemLines.push(`+ ${order.items.length - listed.length} more item(s)`);
  }

  const bill = [
    `Subtotal: ${rupees(order.subtotal)}`,
    order.productDiscount > 0 ? `Product discount: -${rupees(order.productDiscount)}` : "",
    order.couponDiscount > 0
      ? `Coupon${order.couponCode ? ` (${clean(order.couponCode)})` : ""}: -${rupees(order.couponDiscount)}`
      : "",
    `Shipping: ${order.shippingAmount > 0 ? rupees(order.shippingAmount) : "Free"}`,
  ].filter(Boolean);

  return [
    "*NEW ORDER - Aayesha Fashion*",
    "--------------------------------",
    `*Order No:* ${order.orderNumber}`,
    `*Placed on:* ${placed}`,
    `*Payment:* ${PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod} (${PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus})`,
    `*Delivery:* ${order.deliveryMethod === "express" ? "Express" : "Standard"}`,
    "",
    "*CUSTOMER*",
    `Name: ${clean(order.customerName)}`,
    `Phone: ${clean(order.customerPhone)}`,
    `Email: ${clean(order.customerEmail) || "-"}`,
    "",
    "*DELIVERY ADDRESS*",
    ...addressLines,
    "",
    `*ITEMS (${order.items.length})*`,
    ...itemLines,
    "",
    "*BILL*",
    ...bill,
    `*TOTAL: ${rupees(order.total)}*`,
  ].join("\n");
}

export function orderWhatsAppUrl(
  order: OrderWhatsAppInput,
  number: string = siteConfig.orderWhatsapp.number,
): string {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(
    buildOrderWhatsAppMessage(order),
  )}`;
}
