import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread";
import { setLastMessageId } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: Omit<ChatCompletionCreateParamsNonStreaming, "messages" | "n">;
}

export const editMessage = createAsyncThunk<void, {
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

    if (!chatId) {
      throw new Error("No chatId");
    }

    try {
      console.log({
        thread,
        newMessages,
        assistantParams: {
          model: "gpt-3.5-turbo",
        },
      });
      const body = await wretch(`chat/${chatId}`)
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