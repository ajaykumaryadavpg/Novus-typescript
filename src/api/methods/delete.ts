import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

const log = NovusLoggerService.init("Delete");

/**
 * Delete — HTTP DELETE request.
 * Equivalent to Java Delete class.
 */
export class Delete extends ApiCore<Delete> {
  private apiContext: APIRequestContext;

  private constructor(apiContext: APIRequestContext) {
    super();
    this.apiContext = apiContext;
  }

  static using(apiContext: APIRequestContext): Delete {
    return new Delete(apiContext);
  }

  async execute(): Promise<Delete> {
    const url = this.buildUrl();
    log.info("Executing DELETE on " + url);
    try {
      this.apiResponse = await this.apiContext.delete(url, {
        headers: this._headers,
      });
      log.debug(await this.apiResponse.text());
      return this;
    } catch (error) {
      throw new NovusApiException(
        `DELETE request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
