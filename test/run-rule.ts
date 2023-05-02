import { ESLint } from "@typescript-eslint/utils/dist/ts-eslint";
import { ESLintUtils } from "@typescript-eslint/utils";
import { RuleModule } from "@typescript-eslint/utils/dist/ts-eslint";
import { parse } from "@typescript-eslint/parser";

/**
 * Rule runner which gives back the actual errors
 */
export default (rule: RuleModule<any>) =>
  ({ code = "", options = {}, filename = "", settings = {} }) => {
    const node = parse(code, {
      comment: true,
    });

    const receivedErrors: ESLint.LintResult[] = [];

    const test = {
      context: {
        report: (error: ESLint.LintResult) => receivedErrors.push(error),
        options,
        settings,
        getFilename: () => filename,
      },
      node,
    };

    rule.create(test.context).Program(test.node);

    return receivedErrors;
  };
