import { goToContactPage } from "../impls/home-page.impl";
import type { Performable } from "../../src/core/interfaces";

/**
 * Navigate — navigation builder (macro).
 * Equivalent to Java Navigate macro class.
 */
export class Navigate {
  static to(): NavigateTo {
    return new NavigateTo();
  }
}

class NavigateTo {
  contactPage(): Performable {
    return goToContactPage();
  }
}
