import { test as base, type Page, type BrowserContext, type TestInfo } from "@playwright/test";
import { Actor } from "../core/interfaces";
import { reportingService } from "../core/services/novus-reporting.service";
import { logger } from "../core/services/novus-logger.service";
import { LocalCache } from "../core/utils/local-cache";
import { SoftlyVerify } from "./verification/softly-verify";
import type { NovusTestInfo } from "../core/annotations/metadata";

/**
 * NovusGuiTestBase — extended Playwright test fixture with Actor model.
 * Equivalent to Java NovusGuiTestBase class.
 *
 * Provides:
 * - `actor` fixture: an Actor instance wired to the current page
 * - `softAssert` fixture: a SoftlyVerify instance for soft assertions
 * - `novusReport` fixture: reporting service initialized for the test
 */
export const test = base.extend<{
  actor: Actor;
  softAssert: SoftlyVerify;
  novusReport: typeof reportingService;
}>({
  actor: async ({ page, context }, use) => {
    const actor = new Actor("Client");
    actor.withPage(page).withContext(context);
    logger.info(`Actor created for test`);
    await use(actor);
  },

  softAssert: async ({}, use) => {
    const softAssert = new SoftlyVerify();
    await use(softAssert);
    softAssert.verifyAll();
  },

  novusReport: async ({}, use, testInfo: TestInfo) => {
    reportingService.init(testInfo);
    await use(reportingService);
  },
});

/**
 * Helper to attach test metadata to the current test.
 */
export function withTestMeta(meta: NovusTestInfo): void {
  reportingService.setTestMeta(meta);
}

export { expect } from "@playwright/test";
