import { RootLlamaState } from "../stores/llamaStore";
import { LlamaMessage } from "../types/LlamaMessage";
import { denormalize } from "../utils/denormalize";
import { makeThreadFromLastMessage } from "../utils/messages";

/**
 * LlamaMemoizer class for memoizing chat threads in a Redux state.
 * This class follows a singleton pattern to ensure a single, global instance that can be reused across the application.
 * It helps in optimizing performance by memoizing the result of expensive operations like denormalizing and threading messages.
 *
 * @class LlamaMemoizer
 *
 * @property {string|undefined} chatId - The current chat ID. Used to check if the chat context has changed.
 * @property {number} messagesLength - Length of the messages array. Used to detect changes in the number of messages.
 * @property {string} lastMessageId - The ID of the last message. Used to determine if the latest message has changed.
 * @property {LlamaMessage[]} result - Cached result of the memoization process.
 * @property {Record<string, LlamaMessage>} denormalizedMessages - Denormalized messages for efficient access.
 *
 * @method threadMemo
 *   Computes and memoizes chat threads based on the current state.
 *   This method should be called to get the memoized thread data.
 *   If the relevant parts of the state (currentChatId, messages, lastMessageId) haven't changed, it returns the memoized result.
 *   Otherwise, it recomputes the result.
 *
 *   @param {RootLlamaState} state - The current state of the Redux store.
 *   @returns {LlamaMessage[]} An array of LlamaMessage objects representing the chat thread.
 *
 * @example
 *   // Creating an instance of LlamaMemoizer
 *   const llamaMemoizerInstance = new LlamaMemoizer();
 *
 *   // Using the instance to get memoized thread data
 *   const memoizedThread = llamaMemoizerInstance.threadMemo(someReduxState);
 */
export class LlamaMemoizer {
  private chatId: string | undefined = undefined;
  private messagesLength: number = 0;
  private lastMessageId: LlamaMessage["id"] = "-1";
  private denormalizedMessages: Record<LlamaMessage["id"], LlamaMessage> = {};

  private result: LlamaMessage[] = [];

  public threadMemo(state: RootLlamaState): LlamaMessage[] {
    if (!!state.llamaChat.assistantStream) {
      return this.result;
    }

    const { currentChatId, messages, lastMessageId } = state.llamaChat;

    if (this.chatId !== currentChatId || this.messagesLength !== messages.length) {
      this.denormalizedMessages = denormalize(messages);
    }

    if (
      this.chatId !== currentChatId ||
      this.messagesLength !== messages.length ||
      this.lastMessageId !== lastMessageId
    ) {
      this.result = makeThreadFromLastMessage(this.denormalizedMessages, lastMessageId);
      this.chatId = currentChatId;
      this.messagesLength = messages.length;
      this.lastMessageId = lastMessageId;
    }

    return this.result;
  }
}

/**
 * Singleton instance of LlamaMemoizer.
 * This instance should be used for all memoization needs related to Llama chat threads.
 *
 * @type {LlamaMemoizer}
 */
const llamaMemoizerInstance: LlamaMemoizer = new LlamaMemoizer();

/**
 * Exports a function that wraps the LlamaMemoizer instance's threadMemo method.
 * This function is intended for use as a selector within the Redux toolkit framework.
 * It provides a convenient way to access the memoized chat thread data from the Redux state.
 *
 * @function threadMemo
 * @param {RootLlamaState} state - The current state of the Redux store.
 * @returns {LlamaMessage[]} An array of LlamaMessage objects representing the chat thread.
 */
export const threadMemo = (state: RootLlamaState): LlamaMessage[] => llamaMemoizerInstance.threadMemo(state);
