import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * DoubleClick — double-click on an element.
 * Equivalent to Java DoubleClick class.
 */
export class DoubleClick implements Performable {
  private selector: string;

  private constructor(selector: string) {
    this.selector = selector;
  }

  static on(selector: string): DoubleClick {
    return new DoubleClick(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`Double-clicking on: ${this.selector}`);
    try {
      await actor.usesBrowser().locator(this.selector).dblclick();
    } catch (error) {
      throw new NovusActionException(
        `Failed to double-click on '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
