import { expect, test } from "@playwright/test";

import {
  buildOrderWhatsAppMessage,
  normalizeWhatsAppNumber,
  orderWhatsAppUrl,
  type OrderWhatsAppInput,
} from "../src/lib/order-whatsapp";

const order: OrderWhatsAppInput = {
  orderNumber: "AF-241030-4821",
  createdAt: "2026-10-30T08:30:00.000Z",
  customerName: "Aisha Khan",
  customerEmail: "aisha@example.com",
  customerPhone: "9876543210",
  shippingAddress: {
    firstName: "Aisha",
    lastName: "Khan",
    addressLine1: "12 Rose Lane",
    addressLine2: "Model Town",
    landmark: "Near park",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110009",
    country: "India",
  },
  deliveryMethod: "standard",
  paymentMethod: "bank_upi",
  paymentStatus: "pending",
  items: [
    { name: "Ivory Noor Kurta Set", sku: "AF-KS-01", image: "https://res.cloudinary.com/demo/image/upload/v1/kurta-set.jpg", quantity: 2, sellingPrice: 4999, lineTotal: 9998 },
    { name: "Festive Dupatta", sku: "AF-DP-07", image: "/images/products/dupatta.jpg", quantity: 1, sellingPrice: 1499, lineTotal: 1499 },
  ],
  subtotal: 11497,
  productDiscount: 500,
  couponCode: "WELCOME10",
  couponDiscount: 1000,
  shippingAmount: 0,
  total: 9997,
};

test.describe("order details on WhatsApp", () => {
  test("the message lists the order, customer, address, every item, payment and the bill", () => {
    const text = buildOrderWhatsAppMessage(order);

    for (const expected of [
      "*NEW ORDER - Aayesha Fashion*",
      "*Order No:* AF-241030-4821",
      "30 Oct 2026",
      "UPI / bank transfer (Pending)",
      "*Delivery:* Standard",
      "Name: Aisha Khan",
      "Phone: 9876543210",
      "Email: aisha@example.com",
      "12 Rose Lane",
      "Model Town",
      "Landmark: Near park",
      "Delhi, Delhi - 110009",
      "India",
      "*ITEMS (2)*",
      "1. Ivory Noor Kurta Set (SKU: AF-KS-01)",
      "2 x ₹4,999 = ₹9,998",
      "Image: https://res.cloudinary.com/demo/image/upload/v1/kurta-set.jpg",
      "Image: https://aayeshafashion.in/images/products/dupatta.jpg",
      "2. Festive Dupatta (SKU: AF-DP-07)",
      "Subtotal: ₹11,497",
      "Product discount: -₹500",
      "Coupon (WELCOME10): -₹1,000",
      "Shipping: Free",
      "*TOTAL: ₹9,997*",
    ]) {
      expect(text, `missing: ${expected}`).toContain(expected);
    }
  });

  test("the link opens WhatsApp on the client's number with the message encoded", () => {
    const url = orderWhatsAppUrl(order);
    const [base, query] = url.split("?text=");

    expect(base).toBe("https://wa.me/918237423742");
    expect(decodeURIComponent(query!)).toBe(buildOrderWhatsAppMessage(order));
    expect(query).not.toContain("\n");
  });

  test("an item without a picture simply has no image line", () => {
    const text = buildOrderWhatsAppMessage({ ...order, items: [{ name: "Plain", quantity: 1, sellingPrice: 100, lineTotal: 100 }] });

    expect(text).toContain("1. Plain");
    expect(text).not.toContain("Image:");
  });

  test("numbers are normalised to 91 + 10 digits", () => {
    expect(normalizeWhatsAppNumber("8237423742")).toBe("918237423742");
    expect(normalizeWhatsAppNumber("+91 82374 23742")).toBe("918237423742");
    expect(normalizeWhatsAppNumber("918237423742")).toBe("918237423742");
  });

  test("a very long cart is trimmed but the totals are kept", () => {
    const many = {
      ...order,
      items: Array.from({ length: 45 }, (_, i) => ({
        name: `Embroidered Anarkali Set ${i + 1}`, sku: `SKU-${i}`, quantity: 1, sellingPrice: 2999, lineTotal: 2999,
      })),
    };

    const text = buildOrderWhatsAppMessage(many);

    expect(text).toContain("*ITEMS (45)*");
    expect(text).toContain("+ 15 more item(s)");
    expect(text).toContain("*TOTAL: ₹9,997*");
  });

  test("a paid order with a shipping charge and no coupon says so", () => {
    const text = buildOrderWhatsAppMessage({
      ...order, paymentMethod: "online", paymentStatus: "paid", couponCode: undefined,
      couponDiscount: 0, productDiscount: 0, shippingAmount: 99, deliveryMethod: "express",
    });

    expect(text).toContain("Online payment (Paid)");
    expect(text).toContain("*Delivery:* Express");
    expect(text).toContain("Shipping: ₹99");
    expect(text).not.toContain("Coupon");
    expect(text).not.toContain("Product discount");
  });
});
