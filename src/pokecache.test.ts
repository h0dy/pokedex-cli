import { PokeCache } from "./pokecache.js";
import { test, expect } from "vitest";

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500, // 0.5 seconds
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000, // 1 second
  },
  {
    key: "https://cached.com/path",
    val: "moretestdata",
    interval: 2000, // 2 second
  },
  {
    key: "https://cached.com/path",
    val: "moretestdata",
    interval: 300, // 0.3 second
  },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new PokeCache(interval);

  cache.add(key, val);
  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval * 2));
  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});
