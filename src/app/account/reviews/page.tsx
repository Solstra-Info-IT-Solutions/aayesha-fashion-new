import type { Metadata } from "next";

import { AccountReviews } from "@/components/account/account-reviews";

export const metadata: Metadata = {
  title: "My Reviews",
  robots: { index: false, follow: false },
};

export default function ReviewsPage() {
  return <AccountReviews />;
}
