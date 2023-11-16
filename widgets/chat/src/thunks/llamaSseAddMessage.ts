import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread.ts";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { emptyLoadedSystemMessages } from "../slices/llamaChatSlice.ts";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { loadedSystemToChatParam } from "../utils/messages.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
}

export const llamaSseAddMessage = createAsyncThunk<void, {
  newMessages: ChatCompletionMessageParam[];
  params?: Partial<LlamaChatParams>;
}, LlamaThunkApiConfig>(
  "llamaChat/addMessage",
  async ({ newMessages, params }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chatId = state.llamaChat.currentChatId;
    const assistantParams = {
      ...state.llamaChatParams,
      ...(params || {})
    }

    const loadedSystemMessages = state.llamaChat.loadedSystemMessages;

    const nextMessages = [
      ...loadedSystemMessages.map(loadedSystemToChatParam),
      ...newMessages,
    ];

    dispatch(emptyLoadedSystemMessages());

    try {
      const body = await wretch(`chat${chatId ? `/${chatId}` : ""}`)
        .post<SendMessageParams>({
          thread,
          newMessages: nextMessages,
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