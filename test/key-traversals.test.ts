import { describe, expect, it } from "vitest";

import { keyTraversals } from "../src/util/key-traversals";

const expected = ["c", "b", "a", "C", "B", "A"];

describe("keyTraversals", () => {
  it("sorts object keys in descending case sensitive order", () => {
    expect(
      keyTraversals.desc({
        C: "value",
        B: "value",
        A: "value",
        b: "value",
        a: "value",
        c: "value",
      })
    ).toEqual(expected);
  });

  it("sorts object keys in ascending case sensitive order", () => {
    expect(
      keyTraversals.asc({
        C: "value",
        B: "value",
        A: "value",
        b: "value",
        a: "value",
        c: "value",
      })
    ).toEqual(expected.reverse());
  });
});
