import { CheckoutPage } from "@/components/checkout/checkout-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};


export default function CheckoutRoute() {
  return <CheckoutPage />;
}