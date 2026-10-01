"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_CHANGED_EVENT,
  getCookieConsent,
} from "@/lib/consent/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Consent = { analytics: boolean; marketing: boolean };

/**
 * Loads Google Analytics 4 and the Meta Pixel — only when their IDs are
 * configured AND the visitor has consented to the matching cookie
 * category. Renders nothing otherwise, so a store without IDs (or a
 * visitor who declines) loads no third-party scripts.
 */
export function AnalyticsScripts() {
  const pathname = usePathname();

  const [consent, setConsent] = useState<Consent>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const read = () => {
      const state = getCookieConsent();

      setConsent({
        analytics: Boolean(state?.preferences.analytics),
        marketing: Boolean(state?.preferences.marketing),
      });
    };

    // Deferred so the first read never sets state synchronously.
    const timer = window.setTimeout(read, 0);

    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, read);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, read);
    };
  }, []);

  /* Virtual page views on client-side navigation */
  useEffect(() => {
    if (consent.analytics && GA_ID) {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
      });
    }

    if (consent.marketing && PIXEL_ID) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname, consent.analytics, consent.marketing]);

  return (
    <>
      {consent.analytics && GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />

          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
          </Script>
        </>
      ) : null}

      {consent.marketing && PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`}
        </Script>
      ) : null}
    </>
  );
}
