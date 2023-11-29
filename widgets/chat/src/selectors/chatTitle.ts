import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";

export const chatTitleMemo = createSelector(
  (state: RootLlamaState) => state.llamaHistory.history,
  (state: RootLlamaState) => state.llamaChat.currentChat_id,
  (history, chat_id) => {
    const chat = history.find((chat) => chat.id === chat_id);
    return chat?.title || "New Chat";
  },
);