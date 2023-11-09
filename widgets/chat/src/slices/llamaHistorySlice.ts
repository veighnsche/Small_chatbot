import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LlamaChat } from "../types/LlamaChat";

export type LlamaHistoryAction = ReturnType<typeof llamaHistorySlice.actions[keyof typeof llamaHistorySlice.actions]>

export interface LlamaHistoryState {
  history: LlamaChat[],
}

const initialState: LlamaHistoryState = {
  history: [],
};

export const llamaHistorySlice = createSlice({
  name: "llamaHistory",
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<{ history: LlamaChat[] }>) => {
      state.history = action.payload.history;
    },
  },
});

export const {
  setHistory,
} = llamaHistorySlice.actions;

export default llamaHistorySlice.reducer;