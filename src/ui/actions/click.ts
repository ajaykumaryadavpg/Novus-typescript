import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

/**
 * Click — click on an element with advanced options.
 * Equivalent to Java Click class.
 */
export class Click implements Performable {
  private selector: string = "";
  private nthIndex?: number;
  private useLast: boolean = false;
  private onlyIfDisplayed: boolean = false;
  private onlyIfNotDisplayed: boolean = false;
  private retryTimes: number = 0;
  private untilSelector?: string;
  private multipleClicks: number = 1;
  private acceptDialog: boolean = false;
  private frameSelector?: string;
  private waitSeconds?: number;

  private constructor() {}

  static on(selector: string): Click {
    const click = new Click();
    click.selector = selector;
    return click;
  }

  nth(index: number): Click {
    this.nthIndex = index;
    return this;
  }

  last(): Click {
    this.useLast = true;
    return this;
  }

  ifDisplayed(): Click {
    this.onlyIfDisplayed = true;
    return this;
  }

  ifNotDisplayed(altSelector: string): Click {
    this.onlyIfNotDisplayed = true;
    this.untilSelector = altSelector;
    return this;
  }

  retryUpTo(times: number): Click {
    this.retryTimes = times;
    return this;
  }

  until(selector: string): Click {
    this.untilSelector = selector;
    return this;
  }

  multipleTimes(count: number): Click {
    this.multipleClicks = count;
    return this;
  }

  accept(): Click {
    this.acceptDialog = true;
    return this;
  }

  inFrame(frameSelector: string): Click {
    this.frameSelector = frameSelector;
    return this;
  }

  byWaitingFor(seconds: number): Click {
    this.waitSeconds = seconds;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    logger.step(`Clicking on: ${this.selector}`);

    try {
      let locator;

      if (this.frameSelector) {
        const frame = page.frameLocator(this.frameSelector);
        locator = frame.locator(this.selector);
      } else {
        locator = page.locator(this.selector);
      }

      if (this.nthIndex !== undefined) {
        locator = locator.nth(this.nthIndex);
      } else if (this.useLast) {
        locator = locator.last();
      }

      if (this.onlyIfDisplayed) {
        const isVisible = await locator
          .isVisible()
          .catch(() => false);
        if (!isVisible) return;
      }

      if (this.waitSeconds) {
        await locator.waitFor({
          state: "visible",
          timeout: this.waitSeconds * 1000,
        });
      }

      if (this.acceptDialog) {
        page.once("dialog", (dialog) => dialog.accept());
      }

      if (this.retryTimes > 0 && this.untilSelector) {
        for (let i = 0; i <= this.retryTimes; i++) {
          await locator.click();
          const found = await page
            .locator(this.untilSelector)
            .isVisible()
            .catch(() => false);
          if (found) break;
        }
      } else {
        for (let i = 0; i < this.multipleClicks; i++) {
          await locator.click();
        }
      }
    } catch (error) {
      throw new NovusActionException(
        `Failed to click on '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
