import { IAppChatMessage } from "../types/chat";

export function getLastId(messages: IAppChatMessage[]): string {
  return messages[messages.length - 1].id;
}