import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/maccuaa/eslint-plugin-i18n-json/docs/rules/${name}.md`,
);
