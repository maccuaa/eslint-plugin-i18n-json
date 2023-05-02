import { describe, expect, test, vi } from "vitest";

import { EditInfo } from "../src/types";
import rule from "../src/rules/sorted-keys";
import runRule from "./run-rule";

const fixer = {
  replaceTextRange: (range: [start: number, end: number], text: string): EditInfo => {
    return {
      range,
      text,
    };
  },
};

const extract = (input: string): string => {
  const arr = input.split("");
  const start = arr.indexOf("{");
  const end = arr.lastIndexOf("}") + 1;
  return input.slice(start, end);
};

const fix = (source: string, { range, text }: EditInfo): string => {
  const input = extract(source);

  const [start, end] = range;

  return input.slice(0, start) + text + input.slice(end);
};

describe("sorted-keys", () => {
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

    test("default sort order and indentSpace.", () => {
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

    test("ascending", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyA": "translation value a",
              "translationKeyB": "translation value b"
          }*//*path/to/file.json*/
      `,
        options: [
          {
            order: "asc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("descending", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyB": "translation value b",
              "translationKeyA": "translation value a"
          }*//*path/to/file.json*/
      `,
        options: [
          {
            order: "desc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("nested descending", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyB": {
                "nested2": "nested value 1",
                "nested1": "nested value 2"
              },
              "translationKeyA": "translation value a"
          }*//*path/to/file.json*/
      `,
        options: [
          {
            order: "desc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("nested ascending", () => {
      const errors = run({
        code: `
          /*{
              "translationKeyA": {
                "nested1": "nested value 1",
                "nested2": "nested value 2"
              },
              "translationKeyB": "translation value a"
          }*//*path/to/file.json*/
      `,
        options: [
          {
            order: "asc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });

    test("error parsing the json - ignore to allow i18n-json/valid-json rule to handle it", () => {
      const errors = run({
        code: `
          /*{*//*path/to/file.json*/
      `,
        options: [
          {
            order: "asc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      expect(errors).toHaveLength(0);
    });
  });

  /*
      if order doesn't match what is specified,
      it should report a fixable error with
      range spanning the whole JSON file,
      and emitted text being the sorted translations
      with proper indent format.
    */

  describe("invalid", () => {
    test("ascending order test", () => {
      const code = `
      /*{
          "translationKeyB": "translation value b",
          "translationKeyA": "translation value a"
      }*//*path/to/file.json*/
      `;

      const errors = run({
        code,
        options: [
          {
            order: "asc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      const expected = JSON.stringify(
        {
          translationKeyA: "translation value a",
          translationKeyB: "translation value b",
        },
        null,
        2
      );

      const editInfo: EditInfo = errors[0].fix(fixer);
      const actual = fix(code, editInfo);

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
      expect(actual).toBe(expected);
    });

    test("descending order test", () => {
      const code = `
             /*{
                 "translationKeyA": "translation value a",
                 "translationKeyB": "translation value b"
             }*//*path/to/file.json*/
             `;

      const errors = run({
        code,
        options: [
          {
            order: "desc",
            indentSpaces: 1,
          },
        ],
        filename: "file.json",
      });

      const expected = JSON.stringify(
        {
          translationKeyB: "translation value b",
          translationKeyA: "translation value a",
        },
        null,
        1
      );

      const editInfo: EditInfo = errors[0].fix(fixer);
      const actual = fix(code, editInfo);

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
      expect(actual).toBe(expected);
    });

    test("nested ascending", () => {
      const code = `
        /*{
            "translationKeyB": "translation value b",
            "translationKeyA": {
              "nested2": "nested value 2",
              "nested1": "nested value 1"
            }
        }*//*path/to/file.json*/
    `;

      const errors = run({
        code,
        options: [
          {
            order: "asc",
            indentSpaces: 2,
          },
        ],
        filename: "file.json",
      });

      const expected = JSON.stringify(
        {
          translationKeyA: {
            nested1: "nested value 1",
            nested2: "nested value 2",
          },
          translationKeyB: "translation value b",
        },
        null,
        2
      );

      const editInfo: EditInfo = errors[0].fix(fixer);
      const actual = fix(code, editInfo);

      expect(errors).toHaveLength(1);
      expect(errors[0].messageId).toBe("error");
      expect(actual).toBe(expected);
    });
  });
});
