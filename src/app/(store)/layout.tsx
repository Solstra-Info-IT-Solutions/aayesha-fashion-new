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
    <div className="min-h-screen">
      {/* <AnnouncementBar /> */}

      <Header />

      <main
        className="
          min-h-screen
          bg-[var(--color-ivory)]
          pt-[72px]
          sm:pt-[76px]
          md:pt-[80px]
          lg:pt-[84px]
        "
      >
        {children}

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
      background: "#3f2d2a",
      color: "#ffffff",
      border: "1px solid #6f4b47",
      borderRadius: "0",
      padding: "10px 14px",
      fontFamily: "var(--font-body, sans-serif)",
      fontSize: "11px",
      boxShadow:
        "0 10px 30px rgba(63, 45, 42, 0.18)",
    },
  }}
/>
    </div>
  );
}