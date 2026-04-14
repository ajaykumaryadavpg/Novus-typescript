import type { Actor, Waiter } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";

const log = NovusLoggerService.init("Waiting");

/**
 * Waiting — wait for elements/conditions.
 * Equivalent to Java Waiting class implementing Waiter — ALL options included.
 */
export class Waiting implements Waiter {
  private locator: string;
  private timeOut: number = 30;
  private nthIndex: number = 0;
  private _state?: "visible" | "hidden" | "attached" | "detached";
  private _elementState?: string;
  private _within?: number;

  private constructor(locator: string) {
    this.locator = locator;
  }

  static on(locator: string): Waiting {
    return new Waiting(locator);
  }

  seconds(timeOut: number): Waiting {
    this.timeOut = timeOut;
    return this;
  }

  nth(index: number): Waiting {
    this.nthIndex = index;
    return this;
  }

  /** Set wait state — equivalent to Java toBe(WaitForSelectorState) */
  toBe(state: "visible" | "hidden" | "attached" | "detached"): Waiting {
    this._state = state;
    return this;
  }

  /** Set element state — equivalent to Java withState(ElementState) */
  withState(state: string): Waiting {
    this._elementState = state;
    return this;
  }

  /** Set timeout in seconds — equivalent to Java within(double) */
  within(seconds: number): Waiting {
    this._within = seconds;
    return this;
  }

  async waitAs(actor: Actor): Promise<boolean> {
    const page = actor.usesBrowser();
    try {
      if (!this._state) {
        // Default: wait for visible
        log.wait(
          "Waiting for locator : {} to be visible in {} sec",
          this.locator,
          this.timeOut
        );
        await page.waitForLoadState();
        await page
          .locator(this.locator)
          .nth(this.nthIndex)
          .waitFor({
            state: "visible",
            timeout: this.timeOut * 1000,
          });
      } else {
        const timeout = this._within
          ? this._within * 1000
          : this.timeOut * 1000;
        log.info(
          "Waiting on locator : {} to have state : {}",
          this.locator,
          this._state
        );
        await page.waitForSelector(this.locator, {
          state: this._state,
          timeout,
        });
      }
      log.info("Locator : {} visible on GUI", this.locator);
      return true;
    } catch {
      log.warning("[Timed Out] waiting for element {}", this.locator);
      return false;
    }
  }
}
