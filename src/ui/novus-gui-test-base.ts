import { test as base, type Page, type BrowserContext, type TestInfo } from "@playwright/test";
import { Actor } from "../core/interfaces";
import { reportingService } from "../core/services/novus-reporting.service";
import { NovusLoggerService } from "../core/services/novus-logger.service";
import { LocalCache } from "../core/utils/local-cache";
import { NovusSoftAssert } from "./verification/softly-verify";
import type { NovusTestInfo } from "../core/annotations/metadata";

const log = NovusLoggerService.init("NovusGuiTestBase");

/**
 * NovusGuiTestBase — extended Playwright test fixture with Actor model.
 * Equivalent to Java NovusGuiTestBase class.
 *
 * Provides:
 * - `actor` fixture: an Actor instance (equivalent to Java @Autowired Page browser)
 * - `softly` fixture: a NovusSoftAssert instance (equivalent to Java NovusSoftAssert softly)
 * - `novusReport` fixture: reporting service initialized for the test
 * - `step` function for annotated test steps
 */
export const test = base.extend<{
  actor: Actor;
  softly: NovusSoftAssert;
  novusReport: typeof reportingService;
}>({
  actor: async ({ page, context }, use) => {
    const actor = new Actor("Client");
    actor.withPage(page).withContext(context);
    log.info("Actor created for test");
    await use(actor);
    // tearDown — equivalent to Java @AfterSuite
    LocalCache.clear();
  },

  softly: async ({}, use) => {
    const softly = new NovusSoftAssert();
    await use(softly);
    softly.verifyAllSoftAssertions();
  },

  novusReport: async ({}, use, testInfo: TestInfo) => {
    reportingService.init(testInfo);
    await use(reportingService);
  },
});

let stepCount = 0;

/**
 * step() — annotated test step logging.
 * Equivalent to Java NovusGuiTestBase.step(String, Object...).
 */
export function step(description: string, ...args: unknown[]): void {
  const count = ++stepCount;
  const message = `[Test Step : #${count}] - ${description}`;
  reportingService.addStep(message);
  log.step(message, ...args);
}

/**
 * Helper to attach test metadata to the current test.
 */
export function withTestMeta(meta: NovusTestInfo): void {
  stepCount = 0; // Reset step count for each test
  reportingService.setTestMeta(meta);
}

export { expect } from "@playwright/test";
