import { ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { AppChatMessage } from "../models/chatMessage";

export interface NewMessagesBody {
  newMessages: ChatCompletionMessage[],
}

export interface MessagesBody {
  messages: AppChatMessage[],
}