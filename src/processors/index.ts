import { TSESLint } from "@typescript-eslint/utils";

const processor: TSESLint.Linter.Processor = {
  preprocess: (source: string, filePath: string) => [`/* ${source.trim()} *//* ${filePath.trim()} */\n`],
  postprocess: ([errors]) => [...errors],
  supportsAutofix: true,
};

export = processor;
