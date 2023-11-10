import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

interface SendMessageParams {
  title: string;
}

export const editTitleApi = createAsyncThunk<void, SendMessageParams, LlamaThunkApiConfig>(
  "llamaChat/editTitle",
  async ({ title }, {
    getState,
    extra: { wretch },
  }) => {
    const state = getState();
    const chatId = state.llamaChat.currentChatId;

    try {
      await wretch(`chat/${chatId}/title`).post<SendMessageParams>({ title });
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send message");
    }
  },
);