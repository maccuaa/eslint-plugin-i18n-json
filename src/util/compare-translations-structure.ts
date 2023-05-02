import { GlobalPluginSettings, Json } from "../types";

import deepForOwn from "./deep-for-own";
import { diff } from "jest-diff";
import set from "lodash.set";

const DIFF_OPTIONS = {
  expand: false,
  contextLines: 1,
};

/**
 * we don't care what the actual values are.
 * lodash.set will automatically convert a previous string value
 * into an object, if the current path states that a key is nested inside.
 * reminder, deepForOwn goes from the root level to the deepest level (preorder)
 */
export const compareTranslationsStructure = (
  settings: GlobalPluginSettings,
  translationsA: Json,
  translationsB: Json
) => {
  const augmentedTranslationsA = {};
  const augmentedTranslationsB = {};

  const ignorePaths: string[] = settings["i18n-json/ignore-keys"] ?? [];

  if (!Array.isArray(ignorePaths)) {
    throw new TypeError(`Expected an \`Array\`, got \`${typeof ignorePaths}\``);
  }

  deepForOwn(
    translationsA,
    (_: string, key: string, path: string) => {
      set(augmentedTranslationsA, path, "Message<String>");
    },
    { ignorePaths }
  );

  deepForOwn(
    translationsB,
    (_: string, key: string, path: string) => {
      set(augmentedTranslationsB, path, "Message<String>");
    },
    { ignorePaths }
  );

  return diff(augmentedTranslationsA, augmentedTranslationsB, DIFF_OPTIONS);
};
