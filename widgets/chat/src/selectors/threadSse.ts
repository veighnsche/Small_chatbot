import { createSelector } from "reselect";
import { RootLlamaState } from "../stores/llamaStore";
import { threadMemo } from "./thread";

export const threadSseMemo = createSelector(
  threadMemo,
  (state: RootLlamaState) => state.llamaChat.assistantStream,
  (thread, assistantStream) => {
    if (!assistantStream) {
      return thread;
    }

    return [...thread, assistantStream];
  },
);