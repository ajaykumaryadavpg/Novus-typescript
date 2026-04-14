import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import { NovusLoggerService } from "../../src/core/services/novus-logger.service";
import type { NovusTest } from "../../src/core/annotations/metadata";

const log = NovusLoggerService.init("NovusTestListener");

/**
 * NovusTestListener — Playwright custom reporter.
 * Equivalent to Java NovusTestListener implementing ITestListener.
 *
 * Tracks test results by category, prints test tables on completion.
 */
export default class NovusTestListener implements Reporter {
  private testMap: Map<string, Set<NovusTest>> = new Map();
  private tests: Set<NovusTest> = new Set();

  onBegin(config: FullConfig, suite: Suite): void {
    log.info(`Running test suite : ${suite.title || "Default"}`);
    log.info(`Total tests : ${suite.allTests().length}`);
  }

  onTestBegin(test: TestCase): void {
    log.test(test.title);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const status =
      result.status === "passed"
        ? "passed"
        : result.status === "failed"
        ? "failed"
        : "skipped";

    if (status === "passed") {
      log.testPass("-----.: Test passed :.-----");
    } else if (status === "failed") {
      log.testFail("-----.: Test failed :.-----");
    } else {
      log.testSkip("-----.: Test skipped :.-----");
    }

    this.addTestResult(test, result, status as "passed" | "failed" | "skipped");
  }

  onEnd(result: FullResult): void {
    log.info("- Tests Summary -");
    this.createResultMap();
    this.printTestTable();
  }

  private addTestResult(
    test: TestCase,
    result: TestResult,
    status: "passed" | "failed" | "skipped"
  ): void {
    const annotations = test.annotations;
    const scenario =
      annotations.find((a) => a.type === "scenario")?.description ||
      test.title;
    const category =
      annotations.find((a) => a.type === "category")?.description ||
      "default";

    const novusTest: NovusTest = {
      scenario,
      status,
      category,
      failureMessage:
        status === "failed" ? result.errors?.[0]?.message : undefined,
    };

    this.tests.add(novusTest);
    if (!this.testMap.has(category)) {
      this.testMap.set(category, new Set());
    }
  }

  private createResultMap(): void {
    this.tests.forEach((t) => {
      const category = t.category || "default";
      if (!this.testMap.has(category)) {
        this.testMap.set(category, new Set());
      }
      this.testMap.get(category)!.add(t);
    });
  }

  private printTestTable(): void {
    let builder = "";
    Array.from(this.testMap.entries()).forEach(([category, tests]) => {
      builder += `\nCategory : ${category}`;
      tests.forEach((novusTest) => {
        builder += `\n| ${novusTest.scenario} | ${novusTest.status} |`;
      });
      builder += "\n________________________________________________";
    });
    if (builder) {
      log.info(builder);
    }
  }
}
