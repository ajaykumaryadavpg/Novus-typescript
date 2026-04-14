/**
 * VerificationStrategy — enum for verification types.
 * Equivalent to Java VerificationStrategy enum.
 */
export enum VerificationStrategy {
  PAGE_TITLE = "PAGE_TITLE",
  LOCATOR_VISIBLE = "LOCATOR_VISIBLE",
  LOCATOR_HIDDEN = "LOCATOR_HIDDEN",
  CONTAINS_TEXT = "CONTAINS_TEXT",
  HAS_TEXT = "HAS_TEXT",
  CLASS = "CLASS",
  ID = "ID",
  CSS = "CSS",
  URL = "URL",
  URL_CONTAINS = "URL_CONTAINS",
  OBJECT = "OBJECT",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  CHECKED = "CHECKED",
  EDITABLE = "EDITABLE",
}
