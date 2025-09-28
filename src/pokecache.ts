export type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class PokeCache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalID: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(interval: number) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  add<T>(key: string, val: T) {
    let entry: CacheEntry<T> = {
      createdAt: Date.now(),
      val,
    };
    this.#cache.set(key, entry);
  }

  get<T>(key: string) {
    return this.#cache.get(key)?.val as T;
  }

  #reap() {
    this.#cache.forEach((entry, key) => {
      if (entry.createdAt < Date.now() - this.#interval) {
        this.#cache.delete(key);
      }
    });
  }

  #startReapLoop() {
    this.#reapIntervalID = setInterval(() => {
      this.#reap();
    }, this.#interval);
  }

  stopReapLoop() {
    clearInterval(this.#reapIntervalID);
    this.#reapIntervalID = undefined;
  }
}
