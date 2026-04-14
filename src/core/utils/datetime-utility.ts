/**
 * DateTimeUtility — date/time parsing and formatting helpers.
 * Equivalent to Java DateTimeUtility with DateTimeFormatter patterns.
 */

export class DateTimeUtility {
  static readonly FORMATS = {
    ISO_DATE: "yyyy-MM-dd",
    ISO_DATE_TIME: "yyyy-MM-dd'T'HH:mm:ss",
    US_DATE: "MM/dd/yyyy",
    US_DATE_TIME: "MM/dd/yyyy HH:mm:ss",
    EU_DATE: "dd/MM/yyyy",
    EU_DATE_TIME: "dd/MM/yyyy HH:mm:ss",
    DISPLAY_DATE: "MMMM dd, yyyy",
    TIME_12H: "hh:mm a",
    TIME_24H: "HH:mm:ss",
    REPORT_TIMESTAMP: "yyyy-MM-dd_HH-mm-ss",
  } as const;

  static formatDate(date: Date, locale: string = "en-US"): string {
    return date.toLocaleDateString(locale);
  }

  static formatTime(date: Date, locale: string = "en-US"): string {
    return date.toLocaleTimeString(locale);
  }

  static formatDateTime(date: Date, locale: string = "en-US"): string {
    return date.toLocaleString(locale);
  }

  static formatISO(date: Date): string {
    return date.toISOString();
  }

  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  static now(): Date {
    return new Date();
  }

  static reportTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  }
}
