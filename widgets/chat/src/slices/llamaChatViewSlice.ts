import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LlamaChatViewAction = ReturnType<typeof llamaChatViewSlice.actions[keyof typeof llamaChatViewSlice.actions]>

export interface LlamaChatViewSliceState {
  isOpen: boolean;
  isLarge: boolean;
  isHistoryDrawerOpen: boolean;
}

const initialState: LlamaChatViewSliceState = {
  isOpen: false,
  isLarge: false,
  isHistoryDrawerOpen: false,
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
    toggleHistoryDrawer: (state) => {
      state.isHistoryDrawerOpen = !state.isHistoryDrawerOpen;
      return state;
    },
    toggleSize: (state) => {
      state.isLarge = !state.isLarge;
      return state;
    },
  },
});

export const {
  editChatView,
  toggleChatView,
  toggleHistoryDrawer,
  toggleSize,
} = llamaChatViewSlice.actions;

export default llamaChatViewSlice.reducer;