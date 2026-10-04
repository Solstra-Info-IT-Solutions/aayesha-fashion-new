import { AnnouncementBar } from "@/components/layout/announcement-bar";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { WhatsAppBubble } from "@/components/common/whats-app-bubble";
import { QuickHelp } from "@/components/common/quick-help";
import { Toaster } from "react-hot-toast";

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

      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3200,
          style: {
            background: "#1c1916",
            color: "#f8f3f1",
            border: "1px solid #4a443d",
            borderRadius: "2px",
            padding: "12px 16px",
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "1.4",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          },
        }}
      />
    </div>
  );
}