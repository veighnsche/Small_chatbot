import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, orderBy, query, Timestamp, Unsubscribe } from "firebase/firestore";
import { setHistory } from "../slices/llamaHistorySlice";
import { LlamaThunkApiConfig } from "../stores/llamaStore";
import { LlamaChat } from "../types/LlamaChat";

let unsubscribe: Unsubscribe | null = null;

export const llamaOnHistorySnapshot = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaHistory/subscribeToLlamaHistory",
  async (_, { dispatch, extra: { userDocRef } }) => {

    const historyCol = query(
      collection(userDocRef, "chats"),
      orderBy("updated", "desc"),
    );

    unsubscribe = onSnapshot(historyCol, (snapshot) => {
      const history = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<LlamaChat, "id" | "updated" | "selected"> & {
          updated: Timestamp;
        };
        return {
          id: doc.id,
          ...data,
          updated: data.updated.toDate().toISOString(),
        };
      });
      dispatch(setHistory({ history }));
    });
  },
);

// Expose an unsubscribe function
export const unsubscribeFromLlamaHistory = createAsyncThunk<void, void, LlamaThunkApiConfig>(
  "llamaHistory/unsubscribeFromLlamaHistory",
  async (_, { dispatch }) => {
    if (!unsubscribe) {
      return;
    }
    dispatch(setHistory({ history: [] }));
    unsubscribe();
  },
);
