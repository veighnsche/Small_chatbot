import { removeKeys } from "../object";

describe("removeKeys", () => {

  test("should remove the specified keys from the object", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const keysToRemove = ["a", "c"];

    const result = removeKeys(object, keysToRemove);

    const expectedObject = { b: 2, d: 4 }; // a and c removed
    expect(result).toEqual(expectedObject);
  });

  test("should not modify the original object", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const keysToRemove = ["a", "c"];

    removeKeys(object, keysToRemove);

    // Original object should remain unchanged.
    const unchangedObject = { a: 1, b: 2, c: 3, d: 4 };
    expect(object).toEqual(unchangedObject);
  });

  test("should return an empty object if all keys are removed", () => {
    const object = { a: 1, b: 2, c: 3 };
    const keysToRemove = ["a", "b", "c"];

    const result = removeKeys(object, keysToRemove);

    const expectedObject = {}; // all keys removed
    expect(result).toEqual(expectedObject);
  });

  test("should return the same object if no keys are to be removed", () => {
    const object = { a: 1, b: 2, c: 3 };
    const keysToRemove: string[] = [];

    const result = removeKeys(object, keysToRemove);

    const expectedObject = { a: 1, b: 2, c: 3 }; // no keys removed
    expect(result).toEqual(expectedObject);
  });

  test("should ignore keys that do not exist in the object", () => {
    const object = { a: 1, b: 2, c: 3 };
    const keysToRemove = ["d", "e"]; // keys that don't exist in the object

    const result = removeKeys(object, keysToRemove);

    const expectedObject = { a: 1, b: 2, c: 3 }; // object stays the same
    expect(result).toEqual(expectedObject);
  });

});