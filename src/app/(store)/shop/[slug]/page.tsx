import { cache } from "react";
import { ProductInsightsProvider } from "@/components/listing-sales/insights-context";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getLandingPage,
  getRelatedLandingPages,
  landingPages,
} from "@/config/landing-pages";
import { getProducts } from "@/lib/api/products";
import { serializeJsonLd } from "@/lib/json-ld";

import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/common/reveal";

import "@/components/landing/LandingPage.css";

interface LandingPageProps {
  params: Promise<{ slug: string }>;
}

/** Keeps generateMetadata and the page to a single API call. */
const loadProducts = cache(async (slug: string) => {
  const page = getLandingPage(slug);

  if (!page) {
    return [];
  }

  try {
    const response = await getProducts({
      page: 1,
      limit: 24,
      sort: "relevance",
      ...page.query,
    });

    return response.products ?? [];
  } catch (error) {
    console.error("LANDING PAGE PRODUCTS ERROR:", slug, error);

    return [];
  }
});

export function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    return {};
  }

  const products = await loadProducts(slug);
  const path = `/shop/${page.slug}`;

  const image = products
    .flatMap((product) => product.media ?? [])
    .find((media) => media.type === "image")?.src;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: path },
    // A page with nothing to sell is thin content: keep it out of Google.
    robots:
      products.length === 0 || !siteConfig.allowIndexing
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: `${page.metaTitle} | ${siteConfig.name}`,
      description: page.metaDescription,
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function LandingPageRoute({
  params,
}: LandingPageProps) {
  const { slug } = await params;
  const page = getLandingPage(slug);

  if (!page) {
    notFound();
  }

  const products = await loadProducts(slug);
  const related = getRelatedLandingPages(page);
  const path = `/shop/${page.slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    description: page.metaDescription,
    url: `${siteConfig.url}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 12).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/products/${product._id}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: page.title, url: path },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      {products.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(listJsonLd) }}
        />
      ) : null}

      <article className="landing">
        {/* HERO */}
        <header className="landing__hero">
          <div className="landing__container">
            <nav className="landing__crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/shop">Shop</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.title}</span>
            </nav>

            <p className="landing__eyebrow">{page.eyebrow}</p>

            <h1 className="landing__title">{page.title}</h1>

            {page.intro.map((paragraph) => (
              <p key={paragraph} className="landing__intro">
                {paragraph}
              </p>
            ))}

            <ul className="landing__highlights">
              {page.highlights.map((item) => (
                <li key={item}>
                  <Check size={15} strokeWidth={1.8} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* PRODUCTS */}
        <section className="landing__products" aria-label={page.title}>
          <div className="landing__container">
            {products.length > 0 ? (
              <>
                <p className="landing__count">
                  {products.length} style{products.length === 1 ? "" : "s"}
                </p>

                <ProductInsightsProvider
                  productIds={products.map((product) => product._id)}
                >
                  <div className="landing__grid">
                    {products.map((product, index) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        priority={index < 4}
                      />
                    ))}
                  </div>
                </ProductInsightsProvider>
              </>
            ) : (
              <div className="landing__empty">
                <p>
                  New styles for this edit are on their way. Explore the full
                  collection in the meantime.
                </p>

                <Link href="/shop" className="landing__cta">
                  Shop all <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* GUIDE */}
        <Reveal>
          <section className="landing__guide">
            <div className="landing__container landing__guide-grid">
              {page.guide.map((block) => (
                <div key={block.heading}>
                  <h2>{block.heading}</h2>
                  <p>{block.body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section className="landing__faq">
            <div className="landing__container">
              <h2 className="landing__section-title">
                Frequently asked questions
              </h2>

              <div className="landing__faq-list">
                {page.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* RELATED */}
        {related.length > 0 ? (
          <section className="landing__related">
            <div className="landing__container">
              <h2 className="landing__section-title">You may also like</h2>

              <ul>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/shop/${item.slug}`}>
                      {item.title}
                      <ArrowRight size={14} />
                    </Link>
                  </li>
                ))}

                <li>
                  <Link href="/collections/new-arrivals">
                    New Arrivals
                    <ArrowRight size={14} />
                  </Link>
                </li>

                <li>
                  <Link href="/collections/best-sellers">
                    Best Sellers
                    <ArrowRight size={14} />
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
