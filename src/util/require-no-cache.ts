import { readFileSync } from "node:fs";

export const requireNoCache = (path: string) => {
  const file = readFileSync(path.trim(), { encoding: "utf8" });

  const json = JSON.parse(file);

  return json;
};
