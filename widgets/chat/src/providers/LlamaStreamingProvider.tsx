import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { LlamaMessage } from "../types/LlamaMessage.ts";

type LlamaStreamingContext = [LlamaMessage | null, Dispatch<SetStateAction<LlamaMessage | null>>];

const llamaStreamingContext = createContext<LlamaStreamingContext>(null!);

export type LlamaStreamContext = ReturnType<typeof useLlamaStreamingWrite>;

export const useLlamaStreamingRead = () => {
  const [llamaStreaming] = useContext(llamaStreamingContext);

  return llamaStreaming;
}

export const useLlamaStreamingWrite = () => {
  const [_, setLlamaStreaming] = useContext(llamaStreamingContext);

  function startAssistantStream({ role }: { role: "assistant" }): void {
    setLlamaStreaming({
      id: "stream",
      parent_id: "-1",
      role: role,
      content: "",
      iter: {
        current: 1,
        total: 1,
      },
    });
  }

  function startAssistantStreamFunctionCall({ name }: { name: string }): void {
    setLlamaStreaming(message => {
      if (message) {
        return {
          ...message,
          function_call: {
            name,
            arguments: "",
          },
        };
      }
      return message;
    });
  }

  function appendAssistantStreamContent({ content }: { content: string }): void {
    setLlamaStreaming(message => {
      if (message) {
        return {
          ...message,
          content: message.content + content,
        };
      }
      return message;
    });
  }

  function appendAssistantStreamFunctionCallArguments({ arguments: args }: { arguments: string }): void {
    setLlamaStreaming(message => {
      if (message && message.function_call) {
        return {
          ...message,
          function_call: {
            ...message.function_call,
            arguments: message.function_call.arguments + args,
          },
        };
      }
      return message;
    });
  }

  function stopAssistantStream(): void {
    // assistantStream = undefined;
    setLlamaStreaming(null);
  }

  return {
    startAssistantStream,
    startAssistantStreamFunctionCall,
    appendAssistantStreamContent,
    appendAssistantStreamFunctionCallArguments,
    stopAssistantStream,
  };
};

export const LlamaStreamingProvider = ({ children }: {
  children: ReactNode
}) => {
  const [llamaStreaming, setLlamaStreaming] = useState<LlamaMessage | null>(null);

  return (
    <llamaStreamingContext.Provider value={[llamaStreaming, setLlamaStreaming]}>
      {children}
    </llamaStreamingContext.Provider>
  );
};