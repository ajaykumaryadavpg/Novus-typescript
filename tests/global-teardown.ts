import { NovusLoggerService } from "../src/core/services/novus-logger.service";

const log = NovusLoggerService.init("GlobalTeardown");

/**
 * Global teardown — runs once after all tests.
 * Equivalent to Java @AfterSuite in NovusGuiTestBase.
 *
 * Use this for:
 * - Test data cleanup
 * - Report finalization
 */
async function globalTeardown(): Promise<void> {
  log.info("Novus Framework test run complete.");
}

export default globalTeardown;
