import type { Actor, Performable, Waiter } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";
import { Waiting } from "./waiting";
import { Retry } from "../../core/utils/retry";

const log = NovusLoggerService.init("Click");

/**
 * Click — click on an element with advanced options.
 * Equivalent to Java Click class — ALL options included.
 */
export class Click implements Performable {
  private locator: string;
  private ifLocator: string[] = [];
  private acceptLocator: string | null = null;
  private beforeWaitConditions: Waiter[] | null = null;
  private afterWaitConditions: Waiter[] | null = null;
  private _nth: number = 0;
  private frame?: string;
  private isFrame: boolean = false;
  private toBeIgnoredIfNotVisible: boolean = false;
  private toBeIgnoredIfVisible: boolean = false;
  private untilCheckEnabled: boolean = false;
  private seconds: number = 0;
  private multi: boolean = false;
  private retryTimes: number = 0;
  private orElseActions: Performable[] | null = null;
  private waitTimeForVisibility: number = 5;
  private untilLocator?: string;

  private constructor(locator: string) {
    this.locator = locator;
  }

  static on(locator: string): Click {
    return new Click(locator);
  }

  /** Pre-click wait conditions — equivalent to Java afterWaiting(Waiting...) */
  afterWaiting(...waitConditions: Waiter[]): Click {
    this.beforeWaitConditions = waitConditions;
    return this;
  }

  and(): Click {
    return this;
  }

  /** Post-click wait conditions — equivalent to Java laterWaiting(Waiting...) */
  laterWaiting(...waitConditions: Waiter[]): Click {
    this.afterWaitConditions = waitConditions;
    return this;
  }

  nth(index: number): Click {
    this._nth = index;
    return this;
  }

  /** Click all matching elements — equivalent to Java multipleTimes() */
  multipleTimes(): Click {
    this.multi = true;
    return this;
  }

  /** Accept via another locator click — equivalent to Java accept(String) */
  accept(acceptLocator: string): Click {
    this.acceptLocator = acceptLocator;
    return this;
  }

  last(): Click {
    this._nth = 100000;
    return this;
  }

  /** Click only if displayed — equivalent to Java ifDisplayed(String...) */
  ifDisplayed(...locator: string[]): Click {
    this.ifLocator = locator;
    this.toBeIgnoredIfNotVisible = true;
    return this;
  }

  /** Click only if displayed with custom wait — equivalent to Java ifDisplayed(double, String...) */
  ifDisplayedWithWait(waitTime: number, ...locator: string[]): Click {
    this.waitTimeForVisibility = waitTime;
    this.ifLocator = locator;
    this.toBeIgnoredIfNotVisible = true;
    return this;
  }

  /** Switch to frame — equivalent to Java bySwitchingToFrame(String) */
  bySwitchingToFrame(frameName: string): Click {
    this.frame = frameName;
    this.isFrame = true;
    return this;
  }

  /** Alias for bySwitchingToFrame */
  inFrame(frameName: string): Click {
    return this.bySwitchingToFrame(frameName);
  }

  retryUpTo(times: number): Click {
    this.retryTimes = times;
    return this;
  }

  /** Click if NOT displayed — equivalent to Java ifNotDisplayed(String...) */
  ifNotDisplayed(...locator: string[]): Click {
    this.ifLocator = locator;
    this.toBeIgnoredIfVisible = true;
    return this;
  }

  /** Fallback actions — equivalent to Java orElse(Performable...) */
  orElse(...actions: Performable[]): Click {
    this.orElseActions = actions;
    return this;
  }

  /** Click until selector appears — equivalent to Java until(String) */
  until(locator: string): Click {
    this.untilLocator = locator;
    this.untilCheckEnabled = true;
    return this;
  }

  isVisible(): Click {
    return this;
  }

