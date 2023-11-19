import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage.ts";
import { processSystemMessagesToLlama } from "../utils/messages.ts";
import { threadMemo } from "./thread";

export const threadWithLoadedSystemMessagesMemo: (state: RootLlamaState) => LlamaMessage[] = createSelector(
  threadMemo,
  (state: RootLlamaState) => state.llamaChat.loadedSystemMessages,
  (thread, loadedSystemMessages) => {
    return loadedSystemMessages.length > 0
      ? processSystemMessagesToLlama(thread, loadedSystemMessages)
      : thread;
  },
);
