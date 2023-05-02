import { Json } from "../types";

// case sensitive traversal orders
export const keyTraversals = {
  asc: (obj: Json) => Object.keys(obj).sort(),
  desc: (obj: Json) =>
    Object.keys(obj).sort((a, b) => {
      // note, objects can't have duplicate keys of the same case
      if (a < b) {
        return 1;
      }
      return -1;
    }),
};
