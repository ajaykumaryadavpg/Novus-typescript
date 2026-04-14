import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Open — open a new browser page/tab.
 * Equivalent to Java Open class.
 */
export class Open implements Performable {
  private constructor() {}

  static aNewBrowser(): Open {
    return new Open();
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step("Opening new browser page");
    const context = actor.browserContext();
    const newPage = await context.newPage();
    actor.withPage(newPage);
  }
}
