import { RootLlamaState } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { denormalize } from "../utils/denormalize";
import { makeThreadFromLastMessage } from "../utils/messages";

export class LlamaMemoizer {
  private chatId: string | undefined = undefined;
  private messagesLength: number = 0;
  private lastMessageId: LlamaMessage["id"] = "-1";
  private result: LlamaMessage[] = [];
  private denormalizedMessages: Record<LlamaMessage["id"], LlamaMessage> = {};

  public threadMemo(state: RootLlamaState): LlamaMessage[] {
    if (!!state.llamaChat.assistantStream) {
      return this.result;
    }

    const { currentChatId, messages, lastMessageId } = state.llamaChat;

    if (this.shouldDenormalize(currentChatId, messages.length)) {
      this.denormalizedMessages = denormalize(messages);
    }

    if (this.shouldComputeThread(currentChatId, messages.length, lastMessageId)) {
      this.result = makeThreadFromLastMessage(this.denormalizedMessages, lastMessageId);
      this.chatId = currentChatId;
      this.messagesLength = messages.length;
      this.lastMessageId = lastMessageId;
    }

    return this.result;
  }

  private shouldDenormalize(chatId: string | undefined, messageLength: number): boolean {
    return this.chatId !== chatId || this.messagesLength !== messageLength;
  }

  private shouldComputeThread(
    chatId: string | undefined,
    messagesLength: number,
    lastMessageId: LlamaMessage["id"],
  ): boolean {
    return this.chatId !== chatId ||
      this.messagesLength !== messagesLength ||
      this.lastMessageId !== lastMessageId;
  }
}

const llamaMemoizerInstance = new LlamaMemoizer();

export const threadMemo = (state: RootLlamaState): LlamaMessage[] => llamaMemoizerInstance.threadMemo(state);
