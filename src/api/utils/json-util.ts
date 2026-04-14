/**
 * JsonUtil — JSON serialization/deserialization helpers.
 * Equivalent to Java JsonUtil using Jackson.
 */
export class JsonUtil {
  static convertToObject<T>(json: string): T {
    return JSON.parse(json) as T;
  }

  static getJsonAsString(obj: unknown): string {
    return JSON.stringify(obj, null, 2);
  }

  static convertToList<T>(json: string): T[] {
    return JSON.parse(json) as T[];
  }
}
