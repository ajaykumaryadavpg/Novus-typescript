import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";
import { NovusActionException } from "../../core/exceptions";
import { LocalCache } from "../../core/utils/local-cache";

/**
 * Retrieve — retrieve data from elements and store in LocalCache.
 * Equivalent to Java Retrieve class.
 */
export class Retrieve implements Performable {
  private selector: string = "";
  private nthIndex?: number;
  private frameSelector?: string;
  private retrieveType: "text" | "attribute" | "value" | "href" | "inputValue" | "checked" | "count" | "currentUrl" = "text";
  private attributeName?: string;
  private cacheKey: string = "";

  private constructor() {}

  static text(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "text";
    return r;
  }

  static attribute(name: string): Retrieve {
    const r = new Retrieve();
    r.attributeName = name;
    r.retrieveType = "attribute";
    return r;
  }

  static value(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "value";
    return r;
  }

  static href(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "href";
    return r;
  }

  static inputValue(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "inputValue";
    return r;
  }

  static ifChecked(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "checked";
    return r;
  }

  static count(selector: string): Retrieve {
    const r = new Retrieve();
    r.selector = selector;
    r.retrieveType = "count";
    return r;
  }

  static currentUrl(): Retrieve {
    const r = new Retrieve();
    r.retrieveType = "currentUrl";
    return r;
  }

  from(selector: string): Retrieve {
    this.selector = selector;
    return this;
  }

  nth(index: number): Retrieve {
    this.nthIndex = index;
    return this;
  }

  inFrame(frameSelector: string): Retrieve {
    this.frameSelector = frameSelector;
    return this;
  }

  storeAs(key: string): Retrieve {
    this.cacheKey = key;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.usesBrowser();
    logger.step(`Retrieving ${this.retrieveType} from: ${this.selector || "page"}`);

    try {
      let result: string | number | boolean | null = null;

      if (this.retrieveType === "currentUrl") {
        result = page.url();
      } else {
        let locator;
        if (this.frameSelector) {
          locator = page.frameLocator(this.frameSelector).locator(this.selector);
        } else {
          locator = page.locator(this.selector);
        }

        if (this.nthIndex !== undefined) {
          locator = locator.nth(this.nthIndex);
        }

        switch (this.retrieveType) {
          case "text":
            result = await locator.textContent();
            break;
          case "attribute":
            result = await locator.getAttribute(this.attributeName!);
            break;
          case "value":
            result = await locator.getAttribute("value");
            break;
          case "href":
            result = await locator.getAttribute("href");
            break;
          case "inputValue":
            result = await locator.inputValue();
            break;
          case "checked":
            result = await locator.isChecked();
            break;
          case "count":
            result = await locator.count();
            break;
        }
      }

      if (this.cacheKey) {
        LocalCache.cache(this.cacheKey, result);
      }
    } catch (error) {
      throw new NovusActionException(
        `Failed to retrieve ${this.retrieveType} from '${this.selector}': ${(error as Error).message}`
      );
    }
  }
}
