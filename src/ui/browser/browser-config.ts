/**
 * BrowserConfig — Playwright browser configuration.
 * Equivalent to Java BrowserConfig / BrowserScope classes.
 *
 * In Playwright Test for TypeScript, browser lifecycle is managed by the
 * test runner via playwright.config.ts. This class provides additional
 * configuration helpers.
 */
export interface BrowserSettings {
  headless: boolean;
  width: number;
  height: number;
  slowMo: number;
  fullscreen: boolean;
}

export function getBrowserSettings(): BrowserSettings {
  return {
    headless: process.env.HEADLESS !== "false",
    width: Number(process.env.BROWSER_WIDTH) || 1620,
    height: Number(process.env.BROWSER_HEIGHT) || 1080,
    slowMo: Number(process.env.SLOW_MO) || 100,
    fullscreen: process.env.FULLSCREEN === "true",
  };
}

export const defaultNavigationOptions = {
  waitUntil: "domcontentloaded" as const,
  timeout: 30000,
};
