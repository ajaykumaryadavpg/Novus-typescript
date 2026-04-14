import { expect } from "@playwright/test";
import { logger } from "../../core/services/novus-logger.service";

/**
 * NovusSoftAssert — collect multiple verification failures without stopping.
 * Equivalent to Java NovusSoftAssert class extending AssertJ SoftAssertions.
 *
 * Provides a fluent API: softAssert.verify("description").actual(value).matches(expected)
 */
export class NovusSoftAssert {
  private errors: Error[] = [];
  private errorsOccurred: number = 0;
  private _actual: unknown = undefined;
  private _collection: unknown[] = [];
  private _logMessage: string = "";

  verify(describeAs: string): NovusSoftAssert {
    this._logMessage = describeAs;
    return this;
  }

  actual(value: unknown): NovusSoftAssert {
    this._actual = value;
    return this;
  }

  actualCollection<T>(value: T[]): NovusSoftAssert {
    this._collection = [...value];
    return this;
  }

  matches(expected: unknown): void {
    try {
      if (typeof this._actual === "string" && typeof expected === "string") {
        expect(String(this._actual).toLowerCase()).toBe(expected.toLowerCase());
      } else {
        expect(this._actual).toBe(expected);
      }
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - Expected : [${expected}] Found : [${this._actual}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [${this._logMessage}] - Expected : [${expected}] but Found : [${this._actual}]`
      );
    }
  }

  isNotNull(): void {
    try {
      expect(this._actual).not.toBeNull();
      expect(this._actual).not.toBeUndefined();
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is not null`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is null`
      );
    }
  }

  isEmpty(): void {
    try {
      expect(String(this._actual)).toBe("");
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is empty`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is not empty`
      );
    }
  }

  isNotEmpty(): void {
    try {
      expect(String(this._actual).length).toBeGreaterThan(0);
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is not empty`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [${this._logMessage}] - Actual value : [${this._actual}] is empty`
      );
    }
  }

  contains(...expected: string[]): NovusSoftAssert {
    try {
      for (const exp of expected) {
        expect(String(this._actual)).toContain(exp);
      }
      if (this.errorsOccurred === this.errors.length) {
        const str = String(this._actual).length > 200
          ? String(this._actual).substring(0, 100)
          : String(this._actual);
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - actual full String : [${str}] to contain : [${expected}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual full String : [${this._actual}] to contain : [${expected}]`
      );
    }
    return this;
  }

