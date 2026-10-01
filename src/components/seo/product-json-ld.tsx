import { serializeJsonLd } from "@/lib/json-ld";
import type { Product } from "@/types/product";
import {
  getAvailableStock,
  getProductAvailability,
} from "@/types/product";
import { siteConfig } from "@/config/site";

export interface ProductReviewSeo {
  average: number;
  total: number;
  items: Array<{
    author: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
  }>;
}

interface ProductJsonLdProps {
  product: Product;
  categoryName?: string;
  reviews?: ProductReviewSeo | null;
}

function absoluteUrl(
  value: string,
): string {
  try {
    return new URL(
      value,
      siteConfig.url,
    ).toString();
  } catch {
    return value;
  }
}

function getAvailabilityUrl(
  product: Product,
): string {
  const inventory =
    product?.inventory ?? {
      stock: 0,
      reserved: 0,
      lowStockThreshold: 2,
    };

  const availability =
    getProductAvailability({
      inventory: {
        stock:
          inventory.stock ?? 0,
        reserved:
          inventory.reserved ?? 0,
        lowStockThreshold:
          inventory.lowStockThreshold ??
          2,
      },
    });

  if (availability.isSoldOut) {
    return "https://schema.org/OutOfStock";
  }

  if (availability.isLowStock) {
    return "https://schema.org/LimitedAvailability";
  }

  return "https://schema.org/InStock";
}

function getImages(
  product: Product,
): string[] {
  const media =
    Array.isArray(product?.media)
      ? product.media
      : [];

  return Array.from(
    new Set(
      media
        .filter(
          (item) =>
            item?.type === "image" &&
            Boolean(item?.src),
        )
        .sort(
          (a, b) =>
            (a?.sortOrder ?? 0) -
            (b?.sortOrder ?? 0),
        )
        .map((item) =>
          absoluteUrl(item.src),
        ),
    ),
  );
}

function getDescription(
  product: Product,
): string {
  return (
    product?.seo?.description ||
    product?.content?.description ||
    `Discover ${
      product?.name ?? "this product"
    } from ${siteConfig.name}.`
  );
}

function getOffer(
  product: Product,
) {
  const pricing =
    product?.pricing ?? {
      mrp: 0,
      sellingPrice: 0,
      currency: "INR" as const,
    };

  const productId =
    product?._id ||
    product?.id ||
    "";

  return {
    "@type": "Offer",

    url: `${siteConfig.url}/products/${productId}`,

    sku:
      product?.id ||
      product?._id ||
      "",

    price:
      pricing?.sellingPrice ?? 0,

    priceCurrency:
      pricing?.currency ?? "INR",

    availability:
      getAvailabilityUrl(product),

    itemCondition:
      "https://schema.org/NewCondition",

    seller: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function ProductJsonLd({
  product,
  categoryName,
  reviews,
}: ProductJsonLdProps) {
  if (!product) {
    return null;
  }

  const productId =
    product._id ||
    product.id ||
    "";

  const productUrl =
    `${siteConfig.url}/products/${productId}`;

  const images =
    getImages(product);

  const availableStock =
    getAvailableStock(product);

  const productNode: Record<
    string,
    unknown
  > = {
    "@type": "Product",

    "@id":
      `${productUrl}#product`,

    name:
      product.name ||
      "Product",

    description:
      getDescription(product),

    url: productUrl,

    ...(images.length > 0
      ? {
          image: images,
        }
      : {}),

    sku:
      product.id ||
      product._id ||
      "",

    ...(categoryName
      ? {
          category:
            categoryName,
        }
      : {}),

    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },

    offers:
      getOffer(product),
  };

  /* Star ratings in search results — only with real approved reviews */
  if (reviews && reviews.total > 0) {
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviews.average,
      reviewCount: reviews.total,
      bestRating: 5,
      worstRating: 1,
    };

    productNode.review = reviews.items.map((item) => ({
      "@type": "Review",
      author: { "@type": "Person", name: item.author },
      datePublished: item.createdAt,
      ...(item.title ? { name: item.title } : {}),
      reviewBody: item.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: item.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  if (availableStock >= 0) {
    productNode.inventoryLevel = {
      "@type":
        "QuantitativeValue",
      value:
        availableStock,
    };
  }

  const jsonLd = {
    "@context":
      "https://schema.org",

    "@graph": [
      productNode,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          serializeJsonLd(jsonLd),
      }}
    />
  );
}
