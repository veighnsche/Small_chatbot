import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

export const deleteConversationApi = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaChat/deleteConversation",
  async (_, {
    getState,
    extra: { wretch },
  }) => {
    const state = getState();
    const chatId = state.llamaChat.currentChatId;

    try {
      await wretch(`chat/${chatId}`).delete();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send message");
    }
  },
);