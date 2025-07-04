import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { threadMemo } from "../selectors/thread.ts";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { emptyLoadedSystemMessages } from "../slices/llamaChatSlice.ts";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { loadedSystemToChatParam } from "../utils/messages.ts";
import { generateUnique_id } from "../utils/uid.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  clientMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
  assistant_uid: string;
}

export const llamaSseAddMessage = createAsyncThunk<void, {
  assistant_uid?: string;
  clientMessages: ChatCompletionMessageParam[];
  params?: Partial<LlamaChatParams>;
}, LlamaThunkApiConfig>(
  "llamaChat/addMessage",
  async ({
    assistant_uid = generateUnique_id(),
    clientMessages,
    params,
  }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chat_id = state.llamaChat.currentChat_id;
    const assistantParams = {
      ...state.llamaChatParams,
      ...(params || {}),
    };

    const loadedSystemMessages = state.llamaChat.loadedSystemMessages;

    const nextMessages = [
      ...loadedSystemMessages.map(loadedSystemToChatParam),
      ...clientMessages,
    ];

    dispatch(emptyLoadedSystemMessages());

    try {
      const body = await wretch(`chat${chat_id ? `/${chat_id}` : ""}`)
        .post<SendMessageParams>({
          thread,
          clientMessages: nextMessages,
          assistantParams,
          assistant_uid,
        });

      // for await (const action of streamToAssistantAction(body)) {
      //   dispatch(action);
      // }

      await streamToAssistantAction(body, dispatch);
    } catch (err) {
      console.trace(err);
      throw new Error("Failed to send message");
    }
  },
);