import type { Metadata } from "next";

import { AccountNotifications } from "@/components/account/account-notifications";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return <AccountNotifications />;
}
