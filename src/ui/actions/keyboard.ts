import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Keyboard — press keyboard keys.
 * Equivalent to Java Keyboard class.
 */
export class Keyboard implements Performable {
  private key: string;
  private selector?: string;
  private repeatTimes: number = 1;

  private constructor(key: string) {
    this.key = key;
  }

  static press(key: string): Keyboard {
    return new Keyboard(key);
  }

  on(selector: string): Keyboard {
    this.selector = selector;
    return this;
  }

  times(count: number): Keyboard {
    this.repeatTimes = count;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`Pressing key '${this.key}' ${this.repeatTimes > 1 ? `${this.repeatTimes} times` : ""}`);
    try {
      for (let i = 0; i < this.repeatTimes; i++) {
        if (this.selector) {
          await actor
            .usesBrowser()
            .locator(this.selector)
            .press(this.key);
        } else {
          await actor.usesBrowser().keyboard.press(this.key);
        }
      }
    } catch (error) {
      throw new NovusActionException(
        `Failed to press key '${this.key}': ${(error as Error).message}`
      );
    }
  }
}
