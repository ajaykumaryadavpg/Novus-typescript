/**
 * seed.spec.ts — Seed test for Playwright Test Agents.
 *
 * Playwright Planner/Generator/Healer agents use this file to:
 * 1. Bootstrap the environment (global setup, fixtures, hooks)
 * 2. Learn the Novus code conventions by example
 *
 * The Generator agent reads this seed and produces tests that follow the same patterns:
 * - Import from novus-gui-test-base (not @playwright/test)
 * - Use actor.attemptsTo() for actions
 * - Use actor.wantsTo() for verifications
 * - Use withTestMeta() for test metadata
 * - Use step() for step logging
 * - Selectors go in Page Objects (tests/pages/*.page.ts)
 * - Actions go in Implementations (tests/impls/*.impl.ts) wrapped in Perform.actions().log()
 *
 * @see https://playwright.dev/docs/test-agents
 */
import { test, withTestMeta, step } from "../src/ui/novus-gui-test-base";
import { Launch } from "../src/ui/actions/launch";
import { Click } from "../src/ui/actions/click";
import { Enter } from "../src/ui/actions/enter";
import { Verify } from "../src/ui/verification/verify";
import { Perform } from "../src/ui/actions/perform";
import { urlService } from "./services/url.service";
import { on } from "../src/core/utils/code-fillers";
import { HomePage } from "./pages/home.page";
import type { Performable } from "../src/core/interfaces";

/**
 * Page Object example — selectors as static readonly constants.
 * Real page objects go in tests/pages/<name>.page.ts
 */
class SeedPage {
  static readonly HEADING = "h1";
}

/**
 * Implementation example — actions wrapped in Perform.actions().log()
 * Real implementations go in tests/impls/<name>.impl.ts
 */
function verifyPageLoaded(): Performable {
  return Perform.actions(
    Click.on(SeedPage.HEADING).ifDisplayed()
  ).log("verifyPageLoaded", "verifies the page has loaded");
}

/**
 * Seed test suite — demonstrates the Novus test structure.
 * Generated tests must follow this exact pattern.
 */
test.describe("Seed Tests", () => {

  test("seedApplicationLaunch", async ({ actor }) => {
    withTestMeta({
      author: "Novus Framework",
      scenario: "Verify the application loads and is accessible",
      outcome: "The home page loads with the correct title",
      testCaseId: "SEED-001",
      category: "SEED",
    });

    step("Launch the application");
    await actor.attemptsTo(Launch.app(on(urlService.getAppUrl())));

    step("Verify the page has loaded");
    await actor.wantsTo(
      Verify.uiElement(SeedPage.HEADING).describedAs("page heading").isVisible()
    );
  });
});
