import type { TestInfo } from "@playwright/test";
import type { NovusTestInfo } from "../annotations/metadata";
import { logger } from "./novus-logger.service";

/**
 * NovusReportingService — integrates with Playwright's built-in reporting.
 * Equivalent to Java NovusReportingService that used ExtentReports.
 *
 * In TypeScript/Playwright, we leverage the built-in HTML reporter and
 * Playwright's test annotations/attachments for rich reporting.
 */
export class NovusReportingService {
  private testInfo?: TestInfo;
  private novusTestInfo?: NovusTestInfo;
  private steps: string[] = [];

  init(testInfo: TestInfo): void {
    this.testInfo = testInfo;
    this.steps = [];
  }

  setTestMeta(meta: NovusTestInfo): void {
    this.novusTestInfo = meta;
    if (this.testInfo && meta) {
      if (meta.author) {
        this.testInfo.annotations.push({
          type: "author",
          description: meta.author,
        });
      }
      if (meta.testCaseId) {
        this.testInfo.annotations.push({
          type: "testCaseId",
          description: meta.testCaseId,
        });
      }
      if (meta.category) {
        this.testInfo.annotations.push({
          type: "category",
          description: meta.category,
        });
      }
      if (meta.stories) {
        for (const story of meta.stories) {
          this.testInfo.annotations.push({
            type: "story",
            description: story,
          });
        }
      }
      if (meta.bugs) {
        for (const bug of meta.bugs) {
          this.testInfo.annotations.push({
            type: "bug",
            description: bug,
          });
        }
      }
      if (meta.scenario) {
        this.testInfo.annotations.push({
          type: "scenario",
          description: meta.scenario,
        });
      }
      if (meta.outcome) {
        this.testInfo.annotations.push({
          type: "expectedOutcome",
          description: meta.outcome,
        });
      }
    }
  }

  addStep(description: string): void {
    this.steps.push(description);
    logger.step(description);
  }

  pass(message: string): void {
    logger.verificationSuccess(message);
  }

  fail(message: string): void {
    logger.verificationFailure(message);
  }

  async attachScreenshot(screenshot: Buffer, name: string = "screenshot"): Promise<void> {
    if (this.testInfo) {
      await this.testInfo.attach(name, {
        body: screenshot,
        contentType: "image/png",
      });
    }
  }

  async attachResult(content: string, name: string = "result"): Promise<void> {
    if (this.testInfo) {
      await this.testInfo.attach(name, {
        body: content,
        contentType: "text/plain",
      });
    }
  }
}

/** Singleton reporting service */
export const reportingService = new NovusReportingService();
