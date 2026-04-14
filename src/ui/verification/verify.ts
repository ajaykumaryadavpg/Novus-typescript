import { expect, type Locator, type Page } from "@playwright/test";
import type { Actor, Verifiable } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { VerificationStrategy } from "./verification-strategy";

const log = NovusLoggerService.init("Verify");

/**
 * Verify — fluent verification API for UI elements, page, URL, and objects.
 * Equivalent to Java Verify<T> class — ALL strategies included.
 */
export class Verify<T = unknown> implements Verifiable {
  private locator?: string;
  private value?: string;
  private _name?: string;
  private strategy?: VerificationStrategy;
  private obj?: T;
  private objExpected?: T;
  private logMessage: string = "";
  private seconds: number = 0;

  private constructor() {}

  /** Verify a UI element by selector */
  static uiElement(selector: string): VerifyElement {
    return new VerifyElement(selector);
  }

  /** Verify page-level assertions */
  static page(): VerifyPage {
    return new VerifyPage();
  }

  /** Verify URL assertions */
  static url(): VerifyUrl {
    return new VerifyUrl();
  }

  /**
   * Verify an object/value — equivalent to Java Verify.verify(T actual, Matcher<? super T> matcher).
   * In TS we compare actual to expected directly.
   */
  static verify<T>(actual: T, expected: T): Verify<T> {
    const v = new Verify<T>();
    v.strategy = VerificationStrategy.OBJECT;
    v.obj = actual;
    v.objExpected = expected;
    return v;
  }

  describedAs(desc: string): Verify<T> {
    this.logMessage = desc;
    return this;
  }

  byWaitingFor(seconds: number): Verify<T> {
    this.seconds = seconds;
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    if (this.seconds > 0) {
      await actor.isWaitingForSeconds(this.seconds);
    }

    if (this.strategy === VerificationStrategy.OBJECT) {
      try {
        expect(this.obj).toBe(this.objExpected);
        if (typeof this.obj === "string" && (this.obj as string).length > 100) {
          log.verificationSuccess(
            `${this.logMessage} - ${String(this.obj).substring(0, 100)}..... ${this.objExpected}`
          );
        } else {
          log.verificationSuccess(
            `${this.logMessage} - ${this.obj} ${this.objExpected}`
          );
        }
      } catch (error) {
        log.verificationFailure((error as Error).message);
        throw new Error((error as Error).message);
      }
    }
  }
}

/**
 * VerifyElement — builder for element-level verifications.
 * Covers all Java Verify strategies for locators.
 */
export class VerifyElement {
  private selector: string;
  private nthIndex?: number;
  private description: string = "";

  constructor(selector: string) {
    this.selector = selector;
  }

  nth(index: number): VerifyElement {
    this.nthIndex = index;
    return this;
  }

  describedAs(desc: string): VerifyElement {
    this.description = desc;
    return this;
  }

  private getLocator(page: Page): Locator {
    let locator = page.locator(this.selector);
    if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
    return locator;
  }

  private label(): string {
    return this.description || this.selector;
  }

