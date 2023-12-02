import { v4 as uuid } from "uuid";

export const generateUniqueID = () => uuid();

/**
 * Class responsible for generating unique timestamp strings. It uses a queue system
 * to manage timestamp generation requests, ensuring that each timestamp is unique,
 * even if requests are made within the same millisecond.
 */
class TimestampGenerator {
  /**
   * The last generated timestamp. Used to ensure uniqueness.
   * @type {number | null}
   */
  private lastTimestamp: number | null = null;

  /**
   * Queue of functions to generate timestamps. Ensures that timestamps are generated in order.
   * @type {Array<() => void>}
   */
  private queue: Array<() => void> = [];

  /**
   * Asynchronously gets a unique timestamp. If the generated timestamp is the same
   * as the last one, it requeues the request.
   *
   * @returns {Promise<string>} A promise that resolves to a unique timestamp string.
   */
  public async getTimestamp(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.queue.push(() => this.generateTimestamp(resolve));
      if (this.queue.length === 1) {
        this.processQueue();
      }
    });
  }

  /**
   * Generates a timestamp and resolves the promise with it. If the timestamp is not unique,
   * requeues the generation function.
   *
   * @param {Function} resolve - The resolve function of the promise returned by getTimestamp.
   */
  private generateTimestamp(resolve: (value: string) => void): void {
    const now = Date.now();
    if (this.lastTimestamp === now) {
      this.queue.push(() => this.generateTimestamp(resolve));
    } else {
      this.lastTimestamp = now;
      resolve(now.toString(36));
    }
  }

  /**
   * Processes the queue of timestamp generation requests. Ensures that each request is handled
   * sequentially and respects the uniqueness of timestamps.
   */
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
}

/**
 * Singleton instance of TimestampGenerator used for exporting the getTimestamp function.
 * @type {TimestampGenerator}
 */
const timestampGenerator: TimestampGenerator = new TimestampGenerator();

/**
 * Exports the getTimestamp function of the singleton TimestampGenerator instance.
 * This function can be used to obtain unique timestamp strings.
 *
 * @returns {Promise<string>} A promise that resolves to a unique timestamp string.
 */
export const getTimeStamp = (): Promise<string> => timestampGenerator.getTimestamp();

