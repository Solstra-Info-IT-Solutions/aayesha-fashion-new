import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { WhatsAppBubble } from "@/components/common/whats-app-bubble";
import { QuickHelp } from "@/components/common/quick-help";
import { AccountShell } from "@/components/account/account-shell";

/*
 * The account area shares the storefront chrome (header, footer,
 * floating help) and adds its own sidebar.
 */
export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)] antialiased">
      <Header />

      <main
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          bg-[var(--color-canvas)]
          pt-[64px]
          sm:pt-[68px]
          md:pt-[72px]
          lg:pt-[76px]
        "
      >
        <AccountShell>{children}</AccountShell>

        <CookieConsent />
      </main>

      <Footer />

      <QuickHelp />

      <WhatsAppBubble />
    </div>
  );
}
