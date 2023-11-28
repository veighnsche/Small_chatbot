import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { LlamaStreamContext } from "../providers/LlamaStreamingProvider.tsx";
import { threadMemo } from "../selectors/thread";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { setLastMessageId } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { generateUniqueID } from "../utils/uid.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  clientMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
  assistant_uid: string;
}

export const llamaSseEditMessage = createAsyncThunk<void, {
  assistant_uid?: string,
  parent_id: string,
  clientMessages: ChatCompletionMessageParam[]
  llamaStreamContext: LlamaStreamContext,
}, LlamaThunkApiConfig>(
  "llamaChat/editMessage",
  async ({
    assistant_uid = generateUniqueID(),
    parent_id,
    clientMessages,
    llamaStreamContext,
  }, {
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
          clientMessages,
          assistantParams,
          assistant_uid,
        });

      await streamToAssistantAction(body, dispatch, llamaStreamContext);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send message");
    }
  },
);