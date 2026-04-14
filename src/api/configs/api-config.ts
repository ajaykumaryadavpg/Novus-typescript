/**
 * ApiConfig — API request configuration.
 * Equivalent to Java ApiConfig class.
 */
export interface ApiRequestOptions {
  ignoreHTTPSErrors: boolean;
  timeout: number;
}

export const defaultApiConfig: ApiRequestOptions = {
  ignoreHTTPSErrors: true,
  timeout: 100000,
};
