import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { LlamaMessage } from "../models/chatMessage";

export interface NewMessagesBody {
  newMessages: ChatCompletionMessage[],
}

export interface ThreadBody {
  thread: LlamaMessage[],
}

export interface EditChatTitleBody {
  title: string,
}

export interface AssistantParamsBody {
  assistantParams: Omit<ChatCompletionCreateParamsNonStreaming, "messages" | "n">,
}