import { useEffect, useRef } from "react";
import { useLlamaStreamingRead } from "../../providers/LlamaStreamingProvider.tsx";
import { threadWithLoadedSystemMessagesMemo } from "../../selectors/threadSse.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
import { unsubscribeFromLlamaMessages } from "../../thunks/llamaOnMessagesSnapshot.ts";

export const UseLlamaChat = () => {
  const dispatch = useLlamaDispatch();
  const thread = useLlamaSelector(threadWithLoadedSystemMessagesMemo);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const llamaStreaming = useLlamaStreamingRead();

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
    thread: llamaStreaming ? [...thread, llamaStreaming] : thread,
    chatContainerRef,
  };
};