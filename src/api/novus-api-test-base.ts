import { test as base, type APIRequestContext } from "@playwright/test";
import { Actor } from "../core/interfaces";
import { reportingService } from "../core/services/novus-reporting.service";
import { NovusLoggerService } from "../core/services/novus-logger.service";
import { LocalCache } from "../core/utils/local-cache";
import { NovusSoftAssert } from "../ui/verification/softly-verify";
import { ApiDriver } from "./driver/api-driver";
import type { NovusTestInfo } from "../core/annotations/metadata";

const log = NovusLoggerService.init("NovusApiTestBase");

/**
 * NovusApiTestBase — extended Playwright test fixture for API tests.
 * Equivalent to Java NovusApiTestBase class.
 *
 * Provides:
 * - `apiContext` fixture: a Playwright APIRequestContext
 * - `actor` fixture: an Actor instance wired to the API context
 * - `softly` fixture: a NovusSoftAssert instance
 * - `novusReport` fixture: reporting service initialized for the test
 */
export const apiTest = base.extend<{
  apiContext: APIRequestContext;
  actor: Actor;
  softly: NovusSoftAssert;
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
    log.info("API Actor created for test");
    await use(actor);
    // tearDown
    LocalCache.clear();
  },

  softly: async ({}, use) => {
    const softly = new NovusSoftAssert();
    await use(softly);
    softly.verifyAllSoftAssertions();
  },

  novusReport: async ({}, use, testInfo) => {
    reportingService.init(testInfo);
    await use(reportingService);
  },
});

let stepCount = 0;

/**
 * step() — annotated test step logging.
 * Equivalent to Java NovusApiTestBase.step(String, Object...).
 */
export function step(description: string, ...args: unknown[]): void {
  const count = ++stepCount;
  const message = `[Test Step : #${count}] - ${description}`;
  reportingService.addStep(message);
  log.step(message, ...args);
}

export function withApiTestMeta(meta: NovusTestInfo): void {
  stepCount = 0;
  reportingService.setTestMeta(meta);
}

export { expect } from "@playwright/test";
