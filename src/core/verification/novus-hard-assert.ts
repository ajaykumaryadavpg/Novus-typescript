import { expect } from "@playwright/test";
import type { Actor, Verifiable } from "../interfaces";
import { NovusLoggerService } from "../services/novus-logger.service";

/**
 * NovusHardAssert — hard assertion that implements Verifiable.
 * Equivalent to Java NovusHardAssert<T> class.
 *
 * Usage:
 *   actor.wantsTo(NovusHardAssert.verify(actual, expected).describedAs("description"))
 */
export class NovusHardAssert<T> implements Verifiable {
  private obj: T;
  private expected: T;
  private logMessage: string = "";
  private log = NovusLoggerService.init("NovusHardAssert");

  private constructor(obj: T, expected: T) {
    this.obj = obj;
    this.expected = expected;
  }

  static verify<T>(actual: T, expected: T): NovusHardAssert<T> {
    return new NovusHardAssert(actual, expected);
  }

  describedAs(log: string): NovusHardAssert<T> {
    this.logMessage = log;
    return this;
  }

  byWaitingFor(_seconds: number): NovusHardAssert<T> {
    return this;
  }

  async verifyAs(_actor: Actor): Promise<void> {
    try {
      expect(this.obj).toBe(this.expected);
      if (typeof this.obj === "string" && (this.obj as string).length > 100) {
        this.log.verificationSuccess(
          `${this.logMessage} - ${String(this.obj).substring(0, 100)}..... matches ${this.expected}`
        );
      } else {
        this.log.verificationSuccess(
          `${this.logMessage} - ${this.obj} matches ${this.expected}`
        );
      }
    } catch (error) {
      const message = (error as Error).message;
      this.log.verificationFailure(message);
      throw new Error(message);
    }
  }
}
