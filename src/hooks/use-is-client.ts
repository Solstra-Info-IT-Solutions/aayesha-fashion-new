"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/*
 * false on the server and during hydration, true afterwards.
 * Replaces the `useEffect(() => setMounted(true), [])` pattern
 * (synchronous setState inside an effect) without changing what
 * is rendered on the server or during the first client render.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
