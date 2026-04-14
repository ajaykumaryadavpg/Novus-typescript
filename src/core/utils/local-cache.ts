/**
 * LocalCache — simple key-value cache.
 * Equivalent to Java ThreadLocal-based LocalCache.
 * In Node.js, each Playwright worker runs in its own process, so a simple Map suffices.
 */
export class LocalCache {
  private static store = new Map<string, unknown>();

  static cache<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  static fetch<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  static remove(key: string): void {
    this.store.delete(key);
  }

  static clear(): void {
    this.store.clear();
  }

  static has(key: string): boolean {
    return this.store.has(key);
  }
}
