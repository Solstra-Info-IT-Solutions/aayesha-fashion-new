import { apiFetch } from "@/lib/api";

export interface ProductSocialProof {
  soldLast7Days: number;
  ordersLast7Days: number;
}

/** Real order counts for the last 7 days (never estimated). */
export function getProductSocialProof(productId: string) {
  return apiFetch<ProductSocialProof>(
    `/products/${encodeURIComponent(productId)}/social-proof`,
  );
}

/** "Notify me when back in stock". Signed-in customers also get an in-app alert. */
export function subscribeStockAlert(
  productId: string,
  input: { email: string; phone?: string },
  accessToken?: string | null,
) {
  return apiFetch<{ subscribed: true }>(
    `/products/${encodeURIComponent(productId)}/stock-alert`,
    {
      method: "POST",
      body: JSON.stringify(input),
      ...(accessToken ? { accessToken } : {}),
    },
  );
}
