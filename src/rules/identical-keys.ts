import { IdenticalKeysContext, IdenticalKeysMessageIds, IdenticalKeysOptions, Json } from "../types";

import { ReportDescriptor } from "@typescript-eslint/utils/dist/ts-eslint";
import { compareTranslationsStructure } from "../util/compare-translations-structure";
import { createRule } from "../util/createRule";
import { getTranslationFileSource } from "../util/get-translation-file-source";
import { requireNoCache } from "../util/require-no-cache";

const noDifferenceRegex = /Compared\s+values\s+have\s+no\s+visual\s+difference/i;

const identicalKeys = (
  context: IdenticalKeysContext,
  source: string,
  sourceFilePath: string
): ReportDescriptor<IdenticalKeysMessageIds>[] => {
  const { options, settings = {} } = context;

  const comparisonOptions = options[0];

  let currentTranslations: Json;

  try {
    currentTranslations = JSON.parse(source);
  } catch (e) {
    // don't return any errors
    // will be caught with the valid-json rule.
    return [];
  }

  const { errors, keyStructure } = getKeyStructureToMatch(comparisonOptions, sourceFilePath);

  if (errors) {
    // errors generated from trying to get the key structure
    return errors;
  }

  const diffString = compareTranslationsStructure(settings, keyStructure, currentTranslations);

  if (noDifferenceRegex.test(diffString?.trim() ?? "")) {
    // success
    return [];
  }

  // mismatch
  return [
    {
      messageId: "diff",
      data: {
        diffString,
      },
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
    },
  ];
};

/**
 * https://eslint.org/docs/latest/extend/custom-rules
 */

const rule = createRule<IdenticalKeysOptions[], IdenticalKeysMessageIds>({
  name: "identical-keys",
  meta: {
    docs: {
      description:
        "Verifies the key structure for the translation file matches the key structure specified in the options",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      diff: "{{diffString}}",
      error: "{{error}}",
      filePathMissing: '"filePath" rule option not specified.',
      importError:
        'Error parsing or retrieving key structure comparison file from\n "{{filePath}}".\n Check the "filePath" option for this rule.\n {{error}}',
      keyStructFunc:
        'Error when calling custom key structure function from\n "{{filePath}}".\n Check the "filePath" option for this rule.\n {{error}}',
    },
    type: "problem",
    schema: [
      {
        type: "object",
        properties: {
          filePath: {
            type: ["string", "object"],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [],
  create: (context) => ({
    Program(node) {
      const { valid, source, sourceFilePath } = getTranslationFileSource({
        context,
        node,
      });

      if (!valid) {
        return;
      }

      const errors = identicalKeys(context, source, sourceFilePath);

      errors.forEach((error) => {
        context.report(error);
      });
    },
  }),
});

export default rule;

/**
 * comparisonOptions : {
    filePath = (string | Function | Object)

      - If it's a string, then it can be a file to require in order to compare
        it's key structure with the current translation file.

      - If it's an object , then it should have a mapping b/w file names
        and what key structure file to require.
  }
 */
const getKeyStructureToMatch = (
  options: IdenticalKeysOptions = {},
  sourceFilePath: string
): {
  errors?: ReportDescriptor<IdenticalKeysMessageIds>[];
  keyStructure: Json;
} => {
  const { filePath } = options;

  if (!filePath) {
    return {
      keyStructure: {},
      errors: [
        {
          messageId: "filePathMissing",
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
        },
      ],
    };
  }

  if (typeof filePath === "string") {
    try {
      const keyStructure = requireNoCache(filePath);

      return { keyStructure };
    } catch (error) {
      return {
        keyStructure: {},
        errors: [
          {
            messageId: "importError",
            data: {
              filePath,
              error,
            },
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
          },
        ],
      };
    }
  }

  // due to eslint rule schema, we can assume the "filePath" option is an object.
  // anything else will be caught by the eslint rule schema validator.
  try {
    return {
      keyStructure: getKeyStructureFromMap(filePath, sourceFilePath),
    };
  } catch (error) {
    return {
      keyStructure: {},
      errors: [
        {
          messageId: "error",
          data: { error },
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
        },
      ],
    };
  }
};

/**
 * suffix match each key in the mapping with the current source file path.
 * pick the first match.
 */
const getKeyStructureFromMap = (filePathMap: Json, sourceFilePath: string) => {
  // do a suffix match
  const match = Object.keys(filePathMap)
    .filter((filePath) => sourceFilePath.endsWith(filePath))
    .pop();
  if (match) {
    try {
      const filepath = filePathMap[match];
      return requireNoCache(filepath);
    } catch (e) {
      throw new Error(
        `\n Error parsing or retrieving key structure comparison file based on "filePath" mapping\n\n "${match}" => "${filePathMap[match]}".\n\n Check the "filePath" option for this rule. \n ${e}`
      );
    }
  }
  throw new Error(
    '\n Current translation file does not have a matching entry in the "filePath" map.\n Check the "filePath" option for this rule.\n'
  );
};
