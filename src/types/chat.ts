import { ChatCompletionMessage } from "openai/src/resources/chat/completions";

export interface IAppChatMessage extends ChatCompletionMessage {
  id: string;
  parent_id: string;
}

export interface AppChat {
  title: string;
  updated: Date;
}