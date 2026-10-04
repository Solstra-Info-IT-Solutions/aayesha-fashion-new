import { AnnouncementBar } from "@/components/layout/announcement-bar";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { WhatsAppBubble } from "@/components/common/whats-app-bubble";
import { QuickHelp } from "@/components/common/quick-help";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)] antialiased">
      <AnnouncementBar />

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
        <div className="w-full">
          {children}
        </div>

        <CookieConsent />
      </main>

      <Footer />

      <QuickHelp />

      <WhatsAppBubble />
    </div>
  );
}