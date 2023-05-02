import { describe, expect, test, vi } from "vitest";

import rule from "../src/rules/valid-json";
import runRule from "./run-rule";

describe("valid-json", () => {
  const run = runRule(rule);

  describe("valid", () => {
    test("ignores non json files", () => {
      const errors = run({
        code: `
          /*var x = 123;*//*path/to/file.js*/
        `,
        options: [],
        filename: "file.js",
      });

      expect(errors).toHaveLength(0);
    });

    test("ignores non json files", () => {
      const errors = run({
        code: `
          /*var x = 123;*//*path/to/file.js*/
        `,
        options: [],
        filename: "file.js",
      });

      expect(errors).toHaveLength(0);
    });

    test("valid json", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyA": "translation value a",
              "translationKeyB": "translation value b"
          }*//*path/to/file.json*/
        `,
        options: [],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });
  });

  describe("invalid", () => {
    test("invalid json", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyA": "translation value a"
              "translationKeyB: "translation value b"
          }*//*path/to/file.json*/
      `,
        options: [],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
    });

    test("empty file", () => {
      const errors = run({
        code: `
          /**//*path/to/file.json*/
          `,
        options: [],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
    });

    test("parser must return a plain object", () => {
      const errors = run({
        code: `
          /*"SOME_VALID_JSON"*//*path/to/file.json*/
        `,
        options: [],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
      expect(errors[0].data.error).toBeInstanceOf(SyntaxError);
    });
  });
});
