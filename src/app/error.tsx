"use client";

import { useEffect } from "react";

import { StatusPage } from "@/components/common/status-page";
import { Button, LinkButton } from "@/components/ui/button";

/*
 * Catches errors in route groups that have no boundary of their own (sign-in, account, ...).
 * The store pages use (store)/error.tsx, which keeps the header and footer.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("APP ERROR:", error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Something went wrong"
      title="We could not load this page."
      description="This is usually temporary. Please try again in a moment."
    >
      <Button size="lg" onClick={reset}>
        Try again
      </Button>

      <LinkButton href="/" variant="secondary" size="lg">
        Back to home
      </LinkButton>
    </StatusPage>
  );
}
