import { useEffect } from "react";
import { makeIsSelectedChatMemo } from "../../selectors/isSelectedChat.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
import { llamaOnHistorySnapshot, unsubscribeFromLlamaHistory } from "../../thunks/llamaOnHistorySnapshot.ts";

export const useLlamaHistoryList = () => {
  const selectedChat_id = useLlamaSelector(makeIsSelectedChatMemo);
  const history = useLlamaSelector((state) => state.llamaHistory.history);
  const dispatch = useLlamaDispatch();

  useEffect(() => {
    dispatch(llamaOnHistorySnapshot());

    return () => {
      dispatch(unsubscribeFromLlamaHistory());
    };
  }, []);

  return {
    history,
    selectedChat_id: selectedChat_id,
  };
}