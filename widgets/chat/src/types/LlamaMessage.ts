import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface LlamaMessage extends ChatCompletionMessageParam {
  id: string;
  parent_id: string;
  disabled?: boolean;
  iter: {
    current: number;
    total: number;
  };
  isLastAssistantMessage?: boolean;
}

export const LlamaMessageUtils = {
  toChatCompletionMessageParam: (message: ChatCompletionMessageParam): ChatCompletionMessageParam => {
    return {
      ...message,
      function_call: message.function_call ? {
        ...message.function_call,
        arguments: JSON.stringify(message.function_call.arguments),
      } : undefined,
    };
  },
};