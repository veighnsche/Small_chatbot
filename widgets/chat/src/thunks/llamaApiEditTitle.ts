import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

interface SendMessageParams {
  title: string;
}

export const llamaApiEditTitle = createAsyncThunk<void, SendMessageParams, LlamaThunkApiConfig>(
  "llamaChat/editTitle",
  async ({ title }, {
    getState,
    extra: { wretch },
  }) => {
    const state = getState();
    const chat_id = state.llamaChat.currentChat_id;

    try {
      await wretch(`chat/${chat_id}/title`).post<SendMessageParams>({ title });
    } catch (err) {
      console.trace(err);
      throw new Error("Failed to send message");
    }
  },
);