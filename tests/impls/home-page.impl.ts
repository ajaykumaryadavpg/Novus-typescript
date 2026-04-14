import { Click } from "../../src/ui/actions/click";
import { Perform } from "../../src/ui/actions/perform";
import { HomePage } from "../pages/home.page";
import type { Performable } from "../../src/core/interfaces";

/**
 * HomePageImpl — home page action implementations.
 * Equivalent to Java HomePageImpl class.
 */
export function goToContactPage(): Performable {
  return Perform.actions(
    Click.on(HomePage.CONTACT_LINK)
  ).log("goToContactPage", "navigates to the contact page");
}
