import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Type — type text character by character with optional delay.
 * Equivalent to Java Type class.
 */
export class Type implements Performable {
  private value: string = "";
  private selector: string = "";
  private delay: number = 0;

  private constructor() {}

  static text(value: string): Type {
    const type = new Type();
    type.value = value;
    return type;
  }

  on(selector: string): Type {
    this.selector = selector;
    return this;
  }

  withDelay(ms: number): Type {
    this.delay = ms;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`Typing '${this.value}' on: ${this.selector}`);
    try {
      await actor
        .usesBrowser()
        .locator(this.selector)
        .pressSequentially(this.value, { delay: this.delay });
    } catch (error) {
      throw new NovusActionException(
        `Failed to type on '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
