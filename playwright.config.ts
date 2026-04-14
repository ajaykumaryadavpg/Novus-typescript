import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

/**
 * Novus Playwright Configuration.
 * Equivalent to Java application.properties + application-web.properties + pom.xml combined.
 *
 * Override with environment variables or .env file.
 * See .env.example for all available options.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Global setup/teardown — equivalent to Java @BeforeSuite/@AfterSuite */
  globalSetup: path.resolve(__dirname, "tests/global-setup.ts"),
  globalTeardown: path.resolve(__dirname, "tests/global-teardown.ts"),

  /* Reporters — equivalent to Java NovusReportingService + NovusTestListener */
  reporter: [
    ["html", { outputFolder: "tests/resources/reports", open: "never" }],
    ["list"],
    ["./tests/listeners/novus-test-listener.ts"],
  ],

  /* Shared settings for all projects */
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

  /* Browser projects */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /* Uncomment to add more browsers:
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    */
  ],

  outputDir: "tests/resources/screenshots",
});
