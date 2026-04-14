import { Click } from "../../src/ui/actions/click";
import { HomePage } from "../pages/home.page";
import type { Performable } from "../../src/core/interfaces";

/**
 * HomePageImpl — home page action implementations.
 * Equivalent to Java HomePageImpl class.
 */
export function goToContactPage(): Performable {
  return Click.on(HomePage.CONTACT_LINK).nth(0);
}
