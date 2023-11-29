/**
 * Convert a readable stream into an asynchronous iterable of Uint8Array chunks.
 * @param stream - The input readable stream.
 */
async function* streamToAsyncIterable(stream: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Convert a Uint8Array chunk into an iterable of parsed objects.
 * @param data - The input Uint8Array chunk.
 */
function* uint8ArrayToObjGenerator<T extends Record<string, any>>(data: Uint8Array): Generator<T> {
  const decoder = new TextDecoder();
  const json = decoder.decode(data);
  const jsons = json.split(/(?=data: |event: )/);

  for (const jsonString of jsons) {
    if (jsonString.startsWith("data: ")) {
      try {
        yield JSON.parse(jsonString.slice(6));
      } catch (e) {
        console.trace("Failed to parse JSON:", e, jsonString);
        throw new Error("Failed to parse JSON");
      }
    } else if (jsonString.startsWith("event: ")) {
      console.log(jsonString);
    }
  }
}

/**
 * Convert a readable stream into an async iterable of parsed objects.
 * @param body - The input readable stream.
 */
export async function* streamToObject(body: ReadableStream<Uint8Array>): AsyncGenerator<Record<string, any>> {
  try {
    for await (const chunk of streamToAsyncIterable(body)) {
      yield* uint8ArrayToObjGenerator(chunk);
    }
  } catch (err) {
    console.trace("Error reading SSE:", err);
    throw new Error("Error reading SSE");
  }
}
