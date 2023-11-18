import { createAsyncThunk } from "@reduxjs/toolkit";
import { threadMemo } from "../selectors/thread";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { setLastMessageId } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { generateUniqueID } from "../utils/uid.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  assistantParams: LlamaChatParams;
  assistant_uid: string;
}

export const llamaSseRegenerate = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaChat/regenerate",
  async (_, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chatId = state.llamaChat.currentChatId;
    const assistantParams = state.llamaChatParams;

    const slicedThread = thread.slice(0, thread.length - 1);
    const parent_id = slicedThread[slicedThread.length - 1].id;

    dispatch(setLastMessageId({ messageId: parent_id }));

    if (!chatId) {
      throw new Error("No chatId");
    }

    try {
      const body = await wretch(`chat/${chatId}/regenerate`).post<SendMessageParams>({
        thread: slicedThread,
        assistantParams,
        assistant_uid: generateUniqueID(),
      });

      for await (const action of streamToAssistantAction(body)) {
        dispatch(action);
      }
    } catch (err) {
      console.error(err);
      throw new Error("Failed to regenerate");
    }
  },
);