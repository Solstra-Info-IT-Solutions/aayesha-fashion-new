import type { Metadata } from "next";

import { apiFetch } from "@/lib/api";
import { siteConfig } from "@/config/site";
import type { HomepageData } from "@/types/homepage";

import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BrandStory } from "@/components/home/brand-story";
import { FeaturedCollectionCampaign } from "@/components/home/featured-collection-campaign";
import { BestSellers } from "@/components/home/best-sellers";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { Newsletter } from "@/components/home/newsletter";
import { HomeTrustStrip } from "@/components/home-sales/trust-strip";
import { HomeOffers } from "@/components/home-sales/home-offers";
import { ReviewsShowcase } from "@/components/home-sales/reviews-showcase";
import { ShopByNeed } from "@/components/home-sales/shop-by-need";
import { StylistCta } from "@/components/home-sales/stylist-cta";
import { RecentlyViewed } from "@/components/recently-viewed/recently-viewed";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

export const metadata: Metadata = {
  title: "Contemporary Indian Womenswear",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": siteConfig.url,
    },
  },
};

/* =========================================================
   HOMEPAGE DATA
========================================================= */

async function getHomepage(): Promise<HomepageData> {
  try {
    return await apiFetch<HomepageData>(
      "/homepage",
    );
  } catch (error) {
    console.error(
      "Failed to load homepage:",
      error,
    );

    return {
      hero: null,
      brandStory: null,
      whyChooseUs: null,
      testimonials: null,
      newsletter: null,
      instagram: null,
    };
  }
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default async function HomePage() {
  const homepage = await getHomepage();

  return (
    <>
      <SiteJsonLd />

      {/* ===================================================
          HERO
      =================================================== */}

      {homepage.hero?.enabled &&
        homepage.hero.slides.length > 0 && (
          <HeroSection
            slides={homepage.hero.slides}
          />
        )}

      <HomeTrustStrip />

      {/* ===================================================
          FEATURED CATEGORIES
          Source: Category API
      =================================================== */}

      <FeaturedCategories />

      {/* ===================================================
          NEW ARRIVALS
          Source: Product API
      =================================================== */}

      <NewArrivals />

      <HomeOffers />

      {/* ===================================================
          BRAND STORY
          Source: Homepage CMS
      =================================================== */}

      {homepage.brandStory?.enabled && (
        <BrandStory
            data={homepage.brandStory}
          />
      )}

      {/* ===================================================
          FEATURED COLLECTION CAMPAIGN
          Source: Marketing API
      =================================================== */}

      <FeaturedCollectionCampaign />

      {/* ===================================================
          BEST SELLERS
          Source: Product API
      =================================================== */}

      <BestSellers />

      <ShopByNeed />

      {/* ===================================================
          PROMOTIONAL BANNER
          Source: Marketing API
      =================================================== */}

      <PromotionalBanner />

      {/* ===================================================
          WHY AYESHA
          Source: Homepage CMS
      =================================================== */}

      {homepage.whyChooseUs?.enabled && (
        <WhyChooseUs
            data={homepage.whyChooseUs}
          />
      )}

      <ReviewsShowcase />

      {/* ===================================================
          TESTIMONIALS
          Source: Homepage CMS
      =================================================== */}

      {homepage.testimonials?.enabled &&
        homepage.testimonials.testimonials.length >
          0 && (
          <Testimonials
              data={homepage.testimonials}
            />
        )}

      {/* ===================================================
          INSTAGRAM
          Source: Homepage CMS
      =================================================== */}

      {homepage.instagram?.enabled &&
        homepage.instagram.posts.length > 0 && (
          <InstagramGallery
              data={homepage.instagram}
            />
        )}

      <RecentlyViewed
        title="Pick up where you left off"
        eyebrow="Recently viewed"
        limit={4}
      />

      <StylistCta />

      {/* ===================================================
          NEWSLETTER
          Source: Homepage CMS
      =================================================== */}

      {homepage.newsletter?.enabled && (
        <Newsletter
            data={homepage.newsletter}
          />
      )}
    </>
  );
}