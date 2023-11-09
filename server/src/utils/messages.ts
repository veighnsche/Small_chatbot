import { ILlamaMessage } from "../types/chat";

export function getLastId(messages: ILlamaMessage[]): string {
  if (messages.length === 0) return "-1";
  return messages[messages.length - 1].id;
}

