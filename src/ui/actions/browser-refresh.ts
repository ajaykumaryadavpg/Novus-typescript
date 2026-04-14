import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * BrowserRefresh — refresh the browser page with optional retry.
 * Equivalent to Java BrowserRefresh class.
 */
export class BrowserRefresh implements Performable {
  private retryTimes: number = 1;
  private checkSelector?: string;

  private constructor() {}

  static refreshBrowser(): BrowserRefresh {
    return new BrowserRefresh();
  }

  times(count: number): BrowserRefresh {
    this.retryTimes = count;
    return this;
  }

  checking(selector: string): BrowserRefresh {
    this.checkSelector = selector;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    logger.step("Refreshing browser");

    for (let i = 0; i < this.retryTimes; i++) {
      await page.reload({ waitUntil: "domcontentloaded" });

      if (this.checkSelector) {
        const visible = await page
          .locator(this.checkSelector)
          .isVisible()
          .catch(() => false);
        if (visible) break;
      } else {
        break;
      }
    }
  }
}
