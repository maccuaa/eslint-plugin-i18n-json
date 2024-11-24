import TSESLint from "@typescript-eslint/utils/ts-eslint";

const jsonProcessor: TSESLint.Linter.Processor = {
  /**
   * augment the json into a comment
   * along with the source path :D
   * so we can pass it to the rules
   *
   * note: due to the spaced comment rule, include
   * spaced comments
   *
   */
  preprocess: (source: string, filePath: string) => {
    return [`/* ${source.trim()} *//* ${filePath.trim()} */\n`];
  },
  postprocess: ([errors]) => [...errors],
  supportsAutofix: true,
};

export default {
  ".json": jsonProcessor,
};
