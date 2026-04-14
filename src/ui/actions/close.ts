import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Close — close the browser.
 * Equivalent to Java Close class.
 */
export class Close implements Performable {
  private constructor() {}

  static browser(): Close {
    return new Close();
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step("Closing browser");
    await actor.usesBrowser().context().close();
  }
}
