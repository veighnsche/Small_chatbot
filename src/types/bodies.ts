import { ChatCompletionCreateParamsBase, ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { AppChatMessage } from "../models/chatMessage";

export interface NewMessagesBody {
  newMessages: ChatCompletionMessage[],
}

export interface MessagesBody {
  messages: AppChatMessage[],
}

export interface EditChatTitleBody {
  title: string,
}

export interface AssistantParamsBody {
  assistantParams: Omit<ChatCompletionCreateParamsBase, "messages" | "stream" | "n">,
}