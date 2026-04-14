/**
 * LocateBy — Playwright selector builder.
 * Equivalent to Java LocateBy class — exact same methods and signatures.
 */
export class LocateBy {
  private constructor() {}

  static id(idString: string): string {
    return `id=${idString}`;
  }

  static text(innerText: string): string {
    return `text=${innerText}`;
  }

  static css(css: string): string {
    return `css=${css}`;
  }

  /** Single-param dataIdentifier — equivalent to Java dataIdentifier(String) */
  static dataIdentifier(identifier: string): string {
    return `css=[data-identifier='${identifier}']`;
  }

  static xpath(xpath: string): string {
    return xpath;
  }

  /** CSS + text combination — equivalent to Java withCssText(String css, String text) */
  static withCssText(css: string, text: string): string {
    return `${css}:has-text("${text}")`;
  }

  /** CSS + exact text — equivalent to Java withExactCssText(String css, String text) */
  static withExactCssText(css: string, text: string): string {
    return `${css}:text-is("${text}")`;
  }

  static byName(nameAttr: string): string {
    return `css=[name='${nameAttr}']`;
  }

  // --- Additional TS-specific helpers (not in Java, but useful for Playwright) ---

  static exactText(text: string): string {
    return `text="${text}"`;
  }

  static dataTestId(value: string): string {
    return `[data-testid="${value}"]`;
  }

  static role(
    role: string,
    options?: { name?: string; exact?: boolean }
  ): string {
    if (options?.name) {
      return `role=${role}[name="${options.name}"]`;
    }
    return `role=${role}`;
  }

  static placeholder(text: string): string {
    return `[placeholder="${text}"]`;
  }

  static label(text: string): string {
    return `label=${text}`;
  }
}
