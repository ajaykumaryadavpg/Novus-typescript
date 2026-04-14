import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * CheckBox — check or uncheck a checkbox.
 * Equivalent to Java CheckBox class.
 */
export class CheckBox implements Performable {
  private selector: string;
  private shouldCheck: boolean;

  private constructor(selector: string, check: boolean) {
    this.selector = selector;
    this.shouldCheck = check;
  }

  static check(selector: string): CheckBox {
    return new CheckBox(selector, true);
  }

  static uncheck(selector: string): CheckBox {
    return new CheckBox(selector, false);
  }

  async performAs(actor: Actor): Promise<void> {
    const action = this.shouldCheck ? "Checking" : "Unchecking";
    logger.step(`${action}: ${this.selector}`);
    try {
      if (this.shouldCheck) {
        await actor.usesBrowser().locator(this.selector).check();
      } else {
        await actor.usesBrowser().locator(this.selector).uncheck();
      }
    } catch (error) {
      throw new NovusActionException(
        `Failed to ${action.toLowerCase()} '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
