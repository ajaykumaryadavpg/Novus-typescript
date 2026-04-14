import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Select — select option(s) from a dropdown.
 * Equivalent to Java Select class.
 */
export class Select implements Performable {
  private values: string[] = [];
  private selector: string = "";
  private frameSelector?: string;

  private constructor() {}

  static option(value: string): Select {
    const select = new Select();
    select.values = [value];
    return select;
  }

  static options(...values: string[]): Select {
    const select = new Select();
    select.values = values;
    return select;
  }

  on(selector: string): Select {
    this.selector = selector;
    return this;
  }

  inFrame(frameSelector: string): Select {
    this.frameSelector = frameSelector;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(
      `Selecting '${this.values.join(", ")}' on: ${this.selector}`
    );
    try {
      let locator;
      if (this.frameSelector) {
        locator = actor
          .usesBrowser()
          .frameLocator(this.frameSelector)
          .locator(this.selector);
      } else {
        locator = actor
          .usesBrowser()
          .locator(this.selector);
      }
      await locator.selectOption(this.values);
    } catch (error) {
      throw new NovusActionException(
        `Failed to select on '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
