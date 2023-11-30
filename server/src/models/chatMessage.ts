import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/chat";
import { ChatCompletionRole } from "openai/src/resources/chat/completions";
import { ILlamaMessage } from "../types/chat";
import { parseArguments } from "../utils/messages";
import { removeKeys } from "../utils/object";
import { getTimeStamp } from "../utils/time";

export const SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE = "[END OF SYSTEM MESSAGE TITLE]";

export class LlamaMessage implements ILlamaMessage {
  constructor(
    public content: string | null,
    public id: string,
    public parent_id: string,
    public role: ChatCompletionRole,
    public function_call?: ChatCompletionMessage.FunctionCall,
  ) {
  }

  static async fromChatCompletionMessage(message: ChatCompletionMessage, parent_id: string): Promise<LlamaMessage> {
    const timestamp = await getTimeStamp();

    if (message.content) {
      return new LlamaMessage(message.content, timestamp, parent_id, message.role);
    } else if (message.function_call) {
      const args = parseArguments(message.function_call.arguments);
      const newArgs = removeKeys(args, ["explanation"]);
      const parsedFunctionCall = {
        name: message.function_call.name,
        arguments: JSON.stringify(newArgs),
      };

      return new LlamaMessage(args.explanation, timestamp, parent_id, message.role, parsedFunctionCall);
    }

    console.trace("fromChatCompletionMessage: Message must have content or function call", { message });
    throw new Error("fromChatCompletionMessage: Message must have content or function call");
  }

  static async fromChatCompletionMessages(messages: ChatCompletionMessage[], parent_id: string): Promise<LlamaMessage[]> {
    if (messages.length === 0) {
      console.trace("fromChatCompletionMessages: Messages must not be empty", { messages });
      throw new Error("fromChatCompletionMessages: Messages must not be empty");
    }

    const results: LlamaMessage[] = [];

    // used for...of to ensure that the messages are processed in order
    for (const message of messages) {
      const newParent_id = results.length > 0 ? results[results.length - 1].id : parent_id;
      const appChatMessage = await LlamaMessage.fromChatCompletionMessage(message, newParent_id);
      results.push(appChatMessage);
    }

    return results;
  }

  static toChatCompletionMessagesParam(messages: LlamaMessage[]): ChatCompletionMessageParam[] {
    return messages.map((message) => message.toChatCompletionMessageParam());
  }

  static fromRecord(record: ILlamaMessage): LlamaMessage {
    return new LlamaMessage(
      record.content,
      record.id,
      record.parent_id,
      record.role,
      record.function_call,
    );
  }

  static fromRecords(records: ILlamaMessage[]): LlamaMessage[] {
    return records.map((record) => LlamaMessage.fromRecord(record));
  }

  toChatCompletionMessageParam(): ChatCompletionMessageParam {
    if (this.function_call) {
      const args = JSON.parse(this.function_call.arguments);

      const newArgs = {
        ...args,
        explanation: this.content,
      };

      return {
        role: "function",
        content: null,
        function_call: {
          name: this.function_call.name,
          arguments: JSON.stringify(newArgs),
        },
      };
    } else if (this.content) {
      if (this.role === "system") {
        const [_, content] = this.content.split(SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE);
        return {
          role: this.role,
          content,
        };
      }
      return {
        role: this.role,
        content: this.content,
      };
    }

    console.trace("toChatCompletionMessage: Message must have content or function call", { message: this });
    throw new Error("toChatCompletionMessage: Message must have content or function call");
  }

  toRecord(): ILlamaMessage {
    if (this.function_call) {
      return {
        id: this.id,
        parent_id: this.parent_id,
        content: this.content,
        role: this.role,
        function_call: this.function_call,
      };
    } else if (this.content) {
      return {
        id: this.id,
        parent_id: this.parent_id,
        content: this.content,
        role: this.role,
      };
    }

    console.trace("toRecord: Message must have content or function call", { message: this });
    throw new Error("toRecord: Message must have content or function call");
  }
}

