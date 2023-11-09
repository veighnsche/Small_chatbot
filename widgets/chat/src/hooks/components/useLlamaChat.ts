import { useEffect, useRef } from "react";
import { threadSseMemo } from "../../selectors/threadSse";
import { useLlamaSelector } from "../../stores/llamaStore";
import { unsubscribeFromLlamaMessages } from "../../thunks/llamaOnMessagesSnapshot";

export const UseLlamaChat = () => {
  const thread = useLlamaSelector(threadSseMemo);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    unsubscribeFromLlamaMessages();
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
}