import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";

export const chatTitleMemo = createSelector(
  (state: RootLlamaState) => state.llamaHistory.history,
  (state: RootLlamaState) => state.llamaChat.currentChatId,
  (history, chatId) => {
    const chat = history.find((chat) => chat.id === chatId);
    return chat?.title || "New Chat";
  },
);