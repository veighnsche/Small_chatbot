import { LlamaStreamContext } from "../../providers/LlamaStreamingProvider.tsx";
import { llamaEventBus } from "../../services/llamaEventBus.ts";
import { setError, setSseId } from "../../slices/llamaChatSlice";
import { useLlamaDispatch } from "../../stores/llamaStore";
import { streamToObject } from "../../utils/stream";
import { llamaOnMessagesSnapshot } from "../llamaOnMessagesSnapshot.ts";

/**
 * Convert a readable stream into an async iterable of assistant actions.
 * @param body - The input readable stream.
 * @param dispatch
 * @param llamaStreamContext
 */
export async function streamToAssistantAction(
  body: ReadableStream<Uint8Array>,
  dispatch: ReturnType<typeof useLlamaDispatch>,
  llamaStreamContext: LlamaStreamContext,
): Promise<void> {
  try {
    for await (const delta of streamToObject(body)) {
      if ("sseId" in delta) {
        dispatch(setSseId({ sseId: delta.sseId }));
      }
      if ("chatId" in delta) {
        dispatch(llamaOnMessagesSnapshot({ chatId: delta.chatId }));
      }
      if ("role" in delta) {
        llamaStreamContext.startAssistantStream({ role: delta.role });
      }
      if ("content" in delta) {
        llamaStreamContext.appendAssistantStreamContent({ content: delta.content });
      }
      if ("function_call" in delta) {
        if ("name" in delta.function_call) {
          llamaStreamContext.startAssistantStreamFunctionCall({ name: delta.function_call.name });
        }
        if ("arguments" in delta.function_call) {
          llamaStreamContext.appendAssistantStreamFunctionCallArguments({ arguments: delta.function_call.arguments });
        }
      }
      if ("cleanup" in delta) {
        dispatch(setSseId({ sseId: undefined }));
      }
      if ("error" in delta) {
        llamaStreamContext.stopAssistantStream();
        dispatch(setError({ error: delta.error }));
      }
      if ("assistant_uid" in delta && "assistant_message" in delta) {
        llamaStreamContext.stopAssistantStream();
        llamaEventBus.emit("assistant_uid: " + delta.assistant_uid, delta.assistant_message);
      }
      if ("EVENT_TYPE" in delta && "EVENT_DATA" in delta) {
        if (delta.EVENT_TYPE === "assistant: error") {
          llamaStreamContext.stopAssistantStream();
          dispatch(setError({ error: delta.EVENT_DATA.message }));
        }
      }
    }
  } catch (err) {
    console.error("Error converting to assistant action:", err);
  }
}