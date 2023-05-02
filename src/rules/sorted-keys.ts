import { Json, SortedKeysContext, SortedKeysMessageIds, SortedKeysOptions } from "../types";

import { ReportDescriptor } from "@typescript-eslint/utils/dist/ts-eslint";
import { createRule } from "../util/createRule";
import deepForOwn from "../util/deep-for-own";
import equal from "lodash.isequal";
import { getTranslationFileSource } from "../util/get-translation-file-source";
import isPlainObject from "lodash.isplainobject";
import { keyTraversals } from "../util/key-traversals";
import set from "lodash.set";

const DEFAULT_OPTIONS: SortedKeysOptions = {
  order: "asc",
  indentSpaces: 2,
};

const { asc, desc } = keyTraversals;

const sortedKeys = (context: SortedKeysContext, source: string): ReportDescriptor<SortedKeysMessageIds>[] => {
  const { options } = context;

  const { order = "asc", indentSpaces = 2 } = options[0] ?? DEFAULT_OPTIONS;

  let translations: Json;

  try {
    translations = JSON.parse(source);
  } catch (_) {
    // ignore errors, this will
    // be caught by the i18n-json/valid-json rule
    return [];
  }

  const keyTraversal = order === "asc" ? asc : desc;

  const sortedTranslations: Json = {};
  const sortedTranslationPaths: string[] = [];

  deepForOwn(
    translations,
    (value: string, _: string, path: string) => {
      // if plain object, stub in a clean one to then get filled.
      set(sortedTranslations, path, isPlainObject(value) ? {} : value);
      sortedTranslationPaths.push(path);
    },
    { keyTraversal },
  );

  // only need to fix if the order of the keys is not the same
  const originalTranslationPaths: string[] = [];

  deepForOwn(
    translations,
    (_: string, __: string, path: string) => {
      originalTranslationPaths.push(path);
    },
    {},
  );

  if (!equal(originalTranslationPaths, sortedTranslationPaths)) {
    const sortedWithIndent = JSON.stringify(sortedTranslations, null, indentSpaces);

    return [
      {
        messageId: "error",
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        fix: (fixer) => fixer.replaceTextRange([0, source.length], sortedWithIndent),
      },
    ];
  }
  // no errors
  return [];
};

const rule = createRule<SortedKeysOptions[], SortedKeysMessageIds>({
  name: "sorted-keys",
  meta: {
    fixable: "code",
    docs: {
      requiresTypeChecking: false,
      description: "Ensure a consisten order for the translation keys.",
      recommended: "error",
    },
    messages: {
      error: "Keys should be sorted, please use --fix.",
    },
    type: "layout",
    schema: [
      {
        properties: {
          order: {
            type: "string",
            enum: ["asc", "desc"],
          },
          indentSpaces: {
            type: "number",
          },
        },
        type: "object",
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [DEFAULT_OPTIONS],
  create: (context) => ({
    Program(node) {
      const { valid, source } = getTranslationFileSource({
        context,
        node,
      });

      if (!valid) {
        return;
      }

      const errors = sortedKeys(context, source);

      errors.forEach((error) => {
        context.report(error);
      });
    },
  }),
});

export default rule;
