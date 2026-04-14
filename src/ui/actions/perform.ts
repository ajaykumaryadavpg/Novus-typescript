import type { Actor, Performable } from "../../core/interfaces";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusConfigException } from "../../core/exceptions";
import { Waiting } from "./waiting";
import { Retry } from "../../core/utils/retry";

const log = NovusLoggerService.init("Perform");

/**
 * Perform — composite action orchestrator with conditional execution.
 * Equivalent to Java Perform class — ALL options included.
 */
export class Perform implements Performable {
  private taskList: Performable[];
  private logMessage: string = "";
  private callingMethod: string = "";
  private wait: number = 0;
  private meanwhileAction?: () => Promise<void>;
  private otherwiseActions: Performable[] | null = null;
  private count: number = 0;
  private exceptionTypes: (new (...args: any[]) => Error)[] = [];
  private ifLocator: string | null = null;

  private constructor(tasks: Performable[]) {
    this.taskList = tasks;
  }

  static actions(...tasks: Performable[]): Perform {
    return new Perform(tasks);
  }

  /** Conditional execution — equivalent to Java iff(String) */
  iff(locator: string): Perform {
    this.ifLocator = locator;
    return this;
  }

  isPresent(): Perform {
    return this;
  }

  /**
   * Log message — equivalent to Java log(String callingMethod, String log).
   * Two-param signature matching Java exactly.
   */
  log(callingMethod: string, logMessage: string): Perform {
    this.callingMethod = callingMethod;
    this.logMessage = logMessage;
    return this;
  }

  twice(): Perform {
    this.count = 2;
    return this;
  }

  thrice(): Perform {
    this.count = 3;
    return this;
  }

  times(count: number): Perform {
    this.count = count;
    return this;
  }

  /** Exception types to catch — equivalent to Java ifExceptionOccurs(Class<? extends Throwable>...) */
  ifExceptionOccurs(
    ...exceptionTypes: (new (...args: any[]) => Error)[]
  ): Perform {
    this.exceptionTypes = exceptionTypes;
    return this;
  }

  /** Actions to run after retries or on exception — equivalent to Java then(Performable...) */
  then(...actions: Performable[]): Perform {
    this.otherwiseActions = actions;
    return this;
  }

  /** Meanwhile action — equivalent to Java meanwhile(Runnable) */
  meanwhile(action: () => Promise<void>): Perform {
    this.meanwhileAction = action;
    return this;
  }

  byWaitingFor(seconds: number): Perform {
    this.wait = seconds;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    if (this.wait > 0) {
      await actor.isWaitingForSeconds(this.wait);
    }

    if (!this.logMessage) {
      throw new NovusConfigException(
        'please add a log after calling the "actions" method'
      );
    }

    log.step(
      `[ method : ${this.callingMethod} ] - ${this.logMessage}`
    );

    // Conditional check
    if (
      this.ifLocator === null ||
      (await actor.is(Waiting.on(this.ifLocator).seconds(10)))
    ) {
      if (this.count === 0) {
        await actor.attemptsTo(...this.taskList);
      } else {
        const retry = Retry.action(async () => {
          await actor.attemptsTo(...this.taskList);
        })
          .times(this.count)
          .ignoring(...this.exceptionTypes);

        if (this.otherwiseActions) {
          retry.otherwisePerform(async () => {
            await actor.attemptsTo(...this.otherwiseActions!);
          });
        }

        if (this.meanwhileAction) {
          retry.meanwhilePerform(this.meanwhileAction);
        }

        await retry.run();
      }
    } else {
      log.warning(
        `Condition check failed for locator : ${this.ifLocator} so subsequent actions were not performed`
      );
    }
  }
}
