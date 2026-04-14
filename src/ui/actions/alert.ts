import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Alert — handle JavaScript alerts/dialogs.
 * Equivalent to Java Alert class.
 */
export class Alert implements Performable {
  private action: "accept" | "dismiss";

  private constructor(action: "accept" | "dismiss") {
    this.action = action;
  }

  static accept(): Alert {
    return new Alert("accept");
  }

  static dismiss(): Alert {
    return new Alert("dismiss");
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`${this.action === "accept" ? "Accepting" : "Dismissing"} alert`);
    const page = actor.usesBrowser();
    page.once("dialog", (dialog) => {
      if (this.action === "accept") {
        dialog.accept();
      } else {
        dialog.dismiss();
      }
    });
  }
}
