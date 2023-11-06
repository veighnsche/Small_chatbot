import { ChatCompletionMessage } from "openai/src/resources/chat/completions";

export interface ILlamaMessage extends ChatCompletionMessage {
  id: string;
  parent_id: string;
}

export interface LlamaChat {
  title: string;
  updated: Date;
}