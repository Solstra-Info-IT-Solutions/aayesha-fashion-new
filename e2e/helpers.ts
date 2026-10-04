import type { Page } from "@playwright/test";

/** Accept-nothing consent so the cookie banner never covers the page under test. */
export async function dismissConsent(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem(
        "aayesha-cookie-consent",
        JSON.stringify({
          version: "1.0",
          preferences: { essential: true, analytics: false, marketing: false },
          decidedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* storage unavailable */
    }
  });
}
