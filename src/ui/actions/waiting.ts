import type { Actor, Waiter } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Waiting — wait for elements/conditions.
 * Equivalent to Java Waiting class implementing Waiter.
 */
export class Waiting implements Waiter {
  private selector: string = "";
  private timeoutSeconds: number = 30;
  private nthIndex?: number;
  private state: "visible" | "hidden" | "attached" | "detached" = "visible";

  private constructor() {}

  static on(selector: string): Waiting {
    const w = new Waiting();
    w.selector = selector;
    return w;
  }

  seconds(timeout: number): Waiting {
    this.timeoutSeconds = timeout;
    return this;
  }

  nth(index: number): Waiting {
    this.nthIndex = index;
    return this;
  }

  toBe(state: "visible" | "hidden" | "attached" | "detached"): Waiting {
    this.state = state;
    return this;
  }

  withState(state: "visible" | "hidden" | "attached" | "detached"): Waiting {
    this.state = state;
    return this;
  }

  within(seconds: number): Waiting {
    this.timeoutSeconds = seconds;
    return this;
  }

  async waitAs(actor: Actor): Promise<boolean> {
    const page = actor.usesBrowser();
    logger.step(
      `Waiting for '${this.selector}' to be ${this.state} (timeout: ${this.timeoutSeconds}s)`
    );

    try {
      let locator = page.locator(this.selector);
      if (this.nthIndex !== undefined) {
        locator = locator.nth(this.nthIndex);
      }
      await locator.waitFor({
        state: this.state,
        timeout: this.timeoutSeconds * 1000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
