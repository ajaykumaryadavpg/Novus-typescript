# Test Generator

Bridge between issue tracker, Playwright Generator agent, and Novus architecture.

## What this does

1. Fetches an approved test plan from Jira or GitHub
2. Delegates to the **playwright-test-generator** agent to generate tests using real browser
3. Transforms the output into Novus architecture (page objects + impls + test specs)

## Steps

### 1. Fetch the test plan
- GitHub: `gh issue view <number>`
- Jira: ask user to paste, or use Atlassian MCP
- Local: read from `specs/<key>.md` if saved by `/novus-test-planner`

### 2. Delegate to Playwright Generator agent
Hand off to the `playwright-test-generator` agent. It will execute test steps in a real browser and produce test code with verified selectors.

### 3. Transform to Novus architecture
The Generator agent outputs raw Playwright code (`page.click()`, `page.fill()`). Transform it into Novus layers:

- **Page Object** (`tests/pages/<name>.page.ts`) — extract selectors as `static readonly` constants
- **Implementation** (`tests/impls/<name>.impl.ts`) — wrap each action in `Perform.actions().log("name", "desc")`
- **Test Spec** (`tests/example/<name>.spec.ts`) — use `test` from `novus-gui-test-base`, add `withTestMeta()`, add `step()`, use `actor.attemptsTo()` and `actor.wantsTo()`

Link all source stories in metadata:
```typescript
withTestMeta({
  testCaseId: "PROJ-110",                      // test plan issue
  stories: ["PROJ-101", "PROJ-102", "PROJ-103"], // all source stories
  ...
});
```

### 4. Verify
Run `npx tsc --noEmit`

### 5. Update tracker
Comment on the test plan issue with the generated file list.

### 6. Tell the user
- What files were created
- `npx playwright test tests/example/<name>.spec.ts --headed` to run

## Input

$ARGUMENTS
