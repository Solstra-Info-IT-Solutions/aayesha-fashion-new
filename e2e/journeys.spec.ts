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

  test("an unverified customer can use the account and verify the email from the profile", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByText("Aisha Khan").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/email not verified \(optional\)/i)).toBeVisible();
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.getByLabel(/enter the code sent to/i).fill("123456");
    await page.getByRole("button", { name: /^confirm$/i }).click();
    await expect(page.getByText(/your email is verified/i).first()).toBeVisible();
  });

});

test.describe("mobile-number login", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([{ name: "mock_guest", value: "1", url: "http://localhost:3111" }]);
  });

  test("an existing customer logs in with the test OTP and lands on the store", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/mobile number/i).fill("98765 43210");
    await page.getByRole("button", { name: /send otp/i }).click();
    await expect(page.getByText(/test mode/i)).toBeVisible();
    await page.getByLabel(/one-time password/i).fill("123456");
    await page.getByRole("button", { name: /verify & log in/i }).click();
    await expect(page).toHaveURL(/localhost:3111\/?$/);
  });

  test("a wrong OTP is refused and keeps the customer on the login screen", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/mobile number/i).fill("9876543210");
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/one-time password/i).fill("000000");
    await page.getByRole("button", { name: /verify & log in/i }).click();
    await expect(page.locator(".login-form__error")).toContainText(/invalid or has expired/i);
    await expect(page).toHaveURL(/\/login/);
  });

  test("an invalid number is rejected before any OTP is requested", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/mobile number/i).fill("12345");
    await page.getByRole("button", { name: /send otp/i }).click();
    await expect(page.locator(".login-form__error")).toContainText(/valid 10-digit mobile number/i);
  });

  test("a first-time customer is taken to Edit account to fill in the rest", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/mobile number/i).fill("9000000001");
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/one-time password/i).fill("123456");
    await page.getByRole("button", { name: /verify & log in/i }).click();
    await expect(page).toHaveURL(/\/account\/edit\?welcome=1/);
    await expect(page.getByText(/you are\s+logged in/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeEditable();
    await expect(page.getByLabel(/phone number/i)).not.toBeEditable();
  });

  test("there is no sign-up or password screen", async ({ page }) => {
    for (const path of ["/register", "/forgot-password", "/verify-email", "/reset-password"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    }

    await expect(page.getByText(/sign up|create account|forgot password/i)).toHaveCount(0);
    await expect(page.getByLabel(/password/i)).toHaveCount(0);
  });

  test("the login prompt shown when adding to the bag as a guest has two readable buttons", async ({ page }) => {
    await page.goto("/collections/festive");
    await page.waitForSelector('a[href^="/products/"]', { timeout: 20_000 });
    await page.locator('a[href^="/products/"]').first().click();
    await page.locator(".product-detail__title").waitFor();
    await page.getByRole("button", { name: /add to bag/i }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole("button", { name: /login to continue/i })).toBeVisible();

    // The second button once had a light, translucent fill that hid its text.
    const button = dialog.getByRole("button", { name: /continue shopping/i });
    await expect(button).toBeVisible();

    const ratio = await button.evaluate((element) => {
      const channels = (value: string) => (value.match(/[\d.]+/g) ?? []).map(Number);

      const luminance = ([r = 0, g = 0, b = 0]: number[]) => {
        const f = (c: number) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };

      const layers: number[][] = [];

      for (let node: Element | null = element; node; node = node.parentElement) {
        const [r = 0, g = 0, b = 0, a = 1] = channels(getComputedStyle(node).backgroundColor);
        if (a > 0) layers.push([r, g, b, a]);
        if (a === 1) break;
      }

      let background = [0, 0, 0];

      for (const [r = 0, g = 0, b = 0, a = 1] of layers.reverse()) {
        background = [r * a + background[0]! * (1 - a), g * a + background[1]! * (1 - a), b * a + background[2]! * (1 - a)];
      }

      const l1 = luminance(channels(getComputedStyle(element).color));
      const l2 = luminance(background);

      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    });

    expect(ratio).toBeGreaterThanOrEqual(4.5);
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
