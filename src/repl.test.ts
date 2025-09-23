import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "My       name is Hasan        ",
    expected: ["my", "name", "is", "hasan"],
  },
  {
    input: "        heLLo world",
    expected: ["hello", "world"],
  },
  {
    input: "This Is      A Unit Test From             ViteTest",
    expected: ["this", "is", "a", "unit", "test", "from", "vitetest"],
  },
  {
    input: "hi hello there",
    expected: ["hi", "hello", "there"],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const result = cleanInput(input);
    expect(result).toHaveLength(expected.length);
    for (const i in expected) {
      expect(result[i]).toBe(expected[i]);
    }
  });
});
