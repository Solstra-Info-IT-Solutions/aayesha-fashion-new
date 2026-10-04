"use client";

import { useEffect } from "react";

/*
 * Last line of defence: replaces the whole document when the root layout itself fails.
 * Self-contained (no site CSS or components) so it can never fail for the same reason.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GLOBAL ERROR:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#111111",
          color: "#f8f3f1",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <main>
          <p style={{ letterSpacing: "0.3em", fontSize: 11, color: "#b79a6a" }}>
            AAYESHA FASHION
          </p>

          <h1 style={{ fontWeight: 400, fontSize: 32, margin: "12px 0" }}>
            Something went wrong
          </h1>

          <p style={{ color: "#cfc7bb", maxWidth: 420 }}>
            Please try again. If the problem continues, message us on WhatsApp.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              padding: "12px 28px",
              background: "#b79a6a",
              color: "#111111",
              border: 0,
              letterSpacing: "0.2em",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </button>
        </main>
      </body>
    </html>
  );
}
