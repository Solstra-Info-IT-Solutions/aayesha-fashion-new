"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

import { addToCart } from "@/services/cart.service";

import "./OrdersSales.css";

interface ReorderButtonProps {
  items: Array<{ productId: string; quantity: number; name: string }>;
  className?: string;
}

/** Adds every piece of a past order back to the bag (skipping unavailable ones). */
export function ReorderButton({ items, className = "" }: ReorderButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function reorder() {
    if (busy || items.length === 0) return;

    setBusy(true);

    let added = 0;
    const skipped: string[] = [];

    for (const item of items) {
      try {
        await addToCart(item.productId, item.quantity);
        added += 1;
      } catch {
        skipped.push(item.name);
      }
    }

    setBusy(false);

    if (added === 0) {
      toast.error("These pieces are not available right now.");
      return;
    }

    if (skipped.length > 0) {
      toast(`Some pieces were unavailable: ${skipped.join(", ")}`);
    } else {
      toast.success("Added to your bag.");
    }

    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={() => void reorder()}
      disabled={busy}
      className={`reorder-button ${className}`.trim()}
    >
      <RotateCcw size={14} strokeWidth={1.6} />
      {busy ? "Adding…" : "Order again"}
    </button>
  );
}
