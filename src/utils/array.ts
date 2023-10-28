/**
 * @usage ```ts
 * asyncReduce(numbers, asyncSum, 0)
 *   .then(result => {
 *     console.log(result);  // 15, after some delay
 *   });
 *
 * const numbers: number[] = [1, 2, 3, 4, 5];
 *
 * async function asyncSum(total: number, number: number): Promise<number> {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       resolve(total + number);
 *     }, 50); // Simulating some async operation
 *   });
 * }
 * ```
 */
async function asyncReduce<T, U>(
  arr: T[],
  reducer: (accumulator: U, item: T) => Promise<U>,
  initialValue: U
): Promise<U> {
  let accumulator = initialValue;

  for (let item of arr) {
    accumulator = await reducer(accumulator, item);
  }

  return accumulator;
}
