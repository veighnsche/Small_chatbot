import { useEffect } from "react";
import { makeIsSelectedChatMemo } from "../../selectors/isSelectedChat";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore";
import { llamaOnHistorySnapshot, unsubscribeFromLlamaHistory } from "../../thunks/llamaOnHistorySnapshot";

export const useLlamaHistoryList = () => {
  const selectedChatId = useLlamaSelector(makeIsSelectedChatMemo);
  const history = useLlamaSelector((state) => state.llamaHistory.history);
  const dispatch = useLlamaDispatch();

  useEffect(() => {
    dispatch(llamaOnHistorySnapshot());

    return () => {
      unsubscribeFromLlamaHistory();
    };
  }, [dispatch]);

  return {
    history,
    selectedChatId,
  };
}