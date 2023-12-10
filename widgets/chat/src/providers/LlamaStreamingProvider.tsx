import { jsonrepair } from "jsonrepair";
import { safeJSON } from "openai/core";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { llamaEventBus } from "../services/llamaEventBus.ts";
import { LlamaMessage } from "../types/LlamaMessage.ts";
import { removeKeys } from "../utils/objects.ts";

type LlamaStreamingContext = [LlamaMessage | null, Dispatch<SetStateAction<LlamaMessage | null>>];

const llamaStreamingContext = createContext<LlamaStreamingContext>(null!);

export const useLlamaStreamingRead = () => {
  const [llamaStreaming] = useContext(llamaStreamingContext);

  return llamaStreaming;
};

export const LlamaStreamingProvider = ({ children }: {
  children: ReactNode
}) => {
  const [llamaStreaming, setLlamaStreaming] = useState<LlamaMessage | null>(null);

  function initiateStream({ role }: { role: "assistant" }): void {
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

  function addToStreamContent({ content }: { content: string }): void {
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

  function beginFunctionStreaming({ name }: { name: string }): void {
    setLlamaStreaming(message => {
      if (message) {
        return {
          ...message,
          content: "",
          function_call: {
            name,
            arguments: "",
          },
        };
      }
      return message;
    });
  }

  function extendFunctionArguments({ arguments: args }: { arguments: string }): void {
    setLlamaStreaming(message => {
      if (message && message.function_call) {
        const nextArguments = message.function_call.arguments + args;

        try {
          const repairedArguments = jsonrepair(nextArguments);
          const parsedArguments = safeJSON(repairedArguments);
          if (parsedArguments) {
            if ("explanation" in parsedArguments) {
              const removedExplanation = removeKeys(parsedArguments, ["explanation"])
              if (Object.keys(removedExplanation).length > 0) {
                llamaEventBus.emit("stream-arguments", removedExplanation);
              }
              return {
                ...message,
                content: parsedArguments.explanation,
                function_call: {
                  ...message.function_call,
                  arguments: nextArguments,
                },
              };
            } else {
              llamaEventBus.emit("stream-arguments", parsedArguments);
            }
          }
        } catch (e) {
        }

        return {
          ...message,
          function_call: {
            ...message.function_call,
            arguments: nextArguments,
          },
        };
      }
      return message;
    });
  }

  function terminateStream(): void {
    // assistantStream = undefined;
    setLlamaStreaming(null);
  }

  useEffect(() => {
    const subs = [
      llamaEventBus.on("initiate-stream", initiateStream),
      llamaEventBus.on("add-to-stream-content", addToStreamContent),
      llamaEventBus.on("begin-function-streaming", beginFunctionStreaming),
      llamaEventBus.on("extend-function-arguments", extendFunctionArguments),
      llamaEventBus.on("terminate-stream", terminateStream),
    ];

    return () => {
      subs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <llamaStreamingContext.Provider value={[llamaStreaming, setLlamaStreaming]}>
      {children}
    </llamaStreamingContext.Provider>
  );
};