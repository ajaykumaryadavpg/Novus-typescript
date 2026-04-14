import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "tests/resources/reports", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: process.env.AUT_BASE_URL || "https://www.3pillarglobal.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: process.env.HEADLESS !== "false",
    viewport: {
      width: Number(process.env.BROWSER_WIDTH) || 1620,
      height: Number(process.env.BROWSER_HEIGHT) || 1080,
    },
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO) || 100,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "tests/resources/screenshots",
});
