import type { APIRequestContext } from "@playwright/test";
import { ApiCore } from "./api-core";
import { logger } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

/**
 * Post — HTTP POST request.
 * Equivalent to Java Post class.
 */
export class Post extends ApiCore<Post> {
  private apiContext: APIRequestContext;

  private constructor(apiContext: APIRequestContext) {
    super();
    this.apiContext = apiContext;
  }

  static using(apiContext: APIRequestContext): Post {
    return new Post(apiContext);
  }

  async execute(): Promise<Post> {
    const url = this.buildUrl();
    logger.step(`POST ${url}`);
    try {
      this._response = await this.apiContext.post(url, {
        headers: this._headers,
        data: this._body,
        form: this._formData,
      });
      return this;
    } catch (error) {
      throw new NovusApiException(
        `POST request failed for '${url}': ${(error as Error).message}`
      );
    }
  }
}