  /** Equivalent to Java Verify.isVisible() — VerificationStrategy.LOCATOR_VISIBLE */
  isVisible(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator.first()).toBeEnabled({ timeout: 30000 });
      log.verificationSuccess(`${this.label()} is visible on UI`);
    });
  }

  /** Equivalent to Java Verify.isNotVisible() — VerificationStrategy.LOCATOR_NOT_VISIBLE */
  isNotVisible(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeHidden({ timeout: 30000 });
      log.verificationSuccess(`${this.label()} is not visible on UI`);
    });
  }

  /** Alias for isNotVisible */
  isHidden(): VerifyElementAction {
    return this.isNotVisible();
  }

  /** Equivalent to Java Verify.containsText() — VerificationStrategy.CONTAINS_TEXT */
  containsText(text: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toContainText(text, { useInnerText: true, timeout: 5000 });
      log.verificationSuccess(`${this.label()} contains inner text ${text}`);
    });
  }

  /** Equivalent to Java Verify.doesNotContainText() — VerificationStrategy.DOES_NOT_CONTAIN_TEXT */
  doesNotContainText(text: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).not.toContainText(text, { useInnerText: true, timeout: 5000 });
      log.verificationSuccess(`${this.label()} does not contain inner text ${text}`);
    });
  }

  /** Equivalent to Java Verify.hasText() — VerificationStrategy.MATCHES_TEXT */
  hasText(text: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveText(text, { useInnerText: true, timeout: 5000 });
      log.verificationSuccess(`${this.label()} has inner text ${text}`);
    });
  }

  /** Equivalent to Java Verify.isDisabled() — VerificationStrategy.IS_DISABLED */
  isDisabled(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeDisabled({ timeout: 30000 });
      log.verificationSuccess(`${this.label()} is disabled on UI`);
    });
  }

  /** Equivalent to Java VerificationStrategy.IS_ENABLED */
  isEnabled(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeEnabled({ timeout: 30000 });
      log.verificationSuccess(`${this.label()} is enabled on UI`);
    });
  }

  /** Equivalent to Java Verify.hasId() — VerificationStrategy.ID */
  hasId(value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveId(value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has id ${value}`);
    });
  }

  /** Equivalent to Java Verify.hasClass() — VerificationStrategy.CLASS */
  hasClass(value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveClass(value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has class ${value}`);
    });
  }

  /** Equivalent to Java Verify.hasCSS() — VerificationStrategy.CSS */
  hasCSS(property: string, value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveCSS(property, value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has CSS ${property}: ${value}`);
    });
  }

  /** Equivalent to Java VerificationStrategy.ATTRIBUTE */
  hasAttribute(name: string, value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveAttribute(name, value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has attribute ${name}="${value}"`);
    });
  }

  /** Equivalent to Java VerificationStrategy.IS_CHECKED */
  isChecked(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeChecked({ timeout: 5000 });
      log.verificationSuccess(`${this.label()} is checked`);
    });
  }

  /** Equivalent to Java VerificationStrategy.IS_EDITABLE */
  isEditable(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeEditable({ timeout: 5000 });
      log.verificationSuccess(`${this.label()} is editable`);
    });
  }

  /** Equivalent to Java VerificationStrategy.IS_EMPTY */
  isEmpty(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeEmpty({ timeout: 5000 });
      log.verificationSuccess(`${this.label()} is empty`);
    });
  }

  /** Equivalent to Java VerificationStrategy.IS_FOCUSED */
  isFocused(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toBeFocused({ timeout: 5000 });
      log.verificationSuccess(`${this.label()} is focused`);
    });
  }

  /** Equivalent to Java VerificationStrategy.HAS_VALUE */
  hasValue(value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveValue(value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has value ${value}`);
    });
  }

  /** Equivalent to Java VerificationStrategy.HAS_JS_PROPERTY */
  hasJSProperty(name: string, value: unknown): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = this.getLocator(page);
      await expect(locator).toHaveJSProperty(name, value, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has JS property ${name}=${value}`);
    });
  }

  /** Equivalent to Java VerificationStrategy.COUNT */
  hasCount(count: number): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      const locator = page.locator(this.selector);
      await expect(locator).toHaveCount(count, { timeout: 5000 });
      log.verificationSuccess(`${this.label()} has count ${count}`);
    });
  }
}

/**
 * VerifyElementAction — a Verifiable that wraps an element assertion function.
 */
export class VerifyElementAction implements Verifiable {
  private verifyFn: (page: Page) => Promise<void>;
  private waitSeconds?: number;

  constructor(
    private selector: string,
    private nthIndex: number | undefined,
    private description: string,
    verifyFn: (page: Page) => Promise<void>
  ) {
    this.verifyFn = verifyFn;
  }

  byWaitingFor(seconds: number): VerifyElementAction {
    this.waitSeconds = seconds;
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    if (this.waitSeconds) {
      await actor.isWaitingForSeconds(this.waitSeconds);
    }
    try {
      await this.verifyFn(actor.usesBrowser());
    } catch (error) {
      const message = (error as Error).message;
      const truncated = message.length > 150 ? message.substring(0, 150) : message;
      log.verificationFailure(truncated);
      throw new Error(truncated);
    }
  }
}

/**
 * VerifyPage — page-level verifications.
 */
export class VerifyPage implements Verifiable {
  private verifyFn!: (page: Page) => Promise<void>;

  /** Equivalent to Java Verify.page().title().contains(value) */
  title(expected: string): VerifyPage {
    this.verifyFn = async (page: Page) => {
      try {
        await expect(page).toHaveTitle(new RegExp(`(${expected})`), { timeout: 5000 });
        log.verificationSuccess("page title matched regex");
      } catch (error) {
        const message = (error as Error).message;
        const truncated = message.length > 150 ? message.substring(0, 150) : message;
        log.verificationFailure(truncated);
        throw new Error(truncated);
      }
    };
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    await this.verifyFn(actor.usesBrowser());
  }
}

/**
 * VerifyUrl — URL verifications.
 */
export class VerifyUrl implements Verifiable {
  private verifyFn!: (page: Page) => Promise<void>;

  /** Exact URL match — equivalent to Java Verify.page().url().contains(value) with regex */
  is(expected: string): VerifyUrl {
    this.verifyFn = async (page: Page) => {
      try {
        await expect(page).toHaveURL(new RegExp(`(${expected})`), { timeout: 5000 });
        log.verificationSuccess(`${page.url()} contains partial text ${expected}`);
      } catch (error) {
        const message = (error as Error).message;
        const truncated = message.length > 150 ? message.substring(0, 150) : message;
        log.verificationFailure(truncated);
        throw new Error(truncated);
      }
    };
    return this;
  }

  /** URL contains match */
  contains(expected: string): VerifyUrl {
    return this.is(expected);
  }

  async verifyAs(actor: Actor): Promise<void> {
    await this.verifyFn(actor.usesBrowser());
  }
}
