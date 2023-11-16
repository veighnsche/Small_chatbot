import { useEffect, useRef } from "react";
import { threadSseMemo } from "../../selectors/threadSse.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
import { unsubscribeFromLlamaMessages } from "../../thunks/llamaOnMessagesSnapshot.ts";

export const UseLlamaChat = () => {
  const dispatch = useLlamaDispatch();
  const thread = useLlamaSelector(threadSseMemo);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      dispatch(unsubscribeFromLlamaMessages());
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      const element = chatContainerRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [thread]);

  return {
    thread,
    chatContainerRef,
  };
};