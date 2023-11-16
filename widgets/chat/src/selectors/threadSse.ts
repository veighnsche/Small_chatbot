import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage.ts";
import { processSystemMessagesToLlama } from "../utils/messages.ts";
import { threadMemo } from "./thread";

export const threadSseMemo: (state: RootLlamaState) => LlamaMessage[] = createSelector(
  threadMemo,
  (state: RootLlamaState) => state.llamaChat.assistantStream,
  (state: RootLlamaState) => state.llamaChat.loadedSystemMessages,
  (
    thread,
    assistantStream,
    loadedSystemMessages,
  ) => {
    if (assistantStream) {
      return [...thread, assistantStream];
    }

    return loadedSystemMessages.length > 0
      ? processSystemMessagesToLlama(thread, loadedSystemMessages)
      : thread;
  },
);
