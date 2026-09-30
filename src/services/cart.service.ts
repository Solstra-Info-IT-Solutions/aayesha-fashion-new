"use client";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

/* =========================================================
   TYPES
========================================================= */

export interface CartProductPricing {
  mrp: number;
  sellingPrice: number;
  currency: "INR";
}

export interface CartProductInventory {
  stock: number;
  reserved: number;
  lowStockThreshold: number;
}

export interface CartProduct {
  _id: string;
  id: string;
  slug: string;
  name: string;
  categoryId: string;

  pricing: CartProductPricing;

  inventory: CartProductInventory;

  media: Array<{
    id?: string;
    url: string;
    type?: "image" | "video";
    alt?: string;
  }>;

  status:
    | "draft"
    | "active"
    | "archived"
    | "discontinued";
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string | null;
  userId: string;
  items: CartItem[];
}

export interface AddToCartInput {
  productId: string;
  quantity?: number;
}

/* =========================================================
   AUTH TOKEN
========================================================= */

function getAccessToken(): string {
  const accessToken =
    useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error(
      "Authentication is required.",
    );
  }

  return accessToken;
}

/* =========================================================
   GET CART
========================================================= */

export const CART_UPDATED_EVENT = "aayesha:cart-updated";

/*
 * Lets passive listeners (e.g. the header cart badge) refresh after
 * a successful cart mutation without polling or a new store.
 */
function notifyCartChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

/*
 * Concurrent GET /carts requests share one network call.
 * Every ProductCard on a listing page syncs its cart quantity on
 * mount; without this, an 8-card grid fired 8 identical requests.
 * The shared promise is dropped as soon as it settles or any cart
 * mutation starts, so later reads are never served stale data.
 */
let inFlightCart: Promise<Cart> | null = null;

export async function getCart(): Promise<Cart> {
  if (inFlightCart) {
    return inFlightCart;
  }

  const accessToken =
    getAccessToken();

  const request = apiFetch<Cart>(
    "/carts",
    {
      method: "GET",
      accessToken,
    },
  ).finally(() => {
    if (inFlightCart === request) {
      inFlightCart = null;
    }
  });

  inFlightCart = request;

  return request;
}

/* =========================================================
   ADD TO CART
========================================================= */

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<Cart> {
  inFlightCart = null;

  const accessToken =
    getAccessToken();

  const cart = await apiFetch<Cart>(
    "/carts",
    {
      method: "POST",

      accessToken,

      body: JSON.stringify({
        productId,
        quantity,
      }),
    },
  );

  notifyCartChanged();

  return cart;
}

/* =========================================================
   UPDATE CART ITEM
========================================================= */

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  inFlightCart = null;

  const accessToken =
    getAccessToken();

  const cart = await apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",

      accessToken,

      body: JSON.stringify({
        quantity,
      }),
    },
  );

  notifyCartChanged();

  return cart;
}

/* =========================================================
   REMOVE FROM CART
========================================================= */

export async function removeFromCart(
  productId: string,
): Promise<Cart> {
  inFlightCart = null;

  const accessToken =
    getAccessToken();

  const cart = await apiFetch<Cart>(
    `/carts/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",

      accessToken,
    },
  );

  notifyCartChanged();

  return cart;
}

/* =========================================================
   CLEAR CART
========================================================= */

export async function clearCart(): Promise<Cart> {
  inFlightCart = null;

  const accessToken =
    getAccessToken();

  const cart = await apiFetch<Cart>(
    "/carts",
    {
      method: "DELETE",

      accessToken,
    },
  );

  notifyCartChanged();

  return cart;
}