import type { Metadata } from "next";

import { AccountCoupons } from "@/components/account/account-coupons";

export const metadata: Metadata = {
  title: "My Coupons",
  robots: { index: false, follow: false },
};

export default function CouponsPage() {
  return <AccountCoupons />;
}
