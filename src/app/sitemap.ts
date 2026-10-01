import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/api/products";

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

  return [
    ...staticEntries,
    ...productEntries,
  ];
}