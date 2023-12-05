import type { User } from "firebase/auth";
import type { ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/chat";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

export interface LlamaTreeProps {
  user: User;
  customCssUrl?: string;
  onLlamaAction?: (action: { type: string; payload: Record<string, any> }) => void;
  onFunctionCall?: (functionCall: ChatCompletionMessage.FunctionCall) => void;
}

export interface LlamaLoadedSystemMessage {
  title: string;
  content: string;
}

export interface LlamaChatViewSliceState {
  isOpen: boolean;
  isLarge: boolean;
  isHistoryDrawerOpen: boolean;
}

export interface LlamaMessage extends ChatCompletionMessageParam {
  id: string;
  parent_id: string;
}

export interface LlamaChatParams extends ChatCompletionCreateParamsBase {
}

export interface LlamaActions {
  type: string;
  payload: Record<string, any>;
}

/**
 * Interface for the ChatWidgetElement.
 */
export interface IChatWidgetElement extends HTMLElement {
  /**
   * Sets the URL for the chat widget.
   * @param url The URL to set for the chat widget.
   */
  setUrl(url: string): Promise<void>;

  /**
   * Sets the user for the chat widget.
   * @param user The User object to set for the chat widget.
   */
  setUser(user: User): Promise<void>;

  /**
   * Sets a custom CSS URL for the chat widget.
   * @param url The URL of the custom CSS to apply.
   */
  setCustomCssUrl(url: string): Promise<void>;

  /**
   * Loads a system message into the chat widget.
   * @param systemMessage The system message to load.
   */
  loadSystemMessage(systemMessage: LlamaLoadedSystemMessage): this;

  /**
   * Removes a loaded system message from the chat widget.
   * @param id The ID of the system message to remove.
   */
  removeLoadedSystemMessage(id: string): this;

  /**
   * Loads multiple system messages into the chat widget.
   * @param systemMessages An array of system messages to load.
   */
  loadSystemMessages(systemMessages: LlamaLoadedSystemMessage[]): this;

  /**
   * Removes multiple loaded system messages from the chat widget.
   * @param ids An array of IDs of the system messages to remove.
   */
  removeLoadedSystemMessages(ids: string[]): this;

  /**
   * Empties all loaded system messages from the chat widget.
   */
  emptyLoadedSystemMessages(): this;

  /**
   * Sets chat parameters for the chat widget.
   * @param params The chat parameters to set, either as an object or a function returning a partial object.
   */
  setChatParams(params: LlamaChatParams | ((params: LlamaChatParams) => Partial<LlamaChatParams>)): this;

  /**
   * Sets the chat view state for the chat widget.
   * @param view A partial view state object to set for the chat widget.
   */
  setChatView(view: Partial<LlamaChatViewSliceState>): this;

  /**
   * Sets the chat ID for the chat widget.
   * @param chat_id The chat ID to set.
   */
  setChat_id(chat_id: string): this;

  /**
   * Sends a message through the chat widget.
   * @param message The message to send.
   * @param params Optional partial chat parameters for the message.
   * @returns A promise that resolves to a LlamaMessage object.
   */
  sendLlamaMessage(message: string, params?: Partial<LlamaChatParams>): Promise<LlamaMessage>;

  /**
   * Subscribes to function call events.
   * @param callback The callback to execute on a function call event.
   * @returns A function to unsubscribe from the event.
   */
  onFunctionCall(callback: (functionCall: ChatCompletionMessage.FunctionCall) => void): () => void;

  /**
   * Subscribes to llama action events.
   * @param callback The callback to execute on a llama action event.
   * @returns A function to unsubscribe from the event.
   */
  onLlamaAction(callback: (action: LlamaActions) => void): () => void;
}
