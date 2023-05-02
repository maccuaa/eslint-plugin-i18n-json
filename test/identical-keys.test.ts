import { describe, expect, test, vi } from "vitest";

import { Json } from "../src/types";
import { requireNoCache } from "../src/util/require-no-cache";
import rule from "../src/rules/identical-keys";
import runRule from "./run-rule";

vi.mock("../src/util/require-no-cache", () => ({
  requireNoCache: (path: string) => {
    const paths: { [key: string]: Json } = {
      "path/to/compare-file-a.json": {
        translationLevelOne: {
          translationKeyA: "value a",
          translationLevelTwo: {
            translationKeyB: "value b",
            translationsLevelThree: {
              translationKeyC: "value c",
            },
          },
        },
      },
      "path/to/compare-file-b.json": {
        translationLevelOne: {
          translationKeyA: "value a",
          translationKeyB: "value b",
          translationKeyC: "value c",
        },
      },
      "path/to/wrong-structure-generator.js": {
        "other-key": "other value",
      },
    };

    const fileContents = paths[path];

    if (fileContents) {
      return fileContents;
    } else {
      throw Error("file not found");
    }
  },
}));

describe("identical-keys", () => {
  const run = runRule(rule);

  describe("valid", () => {
    test("ignore non-json files", () => {
      const errors = run({
        code: `
          /*var x = 123;*//*path/to/file.js*/
        `,
        options: [],
        filename: "file.js",
      });

      expect(errors).toHaveLength(0);
    });

    test("single file path to compare with", () => {
      const errors = run({
        code: `
          /*{
            "translationLevelOne": {
              "translationKeyA": "value a",
              "translationLevelTwo": {
                "translationKeyB": "value b",
                "translationsLevelThree": {
                  "translationKeyC": "value c"
                }
              }
            }
          }*//*path/to/file.json*/
          `,
        options: [
          {
            filePath: "path/to/compare-file-a.json",
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("mapping to match which file we should use to compare structure", () => {
      const errors = run({
        code: `
          /*{
            "translationLevelOne": {
              "translationKeyA": "value a",
              "translationLevelTwo": {
                "translationKeyB": "value b",
                "translationsLevelThree": {
                  "translationKeyC": "value c"
                }
              }
            }
          }*//*/path/to/compare-file-a.json*/
          `,
        options: [
          {
            filePath: {
              "compare-file-a.json": "path/to/compare-file-a.json",
              "compare-file-b.json": "path/to/compare-file-b.json",
            },
          },
        ],
        filename: "compare-file-a.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("let the i18n-json/valid-json rule catch the invalid json file errors", () => {
      const errors = run({
        code: `
          /*{*//*path/to/file.json*/
          `,
        options: [
          {
            filePath: "path/to/compare-file.json",
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("ignore-keys global setting", () => {
      const errors = run({
        code: `
          /*{
            "translationLevelOne": {
              "translationKeyA": "value a",
              "translationLevelTwo": {
                "translationKeyD": "value d",
                "translationsLevelThree": {
                  "translationKeyE": "value e"
                }
              }
            }
          }*//*path/to/file.json*/
          `,
        options: [
          {
            filePath: "path/to/compare-file-a.json",
          },
        ],
        filename: "file.json",
        settings: {
          "i18n-json/ignore-keys": ["translationLevelOne.translationLevelTwo"],
        },
      });

      expect(errors).toHaveLength(0);
    });
  });

  describe("invalid", () => {
    test("no option passed", () => {
      // options is undefined
      let errors = run({
        code: `
        /*{}*//*path/to/file.json*/
        `,
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("filePathMissing");

      // options is empty array
      errors = run({
        code: `
        /*{}*//*path/to/file.json*/
        `,
        filename: "file.json",
        options: [],
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("filePathMissing");

      // options is empty object
      errors = run({
        code: `
        /*{}*//*path/to/file.json*/
        `,
        filename: "file.json",
        options: [{}],
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("filePathMissing");

      // options is empty string
      errors = run({
        code: `
        /*{}*//*path/to/file.json*/
        `,
        filename: "file.json",
        options: [{ filepath: "" }],
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("filePathMissing");
    });

    test("comparison file doesn't exist", () => {
      const errors = run({
        code: `
    /*{}*//*path/to/file.json*/
    `,
        options: [
          {
            filePath: "path/to/does-not-exist.js",
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("importError");
    });

    test("single comparison file - structure mismatch", () => {
      const errors = run({
        code: `
        /*{
          "translationLevelOne": {
            "translationKeyY": "value y",
            "translationKeyZ": "value z"
          }
        }*//*/path/to/invalid-file.json*/
        `,
        options: [
          {
            filePath: "path/to/compare-file-a.json",
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("diff");
    });

    test("map of comparison files - structure mismatch", () => {
      const errors = run({
        code: `
        /*{
          "translationLevelOne": {
            "translationKeyY": "value y",
            "translationKeyZ": "value z"
          }
        }*//*/path/to/file.json*/
        `,
        options: [
          {
            filePath: {
              "file.json": "path/to/compare-file-a.json",
            },
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("diff");
    });

    test("structure generator function - structure mismatch", () => {
      const errors = run({
        code: `
        /*{
          "translationLevelOne": {
            "translationKeyY": "value y",
            "translationKeyZ": "value z"
          }
        }*//*/path/to/file.json*/
        `,
        options: [
          {
            filePath: "path/to/wrong-structure-generator.js",
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("diff");
    });

    test("mapped file doesn't exist", () => {
      const errors = run({
        code: `
      /*{}*//*path/to/file.json*/
      `,
        options: [
          {
            filePath: {
              "file.json": "path/to/does-not-exist.json",
            },
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
    });

    test("no match for this file found in the mapping", () => {
      const errors = run({
        code: `
        /*{}*//*path/to/file.json*/
      `,
        options: [
          {
            filePath: {
              "other-file.json": "path/to/does-not-exist.json", // shouldn't require does-not-exist.json, since it doesn't match
            },
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
    });

    test("invalid ignore-keys should throw error", () => {
      expect(() => {
        run({
          code: `
          /*{}*//*path/to/file.json*/
            `,
          options: [
            {
              filePath: "path/to/compare-file-a.json",
            },
          ],
          filename: "file.json",
          settings: {
            "i18n-json/ignore-keys": "invalid non-array arg",
          },
        });
      }).toThrowError(TypeError);
    });
  });
});
