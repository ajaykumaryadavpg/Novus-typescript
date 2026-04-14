# Novus TypeScript — Playwright Test Automation Framework

This is the TypeScript replica of https://github.com/3PillarGlobal/novus — a Java-based test automation framework by 3Pillar Global.

Everything in this codebase follows the Novus architecture.

**Playwright Test Agents** (`.claude/agents/playwright-test-*.md`) are the primary AI agents for test planning, generation, and healing. They use real browser automation via MCP tools. The `seed.spec.ts` teaches these agents Novus conventions.

**Novus accelerator commands** (`.claude/commands/`) cover workflows Playwright agents don't — issue tracker integration, compliance review, test run summaries. They do NOT duplicate Playwright agents and do NOT add new patterns.

## Novus Architecture

```
src/core/           — Actor, Performable, Waiter, Verifiable, Logger, Retry, LocalCache, Exceptions
src/ui/             — Click, Enter, Type, Select, Retrieve, Verify, Waiting, Perform, Launch, etc.
src/api/            — Get, Post, Put, Delete, ApiCore, ApiDriver, ApiConfig, JsonUtil
tests/pages/        — Page objects (static readonly selectors)
tests/impls/        — Performable action implementations wrapped in Perform.actions().log()
tests/macros/       — Navigation macros
tests/services/     — UrlService extending BaseUrlService
tests/constants/    — TestGroups
tests/listeners/    — NovusTestListener (custom Playwright reporter)
tests/example/      — Test specs
```

## Novus Patterns (from Java — must always follow)

### Actor performs actions
```typescript
// Java: client.attemptsTo(Launch.app(on(urlService.baseUrl())));
await actor.attemptsTo(Launch.app(on(urlService.getAppUrl())));
```

### Hard assertions through Actor
```typescript
// Java: client.wantsTo(Verify.uiElement(CONTACT_LINK).describedAs("contact link is displayed").isVisible());
await actor.wantsTo(Verify.uiElement(HomePage.CONTACT_LINK).describedAs("contact link is displayed").isVisible());
```

### Implementations use Perform.actions().log()
```typescript
// Java: return Perform.actions(Enter.text(fName).on(ContactPage.LetsTalk.FIRST_NAME)).log("fillFirstName", "fills the first name of the client");
export function fillFirstName(fName: string): Performable {
  return Perform.actions(
    Enter.text(fName).on(ContactPage.LetsTalk.FIRST_NAME).inFrame(FRAME)
  ).log("fillFirstName", "fills the first name of the client");
}
```

### Test metadata via annotations
```typescript
// Java: @MetaData(author = "...", testCaseId = "1", stories = {"JIRA-1234"}, category = "TPG_CONTACT_US")
// Java: @Description("Test Lets Talk functionality on the Contact Page")
// Java: @Outcome("Verify that the clients can write to us with all the details successfully")
withTestMeta({
  author: "Sidhant Satapathy",
  scenario: "Test Lets Talk functionality on the Contact Page",
  outcome: "Verify that the clients can write to us with all the details successfully",
  testCaseId: "1",
  category: "TPG_CONTACT_US",
  stories: ["JIRA-1234", "JIRA-1245"],
});
```

### Step logging
```typescript
// Java: step("Client launches 3pillar website");
step("Client launches 3pillar website");
```

### Test groups
```typescript
// Java: @Test(groups = SMOKE_TESTS)  where SMOKE_TESTS = "smoke-tests"
import { TestGroups } from "../constants/test-groups";
// TestGroups.SMOKE_TESTS = "smoke-tests"
```

### Page objects — static readonly selectors
```typescript
// Java: public static final String CONTACT_LINK = "text=Contact";
export class HomePage {
  static readonly CONTACT_LINK = "text=Contact";
}
```

### GUI test extends NovusGuiTestBase
```typescript
// Java: public class TpgContactUsTests extends NovusGuiTestBase
import { test, withTestMeta, step } from "../../src/ui/novus-gui-test-base";
test.describe("Tests", () => {
  test("testName", async ({ actor }) => { ... });
});
```

### API test extends NovusApiTestBase
```typescript
// Java: public class BasicApiTests extends NovusApiTestBase
import { apiTest } from "../../src/api/novus-api-test-base";
apiTest.describe("Tests", () => {
  apiTest("testName", async ({ apiContext }) => { ... });
});
```

### Reporting — NovusTestListener + NovusReportingService
- `NovusTestListener` reads category from test annotations, prints results table by category
- `NovusReportingService` attaches metadata, steps, screenshots to Playwright report
- Reports go to `tests/resources/reports/`
- Screenshots go to `tests/resources/screenshots/`

## Playwright Test Agents

Initialized via `npx playwright init-agents --loop=claude`. Creates:
- `.claude/agents/playwright-test-planner.md` — explores app, produces markdown specs to `specs/`
- `.claude/agents/playwright-test-generator.md` — transforms specs into test files using real browser
- `.claude/agents/playwright-test-healer.md` — runs tests, debugs failures, patches code
- `.mcp.json` — MCP server config for browser tools

The `tests/seed.spec.ts` teaches the Generator agent Novus conventions by example. Generated code should follow the same structure as the seed test.

## Novus accelerator commands

Commands in `.claude/commands/` are bridges between the issue tracker and Playwright agents. Prefixed with `novus-` to avoid conflicts in repos that already have a `.claude/` folder.

- `/novus-start` — first-time setup (dependencies, app URL, Playwright agents)
- `/novus-test-planner` — fetches Jira/GitHub issue → delegates to Playwright Planner agent → creates test plan issue in tracker
- `/novus-test-generator` — fetches approved test plan → delegates to Playwright Generator agent → transforms output to Novus code

## Rules for all AI-generated code

Whether from Playwright agents or accelerator commands, ALL generated code MUST:

1. Match the Java Novus patterns above exactly
2. Use `Perform.actions().log("methodName", "description")` in every impl function
3. Use `withTestMeta()` with author, scenario, outcome, testCaseId, category
4. Use `step()` for test step logging
5. Put selectors in page objects, actions in impls, tests in example/
6. Run `npx tsc --noEmit` after generating code to verify
7. Never invent new patterns, tags, conventions, or abstractions beyond what Novus already has
