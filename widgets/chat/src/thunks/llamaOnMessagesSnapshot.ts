import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { reset, setCurrentChatId, setMessages } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";

let unsubscribe: (() => void) | null = null;

export const llamaOnMessagesSnapshot = createAsyncThunk<void, { chatId?: string }, LlamaThunkApiConfig>(
  "llamaChat/subscribeToLlamaMessages",
  async ({ chatId }, { dispatch, extra: { userDocRef } }) => {
    dispatch(unsubscribeFromLlamaMessages());

    if (!chatId) {
      dispatch(reset());
      return;
    }

    dispatch(setCurrentChatId({ chatId }));

    const messagesCol = collection(userDocRef, "chats", chatId, "messages");

    unsubscribe = onSnapshot(messagesCol, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as LlamaMessage))

      dispatch(setMessages({ messages }));
    });
  },
);

export const unsubscribeFromLlamaMessages = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaChat/unsubscribeFromLlamaMessages",
  () => {
    unsubscribe?.();
  },
);
