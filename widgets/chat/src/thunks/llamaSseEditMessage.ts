import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
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
    assistant_uid = generateUnique_id(),
    parent_id,
    clientMessages,
    llamaStreamContext,
  }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    dispatch(setLastMessage_id({ message_id: parent_id }));

    const state = getState();
    const thread = threadMemo(state);
    const chat_id = state.llamaChat.currentChat_id;
    const assistantParams = state.llamaChatParams;

    if (!chat_id) {
      console.trace("No chat_id");
      throw new Error("No chat_id");
    }

    try {
      const body = await wretch(`chat/${chat_id}`)
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