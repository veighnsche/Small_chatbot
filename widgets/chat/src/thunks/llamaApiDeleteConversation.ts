import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

export const llamaApiDeleteConversation = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaChat/deleteConversation",
  async (_, {
    getState,
    extra: { wretch },
  }) => {
    const state = getState();
    const chat_id = state.llamaChat.currentChat_id;

    try {
      await wretch(`chat/${chat_id}`).delete();
    } catch (err) {
      console.trace(err);
      throw new Error("Failed to send message");
    }
  },
);