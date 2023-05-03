import { bold, inverse, underline, white } from "ansi-colors";

import { ESLint } from "@typescript-eslint/utils/dist/ts-eslint";
import { cwd } from "node:process";
import { indentString } from "./util/indent-string";
import { logSymbols } from "./util/log-symbols";
import { plur } from "./util/plur";
import { relative } from "node:path";

const CWD = cwd();

/**
 * Custom eslint formatter for eslint-plugin-i18n-json to allow better error message display.
 * Heavily inspired from https://github.com/sindresorhus/eslint-formatter-pretty.
 */
function formatter(results: ESLint.LintResult[]) {
  let totalErrorsCount = 0;
  let totalWarningsCount = 0;

  const formattedLintMessagesPerFile = results
    .map(({ filePath, messages: fileMessages, errorCount: fileErrorCount, warningCount: fileWarningCount }) => {
      if (fileErrorCount + fileWarningCount === 0) {
        return "";
      }

      totalErrorsCount += fileErrorCount;
      totalWarningsCount += fileWarningCount;

      const relativePath = relative(CWD, filePath);
      const fileMessagesHeader = underline.white(relativePath);

      fileMessages.sort((a, b) => b.severity - a.severity); // display errors first

      const formattedFileMessages = fileMessages
        .map(({ ruleId, severity, message }) => {
          let messageHeader =
            severity === 1
              ? `${logSymbols.warning} ${inverse.yellow(" WARNING ")}`
              : `${logSymbols.error} ${inverse.red(" ERROR ")}`;

          messageHeader += ` ${white(`(${ruleId})`)}`;

          return `\n\n${messageHeader}\n${indentString(message, 2)}`;
        })
        .join("");

      return `${fileMessagesHeader}${formattedFileMessages}`;
    })
    .filter((fileLintMessages) => fileLintMessages.trim().length > 0);

  let aggregateReport = formattedLintMessagesPerFile.join("\n\n");

  // append in total error and warnings count to aggregrate report
  const totalErrorsCountFormatted = `${bold.red(">")} ${logSymbols.error} ${bold.red(
    totalErrorsCount.toString(),
  )} ${bold.red(plur("ERROR", totalErrorsCount))}`;

  const totalWarningsCountFormatted = `${bold.yellow(">")} ${logSymbols.warning} ${bold.yellow(
    totalWarningsCount.toString(),
  )} ${bold.yellow(plur("WARNING", totalWarningsCount))}`;

  aggregateReport += `\n\n${totalErrorsCountFormatted}\n${totalWarningsCountFormatted}`;

  return totalErrorsCount + totalWarningsCount > 0 ? aggregateReport : "";
}

module.exports = formatter;
