import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Launch — navigate browser to a URL.
 * Equivalent to Java Launch class.
 */
export class Launch implements Performable {
  private url: string;
  private waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit" =
    "domcontentloaded";

  private constructor(url: string) {
    this.url = url;
  }

  static app(url: string): Launch {
    return new Launch(url);
  }

  withConfigs(
    waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit"
  ): Launch {
    this.waitUntil = waitUntil;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    logger.step(`Launching app: ${this.url}`);
    await actor.usesBrowser().goto(this.url, { waitUntil: this.waitUntil });
  }
}
