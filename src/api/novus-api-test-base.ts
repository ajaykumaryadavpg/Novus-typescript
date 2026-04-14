import { test as base, type APIRequestContext } from "@playwright/test";
import { Actor } from "../core/interfaces";
import { reportingService } from "../core/services/novus-reporting.service";
import { logger } from "../core/services/novus-logger.service";
import { ApiDriver } from "./driver/api-driver";
import type { NovusTestInfo } from "../core/annotations/metadata";

/**
 * NovusApiTestBase — extended Playwright test fixture for API tests.
 * Equivalent to Java NovusApiTestBase class.
 *
 * Provides:
 * - `apiContext` fixture: a Playwright APIRequestContext
 * - `actor` fixture: an Actor instance wired to the API context
 * - `novusReport` fixture: reporting service initialized for the test
 */
export const apiTest = base.extend<{
  apiContext: APIRequestContext;
  actor: Actor;
  novusReport: typeof reportingService;
}>({
  apiContext: async ({}, use) => {
    const context = await ApiDriver.create();
    await use(context);
    await context.dispose();
  },

  actor: async ({ apiContext }, use) => {
    const actor = new Actor("ApiClient");
    actor.withApiContext(apiContext);
    logger.info(`API Actor created for test`);
    await use(actor);
  },

  novusReport: async ({}, use, testInfo) => {
    reportingService.init(testInfo);
    await use(reportingService);
  },
});

export function withApiTestMeta(meta: NovusTestInfo): void {
  reportingService.setTestMeta(meta);
}

export { expect } from "@playwright/test";