  containsRegex(regex: string | RegExp): NovusSoftAssert {
    try {
      const pattern = typeof regex === "string" ? new RegExp(regex) : regex;
      expect(String(this._actual)).toMatch(pattern);
      if (this.errorsOccurred === this.errors.length) {
        const str = String(this._actual).length > 200
          ? String(this._actual).substring(0, 100)
          : String(this._actual);
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - actual full String : [${str}] to contain : [${regex}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual full String : [${this._actual}] to contain : [${regex}]`
      );
    }
    return this;
  }

  doesNotContain(...expected: string[]): void {
    try {
      for (const exp of expected) {
        expect(String(this._actual)).not.toContain(exp);
      }
      if (this.errorsOccurred === this.errors.length) {
        const str = String(this._actual).length > 200
          ? String(this._actual).substring(0, 100)
          : String(this._actual);
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - actual full String : [${str}] to not contain : [${expected}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual full String : [${this._actual}] to not contain : [${expected}]`
      );
    }
  }

  containsIgnoreCase(expected: string): NovusSoftAssert {
    try {
      expect(String(this._actual).toLowerCase()).toContain(expected.toLowerCase());
      if (this.errorsOccurred === this.errors.length) {
        const str = String(this._actual).length > 200
          ? String(this._actual).substring(0, 100)
          : String(this._actual);
        logger.verificationSuccess(
          `soft assert : [${this._logMessage}] - actual full String : [${str}] to contain ignoring case: [${expected}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual full String : [${this._actual}] to contain ignoring case : [${expected}]`
      );
    }
    return this;
  }

  isIn(...expected: string[]): void {
    try {
      expect(expected).toContain(String(this._actual));
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [ ${this._logMessage} ] - full String : [${this._actual}] contains : [${expected}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - expected full String : [${this._actual}] to contain : [${expected}]`
      );
    }
  }

  sizeEquals(expectedSize: number): void {
    try {
      expect(this._collection).toHaveLength(expectedSize);
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [ ${this._logMessage} ] - expected size of list : [${expectedSize}]  matches actual size : [${this._collection.length}]`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - expected size of list : [${expectedSize}]  did not match actual size : [${this._collection.length}] in ${JSON.stringify(this._collection)}`
      );
    }
  }

  containsAll(expectedValues: unknown[]): void {
    try {
      for (const val of expectedValues) {
        expect(this._collection).toContain(val);
      }
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [ ${this._logMessage} ] - actual list contains all values of expected list`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual list doesn't contain all the values of expected list`
      );
    }
  }

  isBetween(expectedDate1: Date, expectedDate2: Date): void {
    try {
      const actualDate = this._actual as Date;
      expect(actualDate.getTime()).toBeGreaterThanOrEqual(expectedDate1.getTime());
      expect(actualDate.getTime()).toBeLessThanOrEqual(expectedDate2.getTime());
      if (this.errorsOccurred === this.errors.length) {
        logger.verificationSuccess(
          `soft assert : [ ${this._logMessage} ] - actual date is between date range`
        );
      }
    } catch (error) {
      this.errors.push(error as Error);
      this.errorsOccurred = this.errors.length;
      logger.verificationFailure(
        `soft assert : [ ${this._logMessage} ] - actual date is not between date range`
      );
    }
  }

  and(): NovusSoftAssert {
    return this;
  }

  verifyAllSoftAssertions(): void {
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

/**
 * SoftlyVerify — wrapper for soft assertions with describedAs.
 * Equivalent to Java SoftlyVerify class.
 */
export class SoftlyVerify {
  private softAssertions: NovusSoftAssert;
  private text: string = "";

  constructor(softAssertions?: NovusSoftAssert) {
    this.softAssertions = softAssertions || new NovusSoftAssert();
  }

  static verify(softAssertions: NovusSoftAssert): SoftlyVerify {
    return new SoftlyVerify(softAssertions);
  }

  describedAs(log: string): SoftlyVerify {
    this.text = log;
    return this;
  }

  check<T>(actual: T): SoftVerifyChain<T> {
    return new SoftVerifyChain(actual, this.text, this.softAssertions);
  }

  /** Convenience: verify all collected assertions */
  verifyAll(): void {
    this.softAssertions.verifyAllSoftAssertions();
  }

  get failureCount(): number {
    return this.softAssertions.failureCount;
  }
}

/**
 * SoftVerifyChain<T> — fluent assertion chain for soft assertions.
 */
export class SoftVerifyChain<T> {
  private _actual: T;
  private description: string;
  private softAssert: NovusSoftAssert;

  constructor(actual: T, description: string, softAssert: NovusSoftAssert) {
    this._actual = actual;
    this.description = description;
    this.softAssert = softAssert;
  }

  matches(expected: T): SoftVerifyChain<T> {
    this.softAssert.verify(this.description).actual(this._actual).matches(expected);
    return this;
  }

  contains(expected: string): SoftVerifyChain<T> {
    this.softAssert.verify(this.description).actual(this._actual).contains(expected);
    return this;
  }

  containsRegex(pattern: RegExp | string): SoftVerifyChain<T> {
    this.softAssert.verify(this.description).actual(this._actual).containsRegex(pattern);
    return this;
  }

  sizeEquals(expected: number): SoftVerifyChain<T> {
    if (Array.isArray(this._actual)) {
      this.softAssert.verify(this.description).actualCollection(this._actual as unknown[]).sizeEquals(expected);
    }
    return this;
  }
}
