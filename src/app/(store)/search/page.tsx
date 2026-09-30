import type { Metadata } from "next";

import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/services/category.service";
import { SearchExperience } from "@/components/search/search-experience";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the whole Aayesha Fashion website — pieces, collections, delivery, returns and more.",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";

  /*
   * The first results are rendered on the server so a shared
   * /search?q=... link works without waiting for the client.
   * Everything after that is live in the browser.
   */
  let products: Product[] = [];
  let total = 0;

  if (query) {
    try {
      const response = await getProducts({
        page: 1,
        limit: 24,
        search: query,
        status: "active",
        sort: "relevance",
      });

      products = response.products;
      total =
        response.pagination?.total ??
        response.products.length;
    } catch {
      products = [];
    }
  }

  let categories: Category[] = [];

  try {
    categories = (await getCategories()).filter(
      (category) => category.isActive,
    );
  } catch {
    categories = [];
  }

  return (
    <SearchExperience
      initialQuery={query}
      initialProducts={products}
      initialTotal={total}
      initialCategories={categories}
    />
  );
}
