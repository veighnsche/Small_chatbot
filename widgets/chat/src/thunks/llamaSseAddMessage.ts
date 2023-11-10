import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: Omit<ChatCompletionCreateParamsNonStreaming, "messages" | "n">;
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

    try {
      const body = await wretch(`chat${chatId ? `/${chatId}` : ""}`)
        .post<SendMessageParams>({
          thread,
          newMessages,
          assistantParams: {
            model: "gpt-3.5-turbo",
          },
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