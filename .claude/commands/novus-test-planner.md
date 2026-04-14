# Test Planner

Bridge between issue tracker and Playwright Planner agent. Accepts one or multiple stories — creates one combined test plan.

## What this does

1. Fetches one or more feature/story issues from Jira or GitHub
2. Delegates to the **playwright-test-planner** agent to explore the app and create a test plan
3. Creates ONE combined QA test plan issue back in the tracker

## Steps

### 1. Fetch all issues
- Parse input — could be: `PROJ-101`, `PROJ-101 PROJ-102 PROJ-103`, `#45`, `#45 #46 #47`
- GitHub: `gh issue view <number>` for each issue
- Jira: ask user to paste details, or use Atlassian MCP if available
- Combine acceptance criteria from all stories into one requirement set

### 2. Delegate to Playwright Planner agent
Hand off to the `playwright-test-planner` agent. It will open a real browser, explore the app, and produce a test plan spec in `specs/`.

### 3. Create ONE test plan issue in tracker
Read the spec the Planner agent created. Then:
- **GitHub:**
  ```bash
  gh issue create --title "QA: Test Plan for <all story refs> - <combined title>" --body "<spec content>" --label "qa,test-plan"
  ```
  Comment on each original story linking to the test plan.
- **Jira:** Provide the content for the user to create the issue.

### 4. Tell the user
- "Test plan created as [issue] covering [N] stories with [N] scenarios"
- "Saved to specs/"
- "When approved, run `/novus-test-generator <test-plan-issue>`"

## Input

$ARGUMENTS
