import type { Page, BrowserContext, APIRequestContext } from "@playwright/test";

/**
 * Performable — base interface for all actions an Actor can perform.
 * Equivalent to Java Performable interface.
 */
export interface Performable {
  performAs(actor: Actor): Promise<void>;
  byWaitingFor?(seconds: number): Performable;
}

/**
 * Waiter — interface for wait conditions.
 * Equivalent to Java Waiter interface.
 */
export interface Waiter {
  waitAs(actor: Actor): Promise<boolean>;
}

/**
 * Verifiable — base interface for verifications.
 * Equivalent to Java Verifiable interface.
 */
export interface Verifiable {
  verifyAs(actor: Actor): Promise<void>;
  byWaitingFor?(seconds: number): Verifiable;
}

/**
 * Actor — the main test actor that executes actions, waits, and verifications.
 * Equivalent to Java Actor class.
 */
export class Actor {
  private _page!: Page;
  private _context!: BrowserContext;
  private _apiContext?: APIRequestContext;
  private _name: string;

  constructor(name: string = "User") {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  /** Sets the browser page for the actor */
  withPage(page: Page): Actor {
    this._page = page;
    return this;
  }

  /** Sets the browser context for the actor */
  withContext(context: BrowserContext): Actor {
    this._context = context;
    return this;
  }

  /** Sets the API request context for the actor */
  withApiContext(apiContext: APIRequestContext): Actor {
    this._apiContext = apiContext;
    return this;
  }

  /** Returns the browser page — equivalent to Java usesBrowser() */
  usesBrowser(): Page {
    return this._page;
  }

  /** Returns the browser context */
  browserContext(): BrowserContext {
    return this._context;
  }

  /** Returns the API request context */
  usesApi(): APIRequestContext | undefined {
    return this._apiContext;
  }

  /** Performs one or more actions — equivalent to Java attemptsTo() */
  async attemptsTo(...actions: Performable[]): Promise<void> {
    for (const action of actions) {
      await action.performAs(this);
    }
  }

  /** Alias for attemptsTo — equivalent to Java wantsTo() */
  async wantsTo(...actions: Performable[]): Promise<void> {
    return this.attemptsTo(...actions);
  }

  /** Waits for a condition — equivalent to Java isWaitingFor() */
  async isWaitingFor(waiter: Waiter): Promise<boolean> {
    return waiter.waitAs(this);
  }

  /** Verifies one or more conditions — equivalent to Java is() for Verifiable */
  async is(...verifications: Verifiable[]): Promise<void> {
    for (const verification of verifications) {
      await verification.verifyAs(this);
    }
  }
}
