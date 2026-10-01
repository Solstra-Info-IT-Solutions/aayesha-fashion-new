import { CartContent } from "@/components/cart/cart-content";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag",
  robots: { index: false, follow: false },
};


export default function CartPage() {
  return <CartContent />;
}