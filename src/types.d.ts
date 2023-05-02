export interface Json {
  [key: string]: any;
}

export interface GlobalPluginSettings {
  "i18n-json/ignore-keys"?: string[];
}

export interface EditInfo {
  range: [start: number, end: number];
  text: string;
}

//
// identical-keys
//

export interface IdenticalKeysOptions {
  filePath?: string | Json;
}

export type IdenticalKeysMessageIds = "diff" | "error" | "filePathMissing" | "importError" | "keyStructFunc";

export type IdenticalKeysContext = Readonly<TSESLint.RuleContext<IdenticalKeysMessageIds>>;

//
// sorted-keys
//

export interface SortedKeysOptions {
  order?: "asc" | "desc";
  indentSpaces: number;
}

export type SortedKeysMessageIds = "error";

export type SortedKeysContext = Readonly<TSESLint.RuleContext<SortedKeysMessageIds>>;

//
// valid-json
//

export interface ValidJsonOptions {
  ignore: never;
}

export type ValidJsonMessageIds = "error";

export type ValidJsonContext = Readonly<TSESLint.RuleContext<ValidJsonMessageIds>>;
