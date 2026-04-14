import { logger } from "../services/novus-logger.service";

/**
 * Retry — retry logic utility with fluent API.
 * Equivalent to Java Retry class.
 */
export class Retry {
  private actionFn!: () => Promise<void>;
  private retryCount: number = 1;
  private ignoredErrors: (new (...args: any[]) => Error)[] = [];
  private meanwhileFn?: () => Promise<void>;
  private otherwiseFn?: () => Promise<void>;

  static action(fn: () => Promise<void>): Retry {
    const retry = new Retry();
    retry.actionFn = fn;
    return retry;
  }

  times(count: number): Retry {
    this.retryCount = count;
    return this;
  }

  ignoring(...errorTypes: (new (...args: any[]) => Error)[]): Retry {
    this.ignoredErrors = errorTypes;
    return this;
  }

  meanwhilePerform(fn: () => Promise<void>): Retry {
    this.meanwhileFn = fn;
    return this;
  }

  otherwisePerform(fn: () => Promise<void>): Retry {
    this.otherwiseFn = fn;
    return this;
  }

  async run(): Promise<void> {
    let lastError: Error | undefined;

    for (let i = 0; i < this.retryCount; i++) {
      try {
        await this.actionFn();
        return;
      } catch (error) {
        lastError = error as Error;
        const isIgnored = this.ignoredErrors.some(
          (errType) => error instanceof errType
        );

        if (isIgnored || i < this.retryCount - 1) {
          logger.warning(
            `Retry attempt ${i + 1}/${this.retryCount} failed: ${lastError.message}`
          );
          if (this.meanwhileFn) {
            await this.meanwhileFn();
          }
          continue;
        }
      }
    }

    if (this.otherwiseFn) {
      await this.otherwiseFn();
    } else if (lastError) {
      throw lastError;
    }
  }
}
