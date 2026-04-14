import { expect } from "@playwright/test";
import { logger } from "../../core/services/novus-logger.service";

/**
 * SoftlyVerify — collect multiple verification failures without stopping.
 * Equivalent to Java NovusSoftAssert / SoftlyVerify classes.
 */
export class SoftlyVerify {
  private errors: Error[] = [];
  private description: string = "";

  describedAs(desc: string): SoftlyVerify {
    this.description = desc;
    return this;
  }

  verify<T>(actual: T): SoftVerifyChain<T> {
    return new SoftVerifyChain(actual, this.description, this.errors);
  }

  check(fn: () => void): SoftlyVerify {
    try {
      fn();
      logger.verificationSuccess(this.description || "Soft check passed");
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Soft check failed"}: ${(error as Error).message}`
      );
    }
    return this;
  }

  async checkAsync(fn: () => Promise<void>): Promise<SoftlyVerify> {
    try {
      await fn();
      logger.verificationSuccess(this.description || "Soft check passed");
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Soft check failed"}: ${(error as Error).message}`
      );
    }
    return this;
  }

  verifyAll(): void {
    if (this.errors.length > 0) {
      const messages = this.errors.map((e, i) => `${i + 1}) ${e.message}`).join("\n");
      throw new Error(
        `Soft assertion failures (${this.errors.length}):\n${messages}`
      );
    }
  }

  get failureCount(): number {
    return this.errors.length;
  }
}

export class SoftVerifyChain<T> {
  private actual: T;
  private description: string;
  private errors: Error[];

  constructor(actual: T, description: string, errors: Error[]) {
    this.actual = actual;
    this.description = description;
    this.errors = errors;
  }

  matches(expected: T): SoftVerifyChain<T> {
    try {
      expect(this.actual).toBe(expected);
      logger.verificationSuccess(
        `${this.description || "Value"} matches '${expected}'`
      );
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Value"}: expected '${expected}' but got '${this.actual}'`
      );
    }
    return this;
  }

  contains(expected: string): SoftVerifyChain<T> {
    try {
      expect(String(this.actual)).toContain(expected);
      logger.verificationSuccess(
        `${this.description || "Value"} contains '${expected}'`
      );
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Value"}: expected to contain '${expected}' but got '${this.actual}'`
      );
    }
    return this;
  }

  containsRegex(pattern: RegExp): SoftVerifyChain<T> {
    try {
      expect(String(this.actual)).toMatch(pattern);
      logger.verificationSuccess(
        `${this.description || "Value"} matches regex ${pattern}`
      );
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Value"}: expected to match ${pattern} but got '${this.actual}'`
      );
    }
    return this;
  }

  sizeEquals(expected: number): SoftVerifyChain<T> {
    try {
      const actual = this.actual as unknown;
      if (Array.isArray(actual)) {
        expect(actual).toHaveLength(expected);
      }
      logger.verificationSuccess(
        `${this.description || "Collection"} size equals ${expected}`
      );
    } catch (error) {
      this.errors.push(error as Error);
      logger.verificationFailure(
        `${this.description || "Collection"}: expected size ${expected}`
      );
    }
    return this;
  }
}
