/**
 * @usage ```ts
 * const object = { a: 1, b: 2, c: 3 };
 * const keys = ["a", "c"];
 * const newObject = removeKeys(object, keys);
 * console.log(newObject); // { b: 2 }
 * ```
 */
export const removeKeys = (object: Record<string, any>, keys: string[]): Record<string, any> => {
  const newObject: Record<string, any> = {};

  Object.keys(object).forEach((key) => {
    if (!keys.includes(key)) {
      newObject[key] = object[key];
    }
  });

  return newObject;
};