  byWaitingFor(seconds: number): Click {
    this.seconds = seconds;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();

    // Before wait conditions
    if (this.beforeWaitConditions) {
      const result = await actor.is(...this.beforeWaitConditions);
      if (!result) {
        throw new NovusActionException(
          `Click Action Failed on ${this.locator} as before wait condition failed`
        );
      }
    }

    // Frame click
    if (this.isFrame && this.frame) {
      const framee = page.frame(this.frame) || page.frameLocator(this.frame);
      log.debug(`[Action Performed : FRAME SWITCH ] on ${this.frame}`);
      if ("locator" in framee) {
        await framee.locator(this.locator).nth(this._nth).click();
      } else {
        await (framee as any).locator(this.locator).nth(this._nth).click();
      }
      log.info(`[Action Performed : CLICK ] on locator : <${this.locator}>`);
      return;
    }

    // ifDisplayed logic
    if (this.toBeIgnoredIfNotVisible) {
      const checkLocator =
        this.ifLocator.length === 0 ? [this.locator] : this.ifLocator;
      const waitResult = await actor.is(
        Waiting.on(checkLocator[0]).seconds(this.waitTimeForVisibility).nth(this._nth)
      );
      const visible = waitResult && await page.locator(checkLocator[0]).nth(this._nth).isVisible();
      if (visible) {
        await this.checkMulti(actor);
      } else {
        log.warning(`[CLICK : IGNORED] on locator : <${this.locator}>`);
        if (this.orElseActions) {
          await actor.attemptsTo(...this.orElseActions);
        }
        return;
      }
    } else if (this.toBeIgnoredIfVisible) {
      const checkLocator =
        this.ifLocator.length === 0 ? [this.locator] : this.ifLocator;
      const waitResult = await actor.is(
        Waiting.on(checkLocator[0]).seconds(this.waitTimeForVisibility)
      );
      const visible = waitResult && await page.locator(checkLocator[0]).first().isVisible();
      if (!visible) {
        await this.checkMulti(actor);
      } else {
        log.warning(`[CLICK : IGNORED] on locator : <${this.locator}>`);
        return;
      }
    } else {
      await this.checkMulti(actor);
    }

    // After wait conditions
    if (this.afterWaitConditions) {
      const result = await actor.is(...this.afterWaitConditions);
      if (!result) {
        throw new NovusActionException("after wait condition failed");
      }
    }
  }

  private async checkMulti(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    if (this.multi) {
      const total = await page.locator(this.locator).count();
      log.debug("total encountered elements :  " + total);
      if (total === 0) {
        log.warning(`[CLICK : IGNORED] on ${this.locator} as matching locator is 0`);
        return;
      }
      let remaining = total;
      while (remaining > 0) {
        await this.performClick(actor);
        if (this.acceptLocator) {
          Click.on(this.acceptLocator).byWaitingFor(1);
        }
        remaining--;
        log.debug("remaining locators : " + remaining);
      }
    } else {
      await this.performClick(actor);
    }
  }

  private async performClick(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    if (this.seconds > 0) {
      await actor.isWaitingForSeconds(this.seconds);
    }
    try {
      if (this._nth === 100000) {
        await page.locator(this.locator).last().click();
      } else if (this._nth !== 0) {
        await page.locator(this.locator).nth(this._nth).click();
      } else {
        if (this.retryTimes > 0) {
          await Retry.action(async () => {
            await page.locator(this.locator).first().click();
          })
            .times(this.retryTimes)
            .meanwhilePerform(async () => {
              await actor.isWaitingForSeconds(0.5);
            })
            .run();
        } else if (this.untilCheckEnabled && this.untilLocator) {
          for (let i = 0; i < 10; i++) {
            await page.locator(this.locator).first().click();
            const found = await actor.is(Waiting.on(this.untilLocator));
            if (found) break;
          }
        } else {
          await page.locator(this.locator).first().click();
          // Log console errors
          page.on("console", (msg) => {
            if (msg.type() === "error") {
              log.debug("Console Message : " + msg.type() + " : " + msg.text());
            }
          });
        }
        log.info(`[Action Performed : CLICK ] on locator : <${this.locator}>`);
      }
    } catch (error) {
      log.error((error as Error).message);
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          log.debug("Console Message : " + msg.type() + " : " + msg.text());
        }
      });
      throw new NovusActionException("Click Action Failed on locator : " + this.locator);
    }
  }
}
