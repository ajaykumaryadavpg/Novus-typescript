import type { Page, BrowserContext, APIRequestContext } from "@playwright/test";
import { logger } from "../services/novus-logger.service";

/**
 * Performable — base interface for all actions an Actor can perform.
 * Equivalent to Java Performable interface.
 */
export interface Performable {
  /** Default timeout constants matching Java Performable */
  performAs(actor: Actor): Promise<void>;
  byWaitingFor?(seconds: number): Performable;
}

export const DEFAULT_TIMEOUT_30000 = 30000;
export const DEFAULT_TIMEOUT_5000 = 5000;

/**
 * Waiter — interface for wait conditions.
 * Equivalent to Java Waiter interface.
 */
export interface Waiter {
  waitAs(actor: Actor): Promise<boolean>;
}

/**
 * Static utility on Waiter — equivalent to Java Waiter.waitingForSeconds(double).
 */
export function waitingForSeconds(seconds: number): Promise<void> {
  logger.debug(`actor waiting for ${seconds} secs`);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
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
 * NovusBuilder — generic builder interface.
 * Equivalent to Java NovusBuilder<T> interface.
 */
export interface NovusBuilder<T> {
  build(): T;
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

  /** Sets browser page — equivalent to Java setBrowser(Page... page) */
  setBrowser(page: Page): void {
    this._page = page;
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
  async attemptsTo(...tasks: Performable[]): Promise<void> {
    for (const task of tasks) {
      if (task != null) {
        await task.performAs(this);
      }
    }
  }

  /** Soft assertion pass-through — equivalent to Java wantsTo(NovusSoftAssert) */
  wantsToVerify<T>(assertions: T): T {
    return assertions;
  }

  /** Verify — equivalent to Java wantsTo(Verifiable) */
  async wantsTo(verify: Verifiable): Promise<void> {
    await verify.verifyAs(this);
  }

  /**
   * Wait for seconds — equivalent to Java isWaitingFor(double seconds).
   * Simple sleep utility.
   */
  async isWaitingForSeconds(seconds: number): Promise<void> {
    await waitingForSeconds(seconds);
  }

  /**
   * Wait with a Waiter — equivalent to Java is(Waiter).
   * Returns boolean indicating if wait succeeded.
   */
  async isWaitingFor(waiter: Waiter): Promise<boolean> {
    return waiter.waitAs(this);
  }

  /**
   * Check one or more wait conditions — equivalent to Java is(Waiter... waiting).
   * Returns true if ALL waiters succeed.
   */
  async is(...waiting: Waiter[]): Promise<boolean> {
    let result = false;
    for (const waiter of waiting) {
      result = await waiter.waitAs(this);
    }
    return result;
  }

  /** Verifies one or more conditions — equivalent to Java wantsTo(Verifiable) for multiple */
  async verifies(...verifications: Verifiable[]): Promise<void> {
    for (const verification of verifications) {
      await verification.verifyAs(this);
    }
  }
}
