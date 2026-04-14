import type { Actor, Performable, Waiter } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";
import { Waiting } from "./waiting";

const log = NovusLoggerService.init("Enter");

/**
 * Enter — fill text in an input field.
 * Equivalent to Java Enter class — ALL options included.
 */
export class Enter implements Performable {
  private textToEnter: string;
  private locator: string = "";
  private ifLocator: string[] = [];
  private toBeIgnoredIfNotVisible: boolean = false;
  private waitConditions: Waiter[] | null = null;
  private nthIndex: number = -1;
  private seconds: number = 0;
  private isMulti: boolean = false;
  private waitTimeForVisibility: number = 5;
  private frameSelector?: string;

  private constructor(textToEnter: string) {
    this.textToEnter = textToEnter;
  }

  static text(a: string | number): Enter {
    return new Enter(String(a));
  }

  /** Wait conditions before entering — equivalent to Java after(Waiter...) */
  after(...waitConditions: Waiter[]): Enter {
    this.waitConditions = waitConditions;
    return this;
  }

  on(selector: string): Enter {
    this.locator = selector;
    return this;
  }

  /** Fill ALL matching locators — equivalent to Java multi() */
  multi(): Enter {
    this.isMulti = true;
    return this;
  }

  nth(index: number): Enter {
    this.nthIndex = index;
    return this;
  }

  ifDisplayed(...locator: string[]): Enter {
    this.ifLocator = locator;
    this.toBeIgnoredIfNotVisible = true;
    return this;
  }

  ifDisplayedWithWait(waitTime: number, ...locator: string[]): Enter {
    this.waitTimeForVisibility = waitTime;
    this.ifLocator = locator;
    this.toBeIgnoredIfNotVisible = true;
    return this;
  }

  inFrame(frameSelector: string): Enter {
    this.frameSelector = frameSelector;
    return this;
  }

  byWaitingFor(seconds: number): Enter {
    this.seconds = seconds;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    if (this.seconds > 0) await actor.isWaitingForSeconds(this.seconds);

    try {
      if (this.toBeIgnoredIfNotVisible) {
        const checkLocator =
          this.ifLocator.length === 0 ? [this.locator] : this.ifLocator;
        const waitResult = await actor.is(
          Waiting.on(checkLocator[0]).seconds(this.waitTimeForVisibility)
        );
        const visible =
          waitResult &&
          (await page.locator(checkLocator[0]).first().isVisible());
        if (visible) {
          await this.enterText(actor);
        } else {
          log.warning(
            `[ENTER TEXT : IGNORED] on locator : <${this.locator}>`
          );
        }
      } else if (
        this.waitConditions === null ||
        (await actor.is(...this.waitConditions))
      ) {
        await this.enterText(actor);
        log.info(
          `[Action Performed : ENTER TEXT ] value : ${this.textToEnter} on locator : <${this.locator}>`
        );
      } else {
        log.error(
          "[Action Failure : ENTER TEXT ] Could not enter text on : " +
            this.locator,
          new Error("Timed out while waiting for locator to load")
        );
      }
    } catch (error) {
      log.truncatedError((error as Error).message);
      throw new NovusActionException(
        "Text could not be entered on locator " + this.locator
      );
    }
  }

  private async enterText(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    // Wait for locator to be visible first
    await Waiting.on(this.locator).waitAs(actor);

    let baseLocator;
    if (this.frameSelector) {
      baseLocator = page.frameLocator(this.frameSelector).locator(this.locator);
    } else {
      baseLocator = page.locator(this.locator);
    }

    if (this.isMulti) {
      const count = await baseLocator.count();
      for (let i = 0; i < count; i++) {
        await baseLocator.nth(i).fill(this.textToEnter);
      }
    } else if (this.nthIndex >= 0) {
      await baseLocator.nth(this.nthIndex).fill(this.textToEnter);
    } else {
      await baseLocator.first().fill(this.textToEnter);
    }
  }
}
