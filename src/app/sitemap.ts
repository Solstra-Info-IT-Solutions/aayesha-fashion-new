import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/api/products";
import { landingPages } from "@/config/landing-pages";

const staticRoutes = [
  "/",
  "/shop",
  "/categories",
  "/collections",
  "/collections/new-arrivals",
  "/collections/best-sellers",
  "/collections/festive",
  "/collections/ethnic",
  "/collections/contemporary",
  "/our-story",
  "/contact",
  "/shipping",
  "/returns",
  "/shipping-policy",
  "/refund-policy",
  "/privacy-policy",
  "/terms",
] as const;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap =
    staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency:
        path === "/"
          ? "weekly"
          : path.startsWith("/collections/")
            ? "weekly"
            : "monthly",
      priority:
        path === "/"
          ? 1
          : path === "/shop"
            ? 0.9
            : path.startsWith("/collections/")
              ? 0.8
              : 0.5,
    }));

  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const response = await getProducts({
      page: 1,
      limit: 1000,
      sort: "newest",
    });

    const products = response.products ?? [];

    productEntries = products
      .filter((product) => product.status === "active")
      .filter((product) => !product.seo?.noIndex)
      .map((product) => ({
        /*
         * Must match the canonical + internal links, which are
         * /products/<_id>. Using the slug produced sitemap URLs whose
         * canonical pointed somewhere else.
         */
        url: absoluteUrl(
          `/products/${encodeURIComponent(product._id)}`,
        ),
        lastModified: new Date(
          product.updatedAt ||
            product.publishedAt ||
            product.createdAt,
        ),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    /*
     * Sitemap generation should not break deployment/runtime
     * merely because the product API is temporarily unavailable.
     */
    productEntries = [];
  }

  /*
   * SEO landing pages: only those that currently have products,
   * matching the noindex rule on the page itself.
   */
  const landingChecks = await Promise.all(
    landingPages.map(async (page) => {
      try {
        const response = await getProducts({
          page: 1,
          limit: 1,
          ...page.query,
        });

        return (response.products ?? []).length > 0 ? page : null;
      } catch {
        return null;
      }
    }),
  );

  const landingEntries: MetadataRoute.Sitemap = landingChecks
    .filter((page): page is (typeof landingPages)[number] => Boolean(page))
    .map((page) => ({
      url: absoluteUrl(`/shop/${page.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...landingEntries,
    ...productEntries,
  ];
}