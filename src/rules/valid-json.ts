import { ValidJsonContext, ValidJsonMessageIds, ValidJsonOptions } from "../types";

import { ReportDescriptor } from "@typescript-eslint/utils/dist/ts-eslint";
import { bold } from "ansi-colors";
import { createRule } from "../util/createRule";
import { getTranslationFileSource } from "../util/get-translation-file-source";
import isPlainObject from "lodash.isplainobject";
import parseJson from "parse-json";

const lineRegex = /line\s+(\d+):?/i;

const validJSON = (context: ValidJsonContext, source: string): ReportDescriptor<ValidJsonMessageIds>[] => {
  const errors: ReportDescriptor<ValidJsonMessageIds>[] = [];

  try {
    const parsed = parseJson(source);

    if (!isPlainObject(parsed)) {
      throw new SyntaxError("Translation file must be a JSON object.");
    }
  } catch (error) {
    const e = error as Error;

    const [, lineNumber] = e.message.match(lineRegex) || [];
    errors.push({
      messageId: "error",
      data: {
        error: e,
      },
      loc: {
        start: {
          line: Number.parseInt(lineNumber, 10),
          column: 0,
        },
        end: {
          line: 0,
          column: 0,
        },
      },
    });
  }

  return errors;
};

const rule = createRule<ValidJsonOptions[], ValidJsonMessageIds>({
  name: "valid-json",
  meta: {
    docs: {
      requiresTypeChecking: false,
      description: "Validates the JSON translation file",
      recommended: "error",
    },
    messages: {
      error: `\n${bold.red("Invalid JSON.")}\n\n{{error}}`,
    },
    type: "problem",
    schema: [],
  },
  defaultOptions: [],
  create: (context) => ({
    Program(node) {
      const { valid, source } = getTranslationFileSource({
        context,
        node,
      });

      if (!valid) {
        return;
      }

      const errors = validJSON(context, source);

      errors.forEach((error) => {
        context.report(error);
      });
    },
  }),
});

export default rule;
