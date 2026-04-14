/**
 * NovusLoggerService — colored console logging.
 * Equivalent to Java NovusLoggerService with ANSI colors.
 */

const ANSI = {
  RESET: "\x1b[0m",
  BLUE: "\x1b[34m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  GREEN: "\x1b[32m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  BOLD: "\x1b[1m",
};

export class NovusLoggerService {
  private prefix: string;

  constructor(prefix: string = "NOVUS") {
    this.prefix = prefix;
  }

  step(message: string): void {
    console.log(
      `${ANSI.BLUE}${ANSI.BOLD}[${this.prefix}] STEP:${ANSI.RESET} ${ANSI.BLUE}${message}${ANSI.RESET}`
    );
  }

  info(message: string): void {
    console.log(
      `${ANSI.MAGENTA}[${this.prefix}] INFO:${ANSI.RESET} ${message}`
    );
  }

  debug(message: string): void {
    console.log(
      `${ANSI.CYAN}[${this.prefix}] DEBUG:${ANSI.RESET} ${message}`
    );
  }

  warning(message: string): void {
    console.warn(
      `${ANSI.YELLOW}[${this.prefix}] WARN:${ANSI.RESET} ${ANSI.YELLOW}${message}${ANSI.RESET}`
    );
  }

  error(message: string): void {
    console.error(
      `${ANSI.RED}[${this.prefix}] ERROR:${ANSI.RESET} ${ANSI.RED}${message}${ANSI.RESET}`
    );
  }

  verificationSuccess(message: string): void {
    console.log(
      `${ANSI.GREEN}${ANSI.BOLD}[${this.prefix}] PASS:${ANSI.RESET} ${ANSI.GREEN}${message}${ANSI.RESET}`
    );
  }

  verificationFailure(message: string): void {
    console.error(
      `${ANSI.RED}${ANSI.BOLD}[${this.prefix}] FAIL:${ANSI.RESET} ${ANSI.RED}${message}${ANSI.RESET}`
    );
  }
}

/** Singleton logger instance */
export const logger = new NovusLoggerService();
