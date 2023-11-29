export function assertArray<T>(array: T[]): asserts array is T[] {
  if (!array) {
    console.trace("Missing array");
    throw new Error("Missing array");
  }
  if (!Array.isArray(array)) {
    console.trace("Array is not an array");
    throw new Error("Array is not an array");
  }
}