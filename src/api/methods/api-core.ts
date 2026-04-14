import type { APIResponse } from "@playwright/test";
import { expect } from "@playwright/test";
import { logger } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";

/**
 * StatusCodes — common HTTP status codes.
 * Equivalent to Java ApiCore.StatusCodes enum.
 */
export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
}

/**
 * ApiCore — abstract base for all HTTP method classes.
 * Equivalent to Java ApiCore<T> abstract class.
 */
export abstract class ApiCore<T extends ApiCore<T>> {
  protected _url: string = "";
  protected _params: Record<string, string> = {};
  protected _headers: Record<string, string> = {};
  protected _body?: unknown;
  protected _formData?: Record<string, string>;
  protected _basicAuth?: { username: string; password: string };
  protected _response?: APIResponse;

  abstract execute(): Promise<T>;

  protected self(): T {
    return this as unknown as T;
  }

  atUrl(url: string): T {
    this._url = url;
    return this.self();
  }

  withParam(key: string, value: string): T {
    this._params[key] = value;
    return this.self();
  }

  withHeader(key: string, value: string): T {
    this._headers[key] = value;
    return this.self();
  }

  withBasicAuth(username: string, password: string): T {
    this._basicAuth = { username, password };
    const encoded = Buffer.from(`${username}:${password}`).toString("base64");
    this._headers["Authorization"] = `Basic ${encoded}`;
    return this.self();
  }

  withBody(body: unknown): T {
    this._body = body;
    return this.self();
  }

  jsonBody(body: unknown): T {
    this._body = body;
    this._headers["Content-Type"] = "application/json";
    return this.self();
  }

  withFormData(data: Record<string, string>): T {
    this._formData = data;
    return this.self();
  }

  protected buildUrl(): string {
    if (Object.keys(this._params).length === 0) return this._url;
    const params = new URLSearchParams(this._params).toString();
    return `${this._url}?${params}`;
  }

  get response(): APIResponse {
    if (!this._response) {
      throw new NovusApiException("No response available. Call execute() first.");
    }
    return this._response;
  }

  async mapToObject<R>(): Promise<R> {
    return (await this.response.json()) as R;
  }

  async mapToList<R>(): Promise<R[]> {
    return (await this.response.json()) as R[];
  }

  async printResponse(): Promise<T> {
    const body = await this.response.text();
    logger.info(`Response [${this.response.status()}]: ${body}`);
    return this.self();
  }

  isOk(): T {
    expect(this.response.ok()).toBeTruthy();
    logger.verificationSuccess(`Response status is OK (${this.response.status()})`);
    return this.self();
  }

  statusCodeMatches(expected: number): T {
    expect(this.response.status()).toBe(expected);
    logger.verificationSuccess(`Status code matches ${expected}`);
    return this.self();
  }

  async bodyContains(text: string): Promise<T> {
    const body = await this.response.text();
    expect(body).toContain(text);
    logger.verificationSuccess(`Response body contains '${text}'`);
    return this.self();
  }
}
