import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { LlamaStreamContext } from "../providers/LlamaStreamingProvider.tsx";
import { threadMemo } from "../selectors/thread.ts";
import { LlamaChatParams } from "../slices/llamaChatParamsSlice.ts";
import { emptyLoadedSystemMessages } from "../slices/llamaChatSlice.ts";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { loadedSystemToChatParam } from "../utils/messages.ts";
import { generateUniqueID } from "../utils/uid.ts";
import { streamToAssistantAction } from "./shared/stream";

interface SendMessageParams {
  thread: LlamaMessage[];
  newMessages: ChatCompletionMessageParam[];
  assistantParams: LlamaChatParams;
  assistant_uid: string;
}

export const llamaSseAddMessage = createAsyncThunk<void, {
  assistant_uid?: string;
  newMessages: ChatCompletionMessageParam[];
  params?: Partial<LlamaChatParams>;
  llamaStreamContext: LlamaStreamContext;
}, LlamaThunkApiConfig>(
  "llamaChat/addMessage",
  async ({
    assistant_uid = generateUniqueID(),
    newMessages,
    params,
    llamaStreamContext,
  }, {
    getState,
    dispatch,
    extra: { wretch },
  }) => {
    const state = getState();
    const thread = threadMemo(state);
    const chatId = state.llamaChat.currentChatId;
    const assistantParams = {
      ...state.llamaChatParams,
      ...(params || {}),
    };

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
          assistant_uid,
        });

      // for await (const action of streamToAssistantAction(body)) {
      //   dispatch(action);
      // }

      await streamToAssistantAction(body, dispatch, llamaStreamContext);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send message");
    }
  },
);