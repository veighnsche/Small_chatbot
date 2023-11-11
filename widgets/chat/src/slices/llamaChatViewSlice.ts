import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LlamaChatViewAction = ReturnType<typeof llamaChatViewSlice.actions[keyof typeof llamaChatViewSlice.actions]>

export interface LlamaChatViewSliceState {
  isOpen: boolean; // description: "Whether the chat is shown or minimized (a small bar)."
  isLarge: boolean; // description: "Whether the chat is large or small."
  isHistoryOpen: boolean; // description: "Whether the chat history drawer is open or closed."
}

const initialState: LlamaChatViewSliceState = {
  isOpen: true,
  isLarge: false,
  isHistoryOpen: true,
};

const llamaChatViewSlice = createSlice({
  name: "llamaChatView",
  initialState,
  reducers: {
    editChatView: (state, action: PayloadAction<Partial<LlamaChatViewSliceState>>) => {
      Object.assign(state, action.payload);
      return state;
    },
    toggleChatView: (state) => {
      state.isOpen = !state.isOpen;
      return state;
    },
    toggleChatSize: (state) => {
      state.isLarge = !state.isLarge;
      return state;
    },
    toggleChatHistory: (state) => {
      state.isHistoryOpen = !state.isHistoryOpen;
      return state;
    },
  },
});

export const {
  editChatView,
  toggleChatView,
  toggleChatSize,
  toggleChatHistory,
} = llamaChatViewSlice.actions;

export default llamaChatViewSlice.reducer;