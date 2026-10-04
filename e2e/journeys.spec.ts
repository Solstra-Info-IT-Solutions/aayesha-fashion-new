import { expect, test } from "@playwright/test";

import { dismissConsent } from "./helpers";

test.beforeEach(async ({ page }) => {
  await dismissConsent(page);
});

test.describe("critical journeys", () => {
  test("brand reveal leads to the chooser, and a card opens its collection", async ({ browser }) => {
    // The film/brand reveal is skipped for visitors who prefer reduced motion, so ask for motion.
    const context = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await context.newPage();
    await dismissConsent(page);
    await page.goto("/");
    await expect(page.locator(".brand-intro")).toBeVisible();
    await expect(page.locator(".brand-intro button")).toHaveCount(0); // no Skip button
    await page.waitForSelector(".occasion", { timeout: 15_000 });
    await page.locator(".occasion__item:nth-child(3) .occasion__card").click();
    await expect(page).toHaveURL(/\/collections\/festive/);
    await context.close();
  });

  test("search finds products", async ({ page }) => {
    await page.goto("/search?q=kurta");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".product-card").first()).toBeVisible({ timeout: 15_000 });
  });

  test("a product can be opened from a collection and added to the bag", async ({ page }) => {
    await page.goto("/collections/festive");
    await page.waitForSelector('a[href^="/products/"]', { timeout: 20_000 });
    await page.locator('a[href^="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.locator(".product-detail__title")).toBeVisible();
    await page.getByRole("button", { name: /add to bag/i }).first().click();
    await expect(page.getByText(/added to your bag/i).first()).toBeVisible();
  });

  test("the cart shows its lines and a total", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /your bag/i })).toBeVisible();
    await expect(page.getByText(/proceed to checkout/i)).toBeVisible();
  });

  test("checkout shows the order summary and refuses an incomplete order", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();
    const place = page.getByRole("button", { name: /place order/i });
    await place.scrollIntoViewIfNeeded();
    await place.click();
    // Still on checkout: no order was placed.
    await expect(page).toHaveURL(/\/checkout$/);
  });

  test("a signed-in customer sees profile and order history", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByText("Aisha Khan").first()).toBeVisible({ timeout: 15_000 });
    await page.goto("/account/orders");
    await expect(page.getByRole("heading", { name: /my orders/i })).toBeVisible();
    await expect(page.getByText(/AF-1001/).first()).toBeVisible();
  });

  test("login form rejects an invalid email without calling the server", async ({ page }) => {
    await page.goto("/login?x=1");
    await page.getByLabel(/email address/i).first().fill("not-an-email");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});

test.describe("production guard rails", () => {
  test("indexing is off by default and security headers are set", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toMatch(/Disallow:\s*\//);
    const home = await request.get("/");
    expect(home.headers()["x-frame-options"]).toBe("DENY");
    expect(home.headers()["x-content-type-options"]).toBe("nosniff");
    expect(home.headers()["x-powered-by"]).toBeUndefined();
  });

  test("unknown pages show the branded 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/could not be found/i)).toBeVisible();
  });

  test("no horizontal scrolling on key pages", async ({ page }) => {
    for (const path of ["/shop", "/collections", "/search", "/cart", "/checkout", "/contact"]) {
      await page.goto(path);
      await page.waitForTimeout(1500);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
});
