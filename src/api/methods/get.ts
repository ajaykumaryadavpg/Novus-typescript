import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { logger } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

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

  static using(apiContext: APIRequestContext): Get {
    return new Get(apiContext);
  }

  async execute(): Promise<Get> {
    const url = this.buildUrl();
    logger.step(`GET ${url}`);
    try {
      this._response = await this.apiContext.get(url, {
        headers: this._headers,
      });
      return this;
    } catch (error) {
      throw new NovusApiException(
        `GET request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
