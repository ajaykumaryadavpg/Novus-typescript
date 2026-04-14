# Project Novus, Modern Automation Framework

**_Novus is a latin word that means new, fresh, young and extraordinary._**

Novus is a **modular** TypeScript-based **TAF** that can be used to write **super stable** and **high quality** automated **acceptance** UI, API and Hybrid test scenarios using the proven Playwright framework.

**Tools Used**

* Playwright Test
* TypeScript
* Node.js
* Faker.js

## The Novus Style

_"To communicate effectively, the code must be based on the same language used to write the requirements—the same language that the developers speak with each other and with domain experts._
― Eric Evans, "Domain-Driven Design: Tackling Complexity in the Heart of Software"

Novus uses a **DSL** that is extremely readable and easy to write just like simple english sentences.
Novus helps in writing user-centric automated acceptance tests just like how our POs write requirements

<details>
<summary>Test Case Example</summary>

```typescript
test("Client writing to us", async ({ actor }) => {
    withTestMeta({
      author: "Novus Team",
      scenario: "A prospective client fills out the contact form to inquire about services",
      outcome: "The contact form is filled out with all required information",
      testCaseId: "TC-001",
      category: "smoke",
    });

    await actor.attemptsTo(
      Launch.app(on(urlService.getAppUrl())),
      Navigate.to().contactPage(),
      fillFirstName("Test"),
      fillLastName("User"),
      fillCompanyName("Test Company"),
      fillBizEmail("client@abc.com"),
      fillBizPhoneNumber("1234567890"),
      fillJobTitle("QA Engineer"),
      fillClientMessage("Hi I am testing the Lets Talk Section, Hope you got my email")
    );
});
```

</details>

In Novus, **only** an _**Actor**_ has the ability to perform actions on the GUI of the web application.

Actions in Novus will be fluent and will look like plain english sentences, exactly how we document test steps in a Test Plan.

```typescript
export function fillFirstName(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.FIRST_NAME);
}

export function fillLastName(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.LAST_NAME);
}

export function fillCompanyName(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.COMPANY_NAME);
}

export function fillBizEmail(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.BIZ_EMAIL);
}

export function fillBizPhoneNumber(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.BIZ_PHONE);
}

export function fillJobTitle(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.JOB_TITLE);
}

export function fillClientMessage(value: string): Performable {
  return Enter.text(value).on(ContactPage.LetsTalk.MESSAGE);
}

export function selectState(value: string): Performable {
  return Select.option(value).on(ContactPage.LetsTalk.LOCATION_DPDWN);
}
```

### How To Write a Test Class

Novus uses environment variables and `playwright.config.ts` to manage configuration.

Browser settings are configured in `playwright.config.ts`. Override them with environment variables:

```bash
# Run in headed mode
HEADLESS=false npx playwright test

# Custom viewport
BROWSER_WIDTH=1920 BROWSER_HEIGHT=1080 npx playwright test
```

Your **Hybrid/GUI Tests** should use the `test` fixture from `src/ui/novus-gui-test-base.ts`:

```typescript
import { test } from "../../src/ui/novus-gui-test-base";

test.describe("My GUI Tests", () => {
  test("my test", async ({ actor }) => {
    // actor is pre-wired with a page and context
  });
});
```

Your **API Tests** should use the `apiTest` fixture from `src/api/novus-api-test-base.ts`:

```typescript
import { apiTest } from "../../src/api/novus-api-test-base";

apiTest.describe("My API Tests", () => {
  apiTest("my api test", async ({ apiContext }) => {
    // apiContext is a Playwright APIRequestContext
  });
});
```

You can write your custom actions by implementing the `Performable` interface.

## Project Structure

### Where to add your tests

```
tests/
  |_example/
    |_your-test.spec.ts
```

### Where to add your pages, impls, macros and common code

```
tests/
  |_pages/       # Page objects with locator constants
  |_impls/        # Performable action implementations
  |_macros/       # Navigation and workflow macros
  |_services/     # URL and config services
```

### Framework source code

```
src/
  |_core/          # Core interfaces, utilities, services (Actor, Performable, Logger, etc.)
  |_ui/            # UI actions (Click, Enter, Select, Verify, etc.)
  |_api/           # API methods (Get, Post, Put, Delete, ApiCore)
```

### Where will your screenshots and Html reports be created?

```
tests/
  |_resources/
    |_screenshots/
    |_reports/
```

## Reports, Screenshots and Test Artifacts
- Novus generates screenshots for only the failed tests in `tests/resources/screenshots/`
- Novus generates HTML reports in `tests/resources/reports/`
- You can configure the reporter in `playwright.config.ts`
- Playwright also provides built-in trace viewer, video recording, and screenshot capture

### For contributing to this repo please check the [contributing rules](CONTRIBUTING.md)

#### Now that we are ready with the basics let's roll
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/example/basic-api.spec.ts
```
