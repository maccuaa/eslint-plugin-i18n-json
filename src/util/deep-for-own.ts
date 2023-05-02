import { Json } from "../types";
import isPlainObject from "lodash.isplainobject";

const shouldIgnorePath = (ignoreList: string[], keyPath: string[]) => ignoreList.includes(keyPath.join("."));
const defaultTraversal = (obj: Json) => Object.keys(obj);

interface Queue {
  currentObj: Json;
  path: string[];
}

interface Options {
  ignorePaths?: string[];
  keyTraversal?: typeof defaultTraversal;
}

/**
 * deep level order traversal.
 *
 * Takes the `keyTraversal` iterato
 * which specify in what order the current level'
 * key should be visited.
 *
 * calls iteratee with the path to the object.
 */
const deepForOwn = (obj: Json, iteratee: Function, { ignorePaths = [], keyTraversal = defaultTraversal }: Options) => {
  const queue: Queue[] = [];

  queue.push({
    currentObj: obj,
    path: [],
  });

  while (queue.length > 0) {
    const element = queue.shift();

    if (!element) {
      break;
    }

    const { currentObj, path } = element;

    const levelSuccess = keyTraversal(currentObj).every((key) => {
      const keyPath = [...path, key];
      // skip over ignored paths and their children
      if (shouldIgnorePath(ignorePaths, keyPath)) {
        return true;
      }
      if (isPlainObject(currentObj[key])) {
        queue.push({
          currentObj: currentObj[key],
          path: keyPath,
        });
      }
      return iteratee(currentObj[key], key, keyPath) !== false;
    });
    if (!levelSuccess) {
      break;
    }
  }
};

export default deepForOwn;
