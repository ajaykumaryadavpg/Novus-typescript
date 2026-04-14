/**
 * NovusLoggerService — colored console logging.
 * Equivalent to Java NovusLoggerService with NovusAnsiColors.
 */

const ANSI = {
  RESET: "\x1b[0m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
  BLACK: "\x1b[30m",
  BRIGHT_GREEN: "\x1b[92m",
  BRIGHT_BLUE: "\x1b[94m",
  BRIGHT_WHITE: "\x1b[97m",
  BOLD: "\x1b[1m",
};

export class NovusLoggerService {
  private className: string;

  constructor(className: string = "NOVUS") {
    this.className = className;
  }

  /** Factory method — equivalent to Java NovusLoggerService.init(Class<?>) */
  static init(className: string): NovusLoggerService {
    return new NovusLoggerService(className);
  }

  step(message: string, ...args: unknown[]): void {
    const formatted = this.format(message, args);
    console.log(
      `${ANSI.BRIGHT_BLUE}${ANSI.BOLD}[${this.className}] [Executing Step] : ${formatted}${ANSI.RESET}`
    );
  }

  info(message: string, ...args: unknown[]): void {
    const formatted = this.format(message, args);
    console.log(
      `${ANSI.MAGENTA}[${this.className}] ${formatted}${ANSI.RESET}`
    );
  }

  debug(message: string, ...args: unknown[]): void {
    const formatted = this.format(message, args);
    console.log(
      `${ANSI.CYAN}[${this.className}] ${formatted}${ANSI.RESET}`
    );
  }

  /** Formatted test banner — equivalent to Java NovusLoggerService.test() */
  test(message: string): void {
    const totalSpaces = 150;
    const left = totalSpaces - (message.length + 15);
    const leftSpace = Math.floor(left / 2);
    const rightSpace = Math.abs(left - leftSpace);
    const banner =
      `\n-${"=".repeat(150)}-\n|` +
      `${" ".repeat(leftSpace)}Running test : ${message}${" ".repeat(rightSpace)}|` +
      `\n-${"=".repeat(150)}-`;
    console.log(`${ANSI.BLACK}${banner}${ANSI.RESET}`);
  }

  verificationSuccess(message: string): void {
    console.log(
      `${ANSI.BRIGHT_GREEN}${ANSI.BOLD}[${this.className}] [Verification : SUCCESS] : ${message}${ANSI.RESET}`
    );
  }

  verificationFailure(message: string): void {
    console.error(
      `${ANSI.RED}${ANSI.BOLD}[${this.className}] [Verification : FAILURE] : ${message}${ANSI.RESET}`
    );
  }

  warning(message: string, ...args: unknown[]): void {
    const formatted = this.format(message, args);
    console.warn(
      `${ANSI.YELLOW}[${this.className}] [Warning] : ${formatted}${ANSI.RESET}`
    );
  }

  error(message: string, th?: Error): void {
    if (th) {
      console.error(
        `${ANSI.RED}[${this.className}] [Exception occurred] ${message} with message ${th}${ANSI.RESET}`
      );
    } else {
      console.error(
        `${ANSI.RED}[${this.className}] [Exception occurred] with message ${message}${ANSI.RESET}`
      );
    }
  }

  /** Truncated error — equivalent to Java truncatedError() */
  truncatedError(errorMessage: string): void {
    const message =
      errorMessage.length > 200
        ? errorMessage.substring(0, 199)
        : errorMessage;
    console.error(
      `${ANSI.RED}[${this.className}] [Exception occurred] with message : ${message} ..... error truncated${ANSI.RESET}`
    );
  }

  testPass(message: string): void {
    console.log(`${ANSI.BRIGHT_GREEN}${message}${ANSI.RESET}`);
  }

  testFail(message: string): void {
    console.error(`${ANSI.RED}${message}${ANSI.RESET}`);
  }

  testSkip(message: string): void {
    console.warn(`${ANSI.YELLOW}${message}${ANSI.RESET}`);
  }

  skip(message: string): void {
    console.warn(`${ANSI.YELLOW}${message}${ANSI.RESET}`);
  }

  pass(message: string): void {
    console.log(`${ANSI.BRIGHT_GREEN}${message}${ANSI.RESET}`);
  }

  fail(message: string): void {
    console.error(`${ANSI.RED}${message}${ANSI.RESET}`);
  }

  wait(message: string, ...args: unknown[]): void {
    const formatted = this.format(message, args);
    console.log(
      `${ANSI.BRIGHT_WHITE}[${this.className}] [Dynamic Wait] : ${formatted}${ANSI.RESET}`
    );
  }

  uiException(errorMessage: string): void {
    console.error(
      `${ANSI.RED}[${this.className}] [UI Exception occurred] : Exception ${errorMessage}${ANSI.RESET}`
    );
  }

  /** SLF4J-style placeholder formatting: "message {} text {}" with args */
  private format(message: string, args: unknown[]): string {
    if (args.length === 0) return message;
    let i = 0;
    return message.replace(/\{}/g, () => {
      if (i < args.length) {
        return String(args[i++]);
      }
      return "{}";
    });
  }
}

/** Singleton logger instance */
export const logger = new NovusLoggerService();
