import { IdenticalKeysContext } from "../types";
import { TSESTree } from "@typescript-eslint/utils";
import { extname } from "node:path";

const isJSONFile = (context: IdenticalKeysContext) => extname(context.getFilename()) === ".json";

const INVALID_SOURCE = {
  valid: false,
  source: "",
  sourceFilePath: "",
};

export const getTranslationFileSource = ({
  context,
  node,
}: {
  context: IdenticalKeysContext;
  node: TSESTree.Program;
}) => {
  if (!isJSONFile(context)) {
    return INVALID_SOURCE;
  }

  if (!Array.isArray(node.comments)) {
    return INVALID_SOURCE;
  }

  if (node.comments.length < 2) {
    // is not a json file or the file
    // has not been through the plugin preprocessor
    return INVALID_SOURCE;
  }

  const { value: source } = node.comments[0];
  const { value: sourceFilePath } = node.comments[1];

  // valid source
  return {
    valid: true,
    source: source.trim(),
    sourceFilePath: sourceFilePath?.trim(),
  };
};
