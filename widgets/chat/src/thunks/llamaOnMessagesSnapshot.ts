import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { reset, setCurrentChatId, setMessages } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";

let unsubscribeMessages: (() => void) | null = null;

export const llamaOnMessagesSnapshot = createAsyncThunk<void, { chatId?: string }, LlamaThunkApiConfig>(
  "llamaChat/subscribeToLlamaMessages",
  async ({ chatId }, { dispatch, extra: { userDocRef } }) => {
    unsubscribeFromLlamaMessages();

    if (!chatId) {
      dispatch(reset());
      return;
    }

    dispatch(setCurrentChatId({ chatId }));

    const messagesCol = collection(userDocRef, "chats", chatId, "messages");

    unsubscribeMessages = onSnapshot(messagesCol, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setMessages({ messages: messages as LlamaMessage[] }));
    });
  },
);

// Expose an unsubscribe function
export function unsubscribeFromLlamaMessages() {
  if (unsubscribeMessages) {
    unsubscribeMessages();
    unsubscribeMessages = null;
  }
}
