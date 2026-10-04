import { defineConfig, devices } from "@playwright/test";

/*
 * End-to-end tests for the storefront's critical journeys.
 *
 * They run against a throw-away API stand-in (e2e/mock-api.cjs) so no real database, payment
 * gateway or message provider is ever touched.   npm run e2e
 *
 * PW_CHROMIUM_PATH can point at an existing Chromium (useful in CI images without browsers).
 */
const port = 3111;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    contextOptions: { reducedMotion: "reduce" },
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 5"], defaultBrowserType: "chromium" } },
  ],
  webServer: [
    {
      command: "node e2e/mock-api.cjs",
      url: "http://localhost:5000/api/health",
      reuseExistingServer: true,
    },
    {
      command: `npx next dev -p ${port}`,
      url: `http://localhost:${port}`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:5000/api",
        BACKEND_URL: "http://localhost:5000",
      },
    },
  ],
});
