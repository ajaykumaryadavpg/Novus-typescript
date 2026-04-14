import type { Actor, Performable, Waiter } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";

const log = NovusLoggerService.init("Type");

/**
 * Type — type text character by character with optional delay.
 * Equivalent to Java Type class — ALL options included.
 */
export class Type implements Performable {
  private textToType: string;
  private locator: string = "";
  private waitConditions: Waiter[] | null = null;
  private seconds: number = 0;
  private slowSearch: boolean = false;

  private constructor(textToType: string) {
    this.textToType = textToType;
  }

  static text(a: string): Type {
    return new Type(a);
  }

  /** Wait conditions — equivalent to Java afterWaiting(Waiting...) */
  afterWaiting(...waitConditions: Waiter[]): Type {
    this.waitConditions = waitConditions;
    return this;
  }

  on(selector: string): Type {
    this.locator = selector;
    return this;
  }

  /** Slow type with delay — equivalent to Java withDelay() */
  withDelay(): Type {
    this.slowSearch = true;
    return this;
  }

  byWaitingFor(seconds: number): Type {
    this.seconds = seconds;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    if (this.seconds > 0) {
      await actor.isWaitingForSeconds(this.seconds);
    }
    try {
      if (
        this.waitConditions === null ||
        (await actor.is(...this.waitConditions))
      ) {
        if (this.slowSearch) {
          // Type all but last char with delay, wait, then type last char
          const lastLetter = this.textToType.substring(this.textToType.length - 1);
          const strToEnter = this.textToType.substring(0, this.textToType.length - 1);
          await page
            .locator(this.locator)
            .pressSequentially(strToEnter, { delay: 20 });
          await actor.isWaitingForSeconds(1.5);
          await page.locator(this.locator).pressSequentially(lastLetter);
        } else {
          await page
            .locator(this.locator)
            .pressSequentially(this.textToType, { delay: 0.7 });
        }
        log.info(
          `[Action Performed : TYPE TEXT ] on locator : <${this.locator}>`
        );
      } else {
        log.error(
          "[Action Failure : TYPE TEXT ] Could not type text on : " +
            this.locator,
          new Error("timed out while waiting for locator to load")
        );
      }
    } catch (error) {
      log.truncatedError((error as Error).message);
      throw new NovusActionException(
        "Type action failed on locator : " + this.locator
      );
    }
  }
}
