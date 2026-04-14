import type { Actor } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { LocalCache } from "../../core/utils/local-cache";
import { Waiting } from "./waiting";

const log = NovusLoggerService.init("Retrieve");

/**
 * Retrieve — retrieve data from elements.
 * Equivalent to Java Retrieve class — uses getAs(actor) pattern returning string directly.
 *
 * Java Retrieve is NOT a Performable. It has getAs(Actor) -> String.
 * We keep getAs() as the primary method, plus storeAs() for cache support.
 */
export class Retrieve {
  private value: string;
  private locator: string = "";
  private retrieveStrategy: string;
  private seconds: number = 0;
  private nthIndex: number = 0;
  private cacheKey?: string;

  private constructor(value: string, retrieveStrategy: string) {
    log.info(`Retrieving using ${retrieveStrategy} strategy`);
    this.value = value;
    this.retrieveStrategy = retrieveStrategy;
  }

  ofLocator(locator: string): Retrieve {
    this.locator = locator;
    return this;
  }

  /** Alias for ofLocator — used in TS style */
  from(locator: string): Retrieve {
    this.locator = locator;
    return this;
  }

  atIndex(index: number): Retrieve {
    this.nthIndex = index;
    return this;
  }

  /** Alias for atIndex */
  nth(index: number): Retrieve {
    this.nthIndex = index;
    return this;
  }

  /** Store result in LocalCache */
  storeAs(key: string): Retrieve {
    this.cacheKey = key;
    return this;
  }

  byWaitingFor(seconds: number): Retrieve {
    this.seconds = seconds;
    return this;
  }

  static text(): Retrieve {
    return new Retrieve("", "TEXT");
  }

  static currentUrl(): Retrieve {
    return new Retrieve("", "CURRENT_URL");
  }

  static attribute(attrName: string): Retrieve {
    return new Retrieve(attrName, "ATTR");
  }

  static value(): Retrieve {
    return new Retrieve("", "VALUE");
  }

  static href(): Retrieve {
    return new Retrieve("href", "ATTR");
  }

  static inputValue(): Retrieve {
    return new Retrieve("", "INPUT");
  }

  static ifChecked(): Retrieve {
    return new Retrieve("", "CHECKED");
  }

  static count(): Retrieve {
    return new Retrieve("", "COUNT");
  }

  /**
   * Get the value — equivalent to Java getAs(Actor) returning String.
   * This is the primary retrieval method matching Java's API.
   */
  async getAs(actor: Actor): Promise<string> {
    const page = actor.usesBrowser();

    if (this.seconds > 0) {
      await actor.isWaitingForSeconds(this.seconds);
    }

    let result: string;

    switch (this.retrieveStrategy) {
      case "TEXT": {
        const text = await page
          .locator(this.locator)
          .nth(this.nthIndex)
          .innerText({ timeout: 10000 });
        result = text.trim();
        break;
      }
      case "ATTR": {
        result =
          (await page
            .locator(this.locator)
            .nth(this.nthIndex)
            .getAttribute(this.value, { timeout: 10000 })) || "";
        break;
      }
      case "VALUE": {
        result = await page
          .locator(this.locator)
          .first()
          .inputValue({ timeout: 10000 });
        break;
      }
      case "CURRENT_URL": {
        await page.waitForLoadState("load");
        await actor.isWaitingForSeconds(2);
        result = String(await page.evaluate("window.location.href"));
        break;
      }
      case "INPUT": {
        result = await page
          .locator(this.locator)
          .nth(this.nthIndex)
          .inputValue();
        break;
      }
      case "COUNT": {
        await actor.is(Waiting.on(this.locator));
        result = String(await page.locator(this.locator).count());
        break;
      }
      case "CHECKED": {
        await actor.is(Waiting.on(this.locator));
        result = String(
          await page
            .locator(this.locator)
            .isChecked({ timeout: 5000 })
        );
        break;
      }
      default:
        throw new Error("bad input");
    }

    if (this.cacheKey) {
      LocalCache.cache(this.cacheKey, result);
    }

    return result;
  }
}
