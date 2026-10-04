import { apiFetch } from "@/lib/api";

/* =========================================================
   FEATURED COLLECTION CAMPAIGN
========================================================= */

export interface FeaturedCollectionCampaignMetadata {
  image: string;
  imageAlt: string;

  eyebrow: string;

  title: string;

  description: string;

  ctaLabel: string;
  ctaHref: string;

  brandLabel: string;

  bottomLabel: string;
  bottomTitle: string;
}

/* =========================================================
   PROMOTIONAL BANNER
========================================================= */

export interface PromotionalBannerMetadata {
  placement: "promotional_banner";

  image: string;
  imageAlt: string;

  href: string;
  ctaLabel: string;
}

/* =========================================================
   MARKETING CAMPAIGN
========================================================= */

export interface FeaturedCollectionCampaign {
  _id: string;

  name: string;
  slug: string;
  description: string;

  type:
    | "homepage"
    | "collection"
    | "product"
    | "email"
    | "whatsapp"
    | "social";

  status:
    | "draft"
    | "scheduled"
    | "active"
    | "paused"
    | "completed"
    | "archived";

  startsAt: string | null;
  endsAt: string | null;

  budget: number;

  metadata: FeaturedCollectionCampaignMetadata;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface PromotionalBannerCampaign {
  _id: string;

  name: string;
  slug: string;
  description: string;

  type:
    | "homepage"
    | "collection"
    | "product"
    | "email"
    | "whatsapp"
    | "social";

  status:
    | "draft"
    | "scheduled"
    | "active"
    | "paused"
    | "completed"
    | "archived";

  startsAt: string | null;
  endsAt: string | null;

  budget: number;

  metadata: PromotionalBannerMetadata;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   GET FEATURED COLLECTION CAMPAIGN
========================================================= */

export async function getFeaturedCollectionCampaign(): Promise<
  FeaturedCollectionCampaign | null
> {
  try {
    return await apiFetch<FeaturedCollectionCampaign | null>(
      "/marketing/featured-collection",
    );
  } catch (error) {
    // A missing banner must never take the whole home page (or a deployment build) down.
    console.error("FEATURED COLLECTION API ERROR:", error);

    return null;
  }
}

/* =========================================================
   GET PROMOTIONAL BANNER
========================================================= */

export async function getPromotionalBanner(): Promise<
  PromotionalBannerCampaign | null
> {
  try {
    return await apiFetch<PromotionalBannerCampaign | null>(
      "/marketing/promotional-banner",
    );
  } catch (error) {
    console.error("PROMOTIONAL BANNER API ERROR:", error);

    return null;
  }
}