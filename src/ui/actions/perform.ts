import type { Actor, Performable } from "../../core/interfaces";
import { logger } from "../../core/services/novus-logger.service";

/**
 * Perform — composite action orchestrator with conditional execution.
 * Equivalent to Java Perform class.
 */
export class Perform implements Performable {
  private actionList: Performable[] = [];
  private conditionalFn?: (actor: Actor) => Promise<boolean>;
  private logMessage?: string;
  private repeatCount: number = 1;
  private onExceptionActions?: Performable[];
  private thenActions?: Performable[];
  private meanwhileActions?: Performable[];

  private constructor() {}

  static actions(...actions: Performable[]): Perform {
    const perform = new Perform();
    perform.actionList = actions;
    return perform;
  }

  iff(condition: (actor: Actor) => Promise<boolean>): Perform {
    this.conditionalFn = condition;
    return this;
  }

  log(message: string): Perform {
    this.logMessage = message;
    return this;
  }

  twice(): Perform {
    this.repeatCount = 2;
    return this;
  }

  thrice(): Perform {
    this.repeatCount = 3;
    return this;
  }

  times(count: number): Perform {
    this.repeatCount = count;
    return this;
  }

  ifExceptionOccurs(...actions: Performable[]): Perform {
    this.onExceptionActions = actions;
    return this;
  }

  then(...actions: Performable[]): Perform {
    this.thenActions = actions;
    return this;
  }

  meanwhile(...actions: Performable[]): Perform {
    this.meanwhileActions = actions;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    if (this.logMessage) {
      logger.step(this.logMessage);
    }

    if (this.conditionalFn) {
      const shouldProceed = await this.conditionalFn(actor);
      if (!shouldProceed) return;
    }

    for (let i = 0; i < this.repeatCount; i++) {
      try {
        for (const action of this.actionList) {
          await action.performAs(actor);
        }
      } catch (error) {
        if (this.onExceptionActions) {
          for (const action of this.onExceptionActions) {
            await action.performAs(actor);
          }
          return;
        }
        throw error;
      }
    }

    if (this.thenActions) {
      for (const action of this.thenActions) {
        await action.performAs(actor);
      }
    }
  }
}
