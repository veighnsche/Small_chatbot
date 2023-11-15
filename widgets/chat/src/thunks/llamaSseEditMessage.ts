import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { setLastMessageId } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
}

export const llamaSseEditMessage = createAsyncThunk<void, {
  parent_id: string,
  newMessages: ChatCompletionMessageParam[]
}, LlamaThunkApiConfig>(
  "llamaChat/editMessage",
  async ({ parent_id, newMessages }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    dispatch(setLastMessageId({ messageId: parent_id }));

    const state = getState();
    const thread = threadMemo(state);
    const chatId = state.llamaChat.currentChatId;
    const assistantParams = state.llamaChatParams;

    if (!chatId) {
      throw new Error("No chatId");
    }

    try {
      const body = await wretch(`chat/${chatId}`)
        .post<SendMessageParams>({
          thread,
          newMessages,
          assistantParams,
        });

      for await (const action of streamToAssistantAction(body)) {
        dispatch(action);
      }
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send message");
    }
  },
);