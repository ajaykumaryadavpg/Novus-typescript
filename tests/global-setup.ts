import type { FullConfig } from "@playwright/test";
import { NovusLoggerService } from "../src/core/services/novus-logger.service";

const log = NovusLoggerService.init("GlobalSetup");

/**
 * Global setup — runs once before all tests.
 * Equivalent to Java @BeforeSuite in NovusGuiTestBase.
 *
 * Use this for:
 * - Environment validation
 * - Auth token generation
 * - Test data seeding
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL || "not set";
  log.info(`Novus Framework starting...`);
  log.info(`Base URL: ${baseURL}`);
  log.info(`Workers: ${config.workers}`);
  log.info(`Projects: ${config.projects.map((p) => p.name).join(", ")}`);
}

export default globalSetup;
