import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

const log = NovusLoggerService.init("Put");

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
    log.info("Executing PUT on " + url);
    try {
      this.apiResponse = await this.apiContext.put(url, {
        headers: this._headers,
        data: this._body,
        form: this._formData,
        multipart: this._multipartData as any,
      });
      log.debug(await this.apiResponse.text());
      return this;
    } catch (error) {
      throw new NovusApiException(
        `PUT request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
