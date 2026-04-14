import { NovusLoggerService } from "../services/novus-logger.service";

const log = NovusLoggerService.init("Retry");

/**
 * Retry — retry logic utility with fluent API.
 * Equivalent to Java Retry class — ALL options included.
 */
export class Retry {
  private actionFn!: () => Promise<void> | void;
  private otherwiseFn?: () => Promise<void> | void;
  private meanwhileFn?: () => Promise<void> | void;
  private retryException: boolean = false;
  private retryCount: number = 1;
  private ignoredErrors: (new (...args: any[]) => Error)[] = [];

  private constructor(action: () => Promise<void> | void) {
    this.actionFn = action;
  }

  static action(fn: () => Promise<void> | void): Retry {
    return new Retry(fn);
  }

  times(numberOfRetries: number): Retry {
    this.retryCount = numberOfRetries;
    return this;
  }

  /** Keep retrying even on success until exception — equivalent to Java untilExceptionEncountered() */
  untilExceptionEncountered(): Retry {
    this.retryException = true;
    return this;
  }

  ignoring(...errorTypes: (new (...args: any[]) => Error)[]): Retry {
    this.ignoredErrors = errorTypes;
    return this;
  }

  meanwhilePerform(fn: () => Promise<void> | void): Retry {
    this.meanwhileFn = fn;
    return this;
  }

  otherwisePerform(fn: () => Promise<void> | void): Retry {
    this.otherwiseFn = fn;
    return this;
  }

  async run(): Promise<void> {
    let count = 1;

    for (let i = 1; i <= this.retryCount; i++) {
      log.info("Retry number {}", i);
      try {
        await this.actionFn();
        if (!this.retryException) break;
      } catch (ex) {
        const error = ex as Error;
        if (
          this.ignoredErrors.length > 0 &&
          this.ignoredErrors.some((errType) => error instanceof errType)
        ) {
          log.info(
            "Encountered exception {} : {}",
            error.name,
            error.message
          );
          if (this.otherwiseFn) {
            await this.otherwiseFn();
          }
        } else {
          log.info(
            "caught exception [ {} ] was not ignored. Hence retry stopped after {} retries",
            error.name,
            i
          );
          break;
        }
      }
      if (this.meanwhileFn) {
        await this.meanwhileFn();
      }
      count = i;
    }
    log.info("Retry Action was complete after {} retries", count);
  }
}
