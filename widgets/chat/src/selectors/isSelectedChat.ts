import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";

// Memoized selectors
export const makeIsSelectedChatMemo = createSelector(
  (state: RootLlamaState) => state.llamaChat.currentChatId,
  currentChatId => (chatId: string) => currentChatId === chatId,
);



