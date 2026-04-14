import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

const log = NovusLoggerService.init("Get");

/**
 * Get — HTTP GET request.
 * Equivalent to Java Get class.
 */
export class Get extends ApiCore<Get> {
  private apiContext: APIRequestContext;

  private constructor(apiContext: APIRequestContext) {
    super();
    this.apiContext = apiContext;
  }

  /** Factory — equivalent to Java Get.atUrl(String) */
  static using(apiContext: APIRequestContext): Get {
    return new Get(apiContext);
  }

  async execute(): Promise<Get> {
    const url = this.buildUrl();
    try {
      this.apiResponse = await this.apiContext.get(url, {
        headers: this._headers,
      });
      log.info("Executing GET on " + this.apiResponse.url());
      log.debug(await this.apiResponse.text());
      return this;
    } catch (error) {
      throw new NovusApiException(
        `GET request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
