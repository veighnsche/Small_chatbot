import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { reset, setCurrentChat_id, setMessages } from "../slices/llamaChatSlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";

let unsubscribe: (() => void) | null = null;

export const llamaOnMessagesSnapshot = createAsyncThunk<void, {
  chat_id?: string;
}, LlamaThunkApiConfig>(
  "llamaChat/subscribeToLlamaMessages",
  async ({
    chat_id,
  }, { dispatch, extra: { userDocRef } }) => {
    dispatch(unsubscribeFromLlamaMessages());

    if (!chat_id) {
      dispatch(reset());
      return;
    }

    dispatch(setCurrentChat_id({ chat_id }));

    const messagesCol = collection(userDocRef, "chats", chat_id, "messages");

    unsubscribe = onSnapshot(messagesCol, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as LlamaMessage));

      dispatch(setMessages({ messages }));
    });
  },
);

export const unsubscribeFromLlamaMessages = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaChat/unsubscribeFromLlamaMessages",
  () => {
    unsubscribe?.();
    unsubscribe = null;
  },
);
