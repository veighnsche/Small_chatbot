import { llamaEventBus } from "../../services/llamaEventBus.ts";
import { clearSse_id, setError, setSse_id } from "../../slices/llamaChatSlice";
import { useLlamaDispatch } from "../../stores/llamaStore";
import { streamToObject } from "../../utils/stream";
import { llamaOnMessagesSnapshot } from "../llamaOnMessagesSnapshot.ts";

/**
 * Convert a readable stream into an async iterable of assistant actions.
 * @param body - The input readable stream.
 * @param dispatch
 */
export async function streamToAssistantAction(
  body: ReadableStream<Uint8Array>,
  dispatch: ReturnType<typeof useLlamaDispatch>,
): Promise<void> {
  try {
    for await (const delta of streamToObject(body)) {
      if ("sse_id" in delta) {
        dispatch(setSse_id({ sse_id: delta.sse_id }));
      }
      if ("chat_id" in delta) {
        dispatch(llamaOnMessagesSnapshot({ chat_id: delta.chat_id }));
      }
      if ("role" in delta) {
        llamaEventBus.emit("initiate-stream", { role: delta.role });
      }
      if ("content" in delta) {
        llamaEventBus.emit("add-to-stream-content", { content: delta.content });
      }
      if ("function_call" in delta) {
        if ("name" in delta.function_call) {
          llamaEventBus.emit("begin-function-streaming", { name: delta.function_call.name });
        }
        if ("arguments" in delta.function_call) {
          llamaEventBus.emit("extend-function-arguments", { arguments: delta.function_call.arguments });
        }
      }
      if ("cleanup" in delta) {
        dispatch(clearSse_id());
      }
      if ("error" in delta) {
        llamaEventBus.emit("terminate-stream");
        dispatch(setError({ error: delta.error }));
      }
      if ("assistant_uid" in delta && "assistant_message" in delta) {
        llamaEventBus.emit("terminate-stream");
        llamaEventBus.emit("assistant_uid: " + delta.assistant_uid, delta.assistant_message);

        if ("function_call" in delta.assistant_message) {
          llamaEventBus.emit('function-call', delta.assistant_message.function_call);
        }
      }
      if ("EVENT_TYPE" in delta && "EVENT_DATA" in delta) {
        if (delta.EVENT_TYPE === "assistant: error") {
          llamaEventBus.emit("terminate-stream");
          dispatch(setError({ error: delta.EVENT_DATA.message }));
        }
      }
    }
  } catch (err) {
    console.trace("Error converting to assistant action:", err);
  }
}