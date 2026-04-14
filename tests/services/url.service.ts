import { BaseUrlService } from "../../src/core/services/base-url.service";

/**
 * UrlService — application URL service.
 * Equivalent to Java UrlService extending BaseUrlService.
 */
export const urlService = new BaseUrlService(
  process.env.AUT_PROTOCOL || "https://",
  process.env.AUT_DOMAIN || "www.3pillarglobal.com"
);
