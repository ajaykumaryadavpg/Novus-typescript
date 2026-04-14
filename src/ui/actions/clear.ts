import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Clear — clear text from an input field.
 * Equivalent to Java Clear class.
 */
export class Clear implements Performable {
  private selector: string;

  private constructor(selector: string) {
    this.selector = selector;
  }

  static locator(selector: string): Clear {
    return new Clear(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`Clearing: ${this.selector}`);
    try {
      await actor.usesBrowser().locator(this.selector).clear();
    } catch (error) {
      throw new NovusActionException(
        `Failed to clear '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
