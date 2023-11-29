import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaStreamContext } from "../providers/LlamaStreamingProvider.tsx";
import { threadMemo } from "../selectors/thread";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { setLastMessage_id } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { generateUnique_id } from "../utils/uid.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  assistantParams: LlamaChatParams;
  assistant_uid: string;
}

export const llamaSseRegenerate = createAsyncThunk<void, {
  llamaStreamContext: LlamaStreamContext,
}, LlamaThunkApiConfig>(
  "llamaChat/regenerate",
  async ({
    llamaStreamContext,
  }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chat_id = state.llamaChat.currentChat_id;
    const assistantParams = state.llamaChatParams;

    const slicedThread = thread.slice(0, thread.length - 1);
    const parent_id = slicedThread[slicedThread.length - 1].id;

    dispatch(setLastMessage_id({ message_id: parent_id }));

    if (!chat_id) {
      console.trace("No chat_id");
      throw new Error("No chat_id");
    }

    try {
      const body = await wretch(`chat/${chat_id}/regenerate`).post<SendMessageParams>({
        thread: slicedThread,
        assistantParams,
        assistant_uid: generateUnique_id(),
      });

      // for await (const action of streamToAssistantAction(body)) {
      //   dispatch(action);
      // }

      await streamToAssistantAction(body, dispatch, llamaStreamContext);
    } catch (err) {
      console.trace(err);
      throw new Error("Failed to regenerate");
    }
  },
);