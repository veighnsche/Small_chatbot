import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
}

export const llamaSseAddMessage = createAsyncThunk<void, {
  newMessages: ChatCompletionMessageParam[]
}, LlamaThunkApiConfig>(
  "llamaChat/addMessage",
  async ({ newMessages }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chatId = state.llamaChat.currentChatId;
    const assistantParams = state.llamaChatParams;

    try {
      const body = await wretch(`chat${chatId ? `/${chatId}` : ""}`)
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