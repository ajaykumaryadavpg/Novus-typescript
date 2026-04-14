# Start

First-time setup for the Novus framework.

1. Run `npm install`
2. Run `npx playwright install chromium`
3. Ask the user for their app URL, update `.env` and `tests/services/url.service.ts`
4. Run `npx playwright test tests/example/basic-api.spec.ts` to verify setup
5. If not already done, run `npx playwright init-agents --loop=claude` to set up Playwright agents

Tell the user they're ready. Show them `/test-planner` and `/test-generator`.

## Input

$ARGUMENTS
