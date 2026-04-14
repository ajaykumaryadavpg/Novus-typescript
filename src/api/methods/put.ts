import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { logger } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

/**
 * Put — HTTP PUT request.
 * Equivalent to Java Put class.
 */
export class Put extends ApiCore<Put> {
  private apiContext: APIRequestContext;

  private constructor(apiContext: APIRequestContext) {
    super();
    this.apiContext = apiContext;
  }

  static using(apiContext: APIRequestContext): Put {
    return new Put(apiContext);
  }

  async execute(): Promise<Put> {
    const url = this.buildUrl();
    logger.step(`PUT ${url}`);
    try {
      this._response = await this.apiContext.put(url, {
        headers: this._headers,
        data: this._body,
        form: this._formData,
      });
      return this;
    } catch (error) {
      throw new NovusApiException(
        `PUT request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
