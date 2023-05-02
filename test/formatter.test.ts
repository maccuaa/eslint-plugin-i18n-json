import { describe, expect, it } from "vitest";

import { ESLint } from "@typescript-eslint/utils/dist/ts-eslint";
import formatter from "../src/formatter";
import stripAnsi from "./strip-ansi";

const strippedFormatter = (results: ESLint.LintResult[]) => stripAnsi(formatter(results));

describe("formatter", () => {
  it("returns an empty string when there aren't any warnings or errors across all files", () => {
    expect(
      strippedFormatter([
        {
          filePath: "some/file",
          messages: [],
          warningCount: 0,
          errorCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          usedDeprecatedRules: [],
        },
      ])
    ).toMatchSnapshot();
  });

  it("will not display any message for an individual file which does not have any warnings or errors", () => {
    const output = strippedFormatter([
      {
        filePath: "bad/file",
        messages: [
          {
            ruleId: "some-rule",
            severity: 2,
            message: "file is bad",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
        ],
        errorCount: 1,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
      {
        filePath: "good/file",
        messages: [],
        warningCount: 0,
        errorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ]);
    expect(output).toMatchSnapshot();
  });
  it("will display errors before warnings", () => {
    const output = strippedFormatter([
      {
        filePath: "bad/file",
        messages: [
          {
            ruleId: "some-rule",
            severity: 1,
            message: "file has first warning",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
          {
            ruleId: "some-rule",
            severity: 1,
            message: "file has second warning",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
          {
            ruleId: "some-rule",
            severity: 2,
            message: "file is bad",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
          {
            ruleId: "some-rule",
            severity: 2,
            message: "file is pretty bad",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
        ],
        errorCount: 2,
        warningCount: 2,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ]);
    expect(output).toMatchSnapshot();
  });
  it("will display issues across many files", () => {
    const output = strippedFormatter([
      {
        filePath: "bad/file",
        messages: [
          {
            ruleId: "some-rule",
            severity: 2,
            message: "file is bad",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
        ],
        errorCount: 1,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
      {
        filePath: "bad/file2",
        messages: [
          {
            ruleId: "some-rule",
            severity: 1,
            message: "file has a warning",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
        ],
        errorCount: 0,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
      {
        filePath: "bad/file3",
        messages: [
          {
            ruleId: "some-rule",
            severity: 2,
            message: "file is bad",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
          {
            ruleId: "some-rule",
            severity: 1,
            message: "file has a warning",
            line: 0,
            column: 0,
            endColumn: 0,
            endLine: 0,
            fix: {
              range: [0, 0],
              text: "",
            },
            suggestions: [],
          },
        ],
        errorCount: 1,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
      },
    ]);
    expect(output).toMatchSnapshot();
  });
});
