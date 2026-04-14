/**
 * BaseUrlService — provides the application URL.
 * Equivalent to Java BaseUrlService abstract class.
 */
export class BaseUrlService {
  private protocol: string;
  private domain: string;

  constructor(
    protocol: string = process.env.AUT_PROTOCOL || "https://",
    domain: string = process.env.AUT_DOMAIN || "www.3pillarglobal.com"
  ) {
    this.protocol = protocol;
    this.domain = domain;
  }

  getAppUrl(): string {
    return `${this.protocol}${this.domain}`;
  }

  getProtocol(): string {
    return this.protocol;
  }

  getDomain(): string {
    return this.domain;
  }
}
