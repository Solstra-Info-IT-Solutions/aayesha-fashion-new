import { serializeJsonLd } from "@/lib/json-ld";
import { siteConfig } from "@/config/site";

export function SiteJsonLd() {
  const organization = {
    "@type": "OnlineStore",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    image: `${siteConfig.url}/images/og-image.jpg`,
    description: siteConfig.description,
    areaServed: "IN",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${siteConfig.contact.phone}`,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(jsonLd),
      }}
    />
  );
}
