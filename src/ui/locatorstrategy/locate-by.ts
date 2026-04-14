/**
 * LocateBy — Playwright selector builder.
 * Equivalent to Java LocateBy class.
 */
export class LocateBy {
  static id(id: string): string {
    return `#${id}`;
  }

  static css(selector: string): string {
    return selector;
  }

  static xpath(expression: string): string {
    return `xpath=${expression}`;
  }

  static name(name: string): string {
    return `[name="${name}"]`;
  }

  static text(text: string): string {
    return `text=${text}`;
  }

  static exactText(text: string): string {
    return `text="${text}"`;
  }

  static withCssText(text: string): string {
    return `:has-text("${text}")`;
  }

  static withExactCssText(text: string): string {
    return `:text("${text}")`;
  }

  static dataIdentifier(key: string, value: string): string {
    return `[data-${key}="${value}"]`;
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
