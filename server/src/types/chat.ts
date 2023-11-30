import { ChatCompletionMessage, ChatCompletionRole } from "openai/src/resources/chat/completions";

export interface ILlamaMessage extends Omit<ChatCompletionMessage, 'role'>{
  role: ChatCompletionRole;
  id: string;
  parent_id: string;
}

export interface LlamaChat {
  title: string;
  updated: Date;
}