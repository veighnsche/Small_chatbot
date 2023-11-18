import { llamaEventBus } from "../../services/llamaEventBus.ts";
import {
  appendAssistantStreamContent,
  appendAssistantStreamFunctionCallArguments,
  setError,
  setSseId,
  startAssistantStream,
  startAssistantStreamFunctionCall,
} from "../../slices/llamaChatSlice";
import { LlamaActions } from "../../stores/llamaStore";
import { streamToObject } from "../../utils/stream";
import { llamaOnMessagesSnapshot } from "../llamaOnMessagesSnapshot.ts";

/**
 * Convert a readable stream into an async iterable of assistant actions.
 * @param body - The input readable stream.
 */
export async function* streamToAssistantAction(body: ReadableStream<Uint8Array>): AsyncGenerator<LlamaActions> {
  try {
    for await (const delta of streamToObject(body)) {
      if ("sseId" in delta) {
        yield setSseId({ sseId: delta.sseId });
      }
      if ("chatId" in delta) {
        yield llamaOnMessagesSnapshot({ chatId: delta.chatId }) as any;
      }
      if ("role" in delta) {
        yield startAssistantStream({ role: delta.role });
      }
      if ("content" in delta) {
        yield appendAssistantStreamContent({ content: delta.content });
      }
      if ("function_call" in delta) {
        if ("name" in delta.function_call) {
          yield startAssistantStreamFunctionCall({ name: delta.function_call.name });
        }
        if ("arguments" in delta.function_call) {
          yield appendAssistantStreamFunctionCallArguments({ arguments: delta.function_call.arguments });
        }
      }
      if ("cleanup" in delta) {
        yield setSseId({ sseId: undefined });
      }
      if ("error" in delta) {
        yield setError({ error: delta.error });
      }
      if ("assistant_uid" in delta && "assistant_message" in delta) {
        llamaEventBus.emit("assistant_uid: " + delta.assistant_uid, delta.assistant_message);
      }
    }
  } catch (err) {
    console.error("Error converting to assistant action:", err);
  }
}