import { ChatCompletionMessage } from "openai/resources/chat";
import { useEffect, useState } from "react";
import { useLlamaTree } from "./useLlamaTree";

export const useLlamaFunctionListener = (slugs: string[]) => {
  const [assistantMessage, setAssistantMessage] = useState<ChatCompletionMessage.FunctionCall | null>(null);
  const { onFunctionCall } = useLlamaTree();


  useEffect(() => {
    const unsubscribe = onFunctionCall((functionCall) => {
      if (slugs.includes(functionCall.name)) {
        setAssistantMessage(functionCall);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return assistantMessage;
};