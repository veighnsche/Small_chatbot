import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";

// Memoized selectors
export const makeIsSelectedChatMemo = createSelector(
  (state: RootLlamaState) => state.llamaChat.currentChat_id,
  currentChat_id => (chat_id: string) => currentChat_id === chat_id,
);



