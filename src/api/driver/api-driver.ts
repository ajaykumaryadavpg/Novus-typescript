import { request, type APIRequestContext } from "@playwright/test";
import { defaultApiConfig } from "../configs/api-config";

/**
 * ApiDriver — creates a Playwright APIRequestContext.
 * Equivalent to Java ApiDriver class.
 */
export class ApiDriver {
  static async create(baseURL?: string): Promise<APIRequestContext> {
    return request.newContext({
      baseURL,
      ignoreHTTPSErrors: defaultApiConfig.ignoreHTTPSErrors,
      timeout: defaultApiConfig.timeout,
    });
  }
}
