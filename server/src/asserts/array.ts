export function assertArray<T>(array: T[]): asserts array is T[] {
  if (!array) {
    throw new Error("Missing array");
  }
  if (!Array.isArray(array)) {
    throw new Error("Array is not an array");
  }
}