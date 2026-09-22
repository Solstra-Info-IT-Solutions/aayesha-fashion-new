const STORAGE_KEY = "aayesha-recently-viewed";

const MAX_ITEMS = 12;

export interface RecentlyViewedProduct {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  viewedAt: number;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isValidProduct(
  product: RecentlyViewedProduct,
): boolean {
  return Boolean(
    product &&
      typeof product.id === "string" &&
      product.id.trim().length > 0,
  );
}

function readProducts(): RecentlyViewedProduct[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidProduct);
  } catch {
    return [];
  }
}

function writeProducts(
  products: RecentlyViewedProduct[],
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products.slice(0, MAX_ITEMS)),
    );
  } catch {
    // Ignore localStorage failures.
  }
}

export function getRecentlyViewed(): RecentlyViewedProduct[] {
  return readProducts();
}

export function addRecentlyViewed(
  product: Omit<RecentlyViewedProduct, "viewedAt">,
): RecentlyViewedProduct[] {
  if (!isValidProduct({ ...product, viewedAt: Date.now() })) {
    return readProducts();
  }

  const existingProducts = readProducts();

  const nextProduct: RecentlyViewedProduct = {
    ...product,
    viewedAt: Date.now(),
  };

  const filteredProducts = existingProducts.filter(
    (item) => item.id !== product.id,
  );

  const nextProducts = [
    nextProduct,
    ...filteredProducts,
  ].slice(0, MAX_ITEMS);

  writeProducts(nextProducts);

  return nextProducts;
}

export function removeRecentlyViewed(
  productId: string,
): RecentlyViewedProduct[] {
  const products = readProducts();

  const nextProducts = products.filter(
    (product) => product.id !== productId,
  );

  writeProducts(nextProducts);

  return nextProducts;
}

export function clearRecentlyViewed(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore localStorage failures.
  }
}

export function hasRecentlyViewed(
  productId: string,
): boolean {
  return readProducts().some(
    (product) => product.id === productId,
  );
}