import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Enter — fill text in an input field.
 * Equivalent to Java Enter class.
 */
export class Enter implements Performable {
  private value: string | string[] = "";
  private selector: string = "";
  private nthIndex?: number;
  private isMulti: boolean = false;
  private onlyIfDisplayed: boolean = false;
  private frameSelector?: string;

  private constructor() {}

  static text(value: string): Enter {
    const enter = new Enter();
    enter.value = value;
    return enter;
  }

  static multi(values: string[]): Enter {
    const enter = new Enter();
    enter.value = values;
    enter.isMulti = true;
    return enter;
  }

  on(selector: string): Enter {
    this.selector = selector;
    return this;
  }

  nth(index: number): Enter {
    this.nthIndex = index;
    return this;
  }

  ifDisplayed(): Enter {
    this.onlyIfDisplayed = true;
    return this;
  }

  inFrame(frameSelector: string): Enter {
    this.frameSelector = frameSelector;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    logger.step(
      `Entering '${Array.isArray(this.value) ? this.value.join(", ") : this.value}' on: ${this.selector}`
    );

    try {
      let locator;

      if (this.frameSelector) {
        locator = page.frameLocator(this.frameSelector).locator(this.selector);
      } else {
        locator = page.locator(this.selector);
      }

      if (this.nthIndex !== undefined) {
        locator = locator.nth(this.nthIndex);
      }

      if (this.onlyIfDisplayed) {
        const isVisible = await locator.isVisible().catch(() => false);
        if (!isVisible) return;
      }

      if (this.isMulti && Array.isArray(this.value)) {
        for (let i = 0; i < this.value.length; i++) {
          await page.locator(this.selector).nth(i).fill(this.value[i]);
        }
      } else {
        await locator.fill(this.value as string);
      }
    } catch (error) {
      throw new NovusActionException(
        `Failed to enter text on '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
