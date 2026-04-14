import type { APIResponse } from "@playwright/test";
import { expect } from "@playwright/test";
import { NovusLoggerService } from "../../core/services/novus-logger.service";
import { NovusApiException } from "../../core/exceptions";
import { JsonUtil } from "../utils/json-util";
import * as path from "path";
import * as fs from "fs";

const log = NovusLoggerService.init("ApiCore");

/**
 * StatusCodes — common HTTP status codes.
 * Equivalent to Java ApiCore.StatusCodes enum — ALL values included.
 */
export enum StatusCodes {
  HTTP_200 = 200,
  HTTP_201 = 201,
  HTTP_202 = 202,
  HTTP_203 = 203,
  HTTP_204 = 204,
}

/** Convenience aliases */
export const OK = StatusCodes.HTTP_200;
export const CREATED = StatusCodes.HTTP_201;
export const ACCEPTED = StatusCodes.HTTP_202;
export const NO_CONTENT = StatusCodes.HTTP_204;

/** Get all valid status codes */
export function statusCodesList(): number[] {
  return Object.values(StatusCodes).filter(
    (v) => typeof v === "number"
  ) as number[];
}

/**
 * ApiCore — abstract base for all HTTP method classes.
 * Equivalent to Java ApiCore<T> abstract class — ALL methods included.
 */
export abstract class ApiCore<T extends ApiCore<T>> {
  protected endpoint: string = "";
  protected apiResponse?: APIResponse;
  protected _headers: Record<string, string> = {};
  protected _params: Record<string, string> = {};
  protected _body?: unknown;
  protected _formData?: Record<string, string>;
  protected _multipartData?: Record<string, unknown>;

  abstract execute(): Promise<T>;

  protected self(): T {
    return this as unknown as T;
  }

  atUrl(url: string): T {
    this.endpoint = url;
    return this.self();
  }

  withParam(key: string, value: string | number): T {
    this._params[key] = String(value);
    return this.self();
  }

  withBasicAuth(username: string, password: string): T {
    const encoded = Buffer.from(`${username}:${password}`).toString("base64");
    this._headers["Authorization"] = `Basic ${encoded}`;
    return this.self();
  }

  withBody(payload: unknown): T {
    this._body = payload;
    return this.self();
  }

  /** Body with custom content-type — equivalent to Java withBody(B payload, String type) */
  withBodyAndType(payload: unknown, contentType: string): T {
    this._body = payload;
    this._headers["Content-type"] = contentType;
    return this.self();
  }

  jsonBody(payload: unknown): T {
    this._body = JsonUtil.getJsonAsString(payload);
    this._headers["Content-Type"] = "application/json";
    return this.self();
  }

  withHeader(key: string, value: string): T {
    this._headers[key] = value;
    return this.self();
  }

  withFormData(keyValue: Record<string, string>): T {
    this._formData = keyValue;
    return this.self();
  }

  /** File upload via multipart — equivalent to Java withBinary(String pathWithFileName) */
  withBinary(pathWithFileName: string): T {
    const fullPath = path.join(process.cwd(), pathWithFileName);
    this._multipartData = {
      file: fs.createReadStream(fullPath),
    };
    return this.self();
  }

  protected buildUrl(): string {
    if (Object.keys(this._params).length === 0) return this.endpoint;
    const params = new URLSearchParams(this._params).toString();
    return `${this.endpoint}?${params}`;
  }

  /** Map response to object — equivalent to Java mapToObject(Class<B>) */
  async mapToObject<B>(): Promise<B> {
    return JsonUtil.convertToObject<B>(await this.apiResponse!.text());
  }

  /** Map response to list — equivalent to Java mapToList(Class<B>) */
  async mapToList<B>(): Promise<B[]> {
    return JsonUtil.convertToList<B>(await this.apiResponse!.text());
  }

  /** Print response — equivalent to Java printResponse() */
  async printResponse(): Promise<T> {
    log.debug(await this.apiResponse!.text());
    return this.self();
  }

  /** Assert response is OK — equivalent to Java isOk() */
  isOk(): T {
    log.info("encountered status code : " + this.apiResponse!.status());
    expect(this.apiResponse!.ok()).toBeTruthy();
    log.verificationSuccess(`[Status code : ${this.apiResponse!.status()} encountered]`);
    return this.self();
  }

  /** Assert response is NOT OK — equivalent to Java isNotOk() */
  isNotOk(): T {
    expect(this.apiResponse!.ok()).toBeFalsy();
    log.verificationSuccess(`[Status code : ${this.apiResponse!.status()} encountered]`);
    return this.self();
  }

  /** Check if status is ok — returns boolean — equivalent to Java statusOk() */
  statusOk(): boolean {
    log.info("Response received : " + this.apiResponse!.status());
    return statusCodesList().includes(this.apiResponse!.status());
  }

  /** Assert exact status code — equivalent to Java statusCodeMatches(int) */
  statusCodeMatches(expected: number): T {
    expect(this.apiResponse!.status()).toBe(expected);
    log.verificationSuccess(`[Status code : ${this.apiResponse!.status()} encountered]`);
    return this.self();
  }

  /** Assert body contains — equivalent to Java bodyContains(String) */
  async bodyContains(subString: string): Promise<T> {
    const body = await this.apiResponse!.text();
    expect(body).toContain(subString);
    log.verificationSuccess(`[Body contains : "${subString}" substring]`);
    return this.self();
  }

  /** Get response body as string — equivalent to Java getContent() */
  async getContent(): Promise<string> {
    return this.apiResponse!.text();
  }

  /** Get response body as Buffer — equivalent to Java getBody() */
  async getBody(): Promise<Buffer> {
    return Buffer.from(await this.apiResponse!.body());
  }

  /** Get response object — equivalent to Java getResponse() */
  get response(): APIResponse {
    if (!this.apiResponse) {
      throw new NovusApiException("No response available. Call execute() first.");
    }
    return this.apiResponse;
  }
}
