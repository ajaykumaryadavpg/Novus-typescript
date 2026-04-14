import { expect, type Locator, type Page } from "@playwright/test";
import type { Actor, Verifiable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Verify — fluent verification API for UI elements.
 * Equivalent to Java Verify class.
 */
export class Verify implements Verifiable {
  private selector?: string;
  private locator?: Locator;
  private nthIndex?: number;
  private description: string = "";
  private verifyFn!: (page: Page) => Promise<void>;
  private waitSeconds?: number;

  private constructor() {}

  static uiElement(selector: string): VerifyElement {
    return new VerifyElement(selector);
  }

  static page(): VerifyPage {
    return new VerifyPage();
  }

  static url(): VerifyUrl {
    return new VerifyUrl();
  }

  byWaitingFor(seconds: number): Verify {
    this.waitSeconds = seconds;
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    if (this.waitSeconds) {
      await page.waitForTimeout(this.waitSeconds * 1000);
    }
    await this.verifyFn(page);
  }
}

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

  isVisible(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' is visible`);
      await expect(locator).toBeVisible();
      logger.verificationSuccess(`'${this.description || this.selector}' is visible`);
    });
  }

  isHidden(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' is hidden`);
      await expect(locator).toBeHidden();
      logger.verificationSuccess(`'${this.description || this.selector}' is hidden`);
    });
  }

  containsText(text: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' contains text '${text}'`);
      await expect(locator).toContainText(text);
      logger.verificationSuccess(`'${this.description || this.selector}' contains '${text}'`);
    });
  }

  hasText(text: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' has text '${text}'`);
      await expect(locator).toHaveText(text);
      logger.verificationSuccess(`'${this.description || this.selector}' has text '${text}'`);
    });
  }

  isEnabled(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' is enabled`);
      await expect(locator).toBeEnabled();
      logger.verificationSuccess(`'${this.description || this.selector}' is enabled`);
    });
  }

  isDisabled(): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' is disabled`);
      await expect(locator).toBeDisabled();
      logger.verificationSuccess(`'${this.description || this.selector}' is disabled`);
    });
  }

  hasCSS(property: string, value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' has CSS ${property}: ${value}`);
      await expect(locator).toHaveCSS(property, value);
      logger.verificationSuccess(`'${this.description || this.selector}' has CSS ${property}: ${value}`);
    });
  }

  hasAttribute(name: string, value: string): VerifyElementAction {
    return new VerifyElementAction(this.selector, this.nthIndex, this.description, async (page) => {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) locator = locator.nth(this.nthIndex);
      logger.step(`Verifying '${this.description || this.selector}' has attribute ${name}="${value}"`);
      await expect(locator).toHaveAttribute(name, value);
      logger.verificationSuccess(`'${this.description || this.selector}' has attribute ${name}="${value}"`);
    });
  }
}

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
    const page = actor.usesBrowser();
    if (this.waitSeconds) {
      await page.waitForTimeout(this.waitSeconds * 1000);
    }
    await this.verifyFn(page);
  }
}

export class VerifyPage implements Verifiable {
  private verifyFn!: (page: Page) => Promise<void>;

  title(expected: string): VerifyPage {
    this.verifyFn = async (page: Page) => {
      logger.step(`Verifying page title is '${expected}'`);
      await expect(page).toHaveTitle(expected);
      logger.verificationSuccess(`Page title is '${expected}'`);
    };
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    await this.verifyFn(actor.usesBrowser());
  }
}

export class VerifyUrl implements Verifiable {
  private verifyFn!: (page: Page) => Promise<void>;

  is(expected: string): VerifyUrl {
    this.verifyFn = async (page: Page) => {
      logger.step(`Verifying URL is '${expected}'`);
      await expect(page).toHaveURL(expected);
      logger.verificationSuccess(`URL is '${expected}'`);
    };
    return this;
  }

  contains(expected: string): VerifyUrl {
    this.verifyFn = async (page: Page) => {
      logger.step(`Verifying URL contains '${expected}'`);
      await expect(page).toHaveURL(new RegExp(expected));
      logger.verificationSuccess(`URL contains '${expected}'`);
    };
    return this;
  }

  async verifyAs(actor: Actor): Promise<void> {
    await this.verifyFn(actor.usesBrowser());
  }
}
