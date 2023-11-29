import { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";

export class DeltaCombiner {
  private incompleteMessage: Partial<ChatCompletionMessage> = {
    content: "",
  };

  get assistantMessage(): ChatCompletionMessage {
    return this.incompleteMessage as ChatCompletionMessage;
  }

  appendDelta(delta: ChatCompletionChunk.Choice.Delta) {
    if ("role" in delta) {
      this.incompleteMessage.role = delta.role;
    }
    if ("content" in delta && delta.content !== null) {
      this.incompleteMessage.content += delta.content;
    }
    if ("function_call" in delta) {
      if ("name" in delta.function_call) {
        this.incompleteMessage.function_call = {
          name: delta.function_call.name,
          arguments: "",
        };
      }
      if ("arguments" in delta.function_call) {
        this.incompleteMessage.function_call.arguments += delta.function_call.arguments;
      }
    }
  }
}