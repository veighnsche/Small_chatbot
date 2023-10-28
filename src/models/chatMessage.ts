import OpenAI from "openai";
import { Chat, ChatCompletionMessage } from "openai/resources/chat";
import { IAppChatMessage } from "../types/chat";
import { removeKeys } from "../utils/object";
import { getTimeStamp } from "../utils/time";
import ChatCompletionRole = OpenAI.ChatCompletionRole;
import ChatCompletionMessageParam = Chat.ChatCompletionMessageParam;

export class AppChatMessage implements IAppChatMessage {
  constructor(
    public content: string | null,
    public id: string,
    public parent_id: string,
    public role: ChatCompletionRole,
    public function_call?: ChatCompletionMessage.FunctionCall,
  ) {
  }

  static async fromChatCompletionMessage(message: ChatCompletionMessage, parentId: string): Promise<AppChatMessage> {
    const timestamp = await getTimeStamp();

    if (message.content) {
      return new AppChatMessage(message.content, timestamp, parentId, message.role);
    } else if (message.function_call) {
      const args = JSON.parse(message.function_call.arguments);
      const newArgs = removeKeys(args, ["content"])
      const newFunctionCall = {
        name: message.function_call.name,
        arguments: JSON.stringify(newArgs),
      };

      return new AppChatMessage(args.content, timestamp, parentId, message.role, newFunctionCall);
    }

    throw new Error("fromChatCompletionMessage: Message must have content or function call");
  }

  static async fromChatCompletionMessages(messages: ChatCompletionMessage[], parentId: string): Promise<AppChatMessage[]> {
    if (messages.length === 0) {
      throw new Error("fromChatCompletionMessages: Messages must not be empty");
    }

    const results: AppChatMessage[] = [];

    // used for...of to ensure that the messages are processed in order
    for (const message of messages) {
      const newParentId = results.length > 0 ? results[results.length - 1].id : parentId;
      const appChatMessage = await AppChatMessage.fromChatCompletionMessage(message, newParentId);
      results.push(appChatMessage);
    }

    return results;
  }

  toChatCompletionMessageParam(): ChatCompletionMessageParam {
    if (this.function_call) {
      const args = JSON.parse(this.function_call.arguments);

      const newArgs = {
        ...args,
        content: this.content,
      };

      return {
        role: this.role,
        content: null,
        function_call: {
          name: this.function_call.name,
          arguments: JSON.stringify(newArgs),
        },
      };
    } else if (this.content) {
      return {
        role: this.role,
        content: this.content,
      };
    }

    throw new Error("toChatCompletionMessage: Message must have content or function call");
  }

  static toChatCompletionMessagesParam(messages: AppChatMessage[]): ChatCompletionMessageParam[] {
    return messages.map((message) => message.toChatCompletionMessageParam());
  }

  toRecord(): IAppChatMessage {
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

    throw new Error("toRecord: Message must have content or function call");
  }

  static fromRecord(record: IAppChatMessage): AppChatMessage {
    return new AppChatMessage(
      record.content,
      record.id,
      record.parent_id,
      record.role,
      record.function_call,
    );
  }

  static fromRecords(records: IAppChatMessage[]): AppChatMessage[] {
    return records.map((record) => AppChatMessage.fromRecord(record));
  }
}