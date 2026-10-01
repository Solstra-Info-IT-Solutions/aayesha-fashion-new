import { ProfileDetails } from "@/components/account/profile-details";
import { AccountOffers } from "@/components/orders-sales/account-offers";
import { ProductStrip } from "@/components/orders-sales/product-strip";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <>
      <ProfileDetails />

      <AccountOffers />

      <ProductStrip
        eyebrow="Picked for you"
        title="Customer favourites"
      />
    </>
  );
}
