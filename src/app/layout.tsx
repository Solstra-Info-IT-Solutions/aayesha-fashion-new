import type { Metadata } from "next";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import BrandLoader from "@/components/layout/BrandLoader";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";

import {
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import "./globals.css";

import { Toaster } from "react-hot-toast";

import { siteConfig } from "@/config/site";

import { AuthProvider } from "@/components/auth/auth-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

/* =========================================================
   SEO
========================================================= */

const siteTitle =
  "Aayesha Fashion | Elegant Indian Fashion Online";

const siteDescription =
  "Discover Aayesha Fashion's curated collection of elegant Indian fashion, festive wear, ethnic silhouettes and contemporary styles designed for modern women.";

const siteKeywords = [
  "Aayesha Fashion",
  "Aayesha Fashion India",
  "Aayesha Fashion online",
  "Indian fashion",
  "women's fashion",
  "women's ethnic wear",
  "ethnic wear for women",
  "festive wear women",
  "Indian ethnic clothing",
  "contemporary Indian fashion",
  "anarkali",
  "kurta set",
  "suit set",
  "lehenga",
  "saree",
  "women's dresses",
  "online fashion shopping",
  "Indian clothing online",
];

export const metadata: Metadata = {
  /* =======================================================
     BASIC
  ======================================================= */

  metadataBase: new URL(
    siteConfig.url,
  ),

  title: {
    default: siteConfig.name,
    template: `${siteConfig.name} | %s`,
  },

  description:
    siteDescription,

  keywords: siteKeywords,

  applicationName:
    siteConfig.name,

  generator: "Next.js",

  referrer:
    "origin-when-cross-origin",

  creator:
    siteConfig.name,

  publisher:
    siteConfig.name,

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  category: "fashion",

  classification:
    "Luxury Indian Fashion Ecommerce",

  /* =======================================================
     CANONICAL
  ======================================================= */

  /*
   * No site-wide canonical here: a root-level canonical is inherited
   * by every page that does not define its own, which pointed
   * /login, /cart, /collections... at the homepage. The homepage
   * declares its own in (store)/page.tsx.
   */

  /* =======================================================
     ROBOTS
  ======================================================= */

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  /* =======================================================
     OPEN GRAPH
  ======================================================= */

  openGraph: {
    type: "website",

    locale: siteConfig.locale,

    url: siteConfig.url,

    siteName:
      siteConfig.name,

    title: siteTitle,

    description:
      siteDescription,

    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aayesha Fashion — Elegant Indian Fashion",
        type: "image/jpeg",
      },
    ],
  },

  /* =======================================================
     TWITTER / X
  ======================================================= */

  twitter: {
    card: "summary_large_image",

    title: siteTitle,

    description:
      siteDescription,

    images: [
      "/images/og-image.jpg",
    ],
  },

  /* =======================================================
     ICONS
  ======================================================= */

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],

    shortcut: ["/favicon.ico"],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  /* =======================================================
     MANIFEST
  ======================================================= */

  manifest:
    "/site.webmanifest",

  /* =======================================================
     FORMAT DETECTION
  ======================================================= */

  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },

  /* =======================================================
     OTHER
  ======================================================= */

  /* Search Console / Bing verification (set in the environment) */
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          "msvalidate.01":
            process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }
      : undefined,
  },

  other: {
    "theme-color":
      "#f7f3ed",

    "color-scheme":
      "light",
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${cormorant.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <AnalyticsScripts />

        <BrandLoader />
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2200,

            style: {
              background:
                "#3f2d2a",

              color: "#f7f3ed",

              borderRadius: "0",

              borderLeft:
                "2px solid #b39a79",

              fontSize: "12px",

              fontWeight: "600",
            },
          }}
        />
      </body>
    </html>
  );
}