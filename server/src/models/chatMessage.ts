import OpenAI from "openai";
import { Chat, ChatCompletionMessage } from "openai/resources/chat";
import { ILlamaMessage } from "../types/chat";
import { fixJSON } from "../utils/json";
import { removeKeys } from "../utils/object";
import { getTimeStamp } from "../utils/time";
import ChatCompletionMessageParam = Chat.ChatCompletionMessageParam;
import ChatCompletionRole = OpenAI.ChatCompletionRole;

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

  static async fromChatCompletionMessage(message: ChatCompletionMessage, parentId: string): Promise<LlamaMessage> {
    const timestamp = await getTimeStamp();

    if (message.content) {
      return new LlamaMessage(message.content, timestamp, parentId, message.role);
    } else if (message.function_call) {
      const args = makeArgs(message.function_call.arguments);
      const newArgs = removeKeys(args, ["explanation"]);
      const parsedFunctionCall = {
        name: message.function_call.name,
        arguments: JSON.stringify(newArgs),
      };

      return new LlamaMessage(args.explanation, timestamp, parentId, message.role, parsedFunctionCall);
    }

    throw new Error("fromChatCompletionMessage: Message must have content or function call");
  }

  static async fromChatCompletionMessages(messages: ChatCompletionMessage[], parentId: string): Promise<LlamaMessage[]> {
    if (messages.length === 0) {
      throw new Error("fromChatCompletionMessages: Messages must not be empty");
    }

    const results: LlamaMessage[] = [];

    // used for...of to ensure that the messages are processed in order
    for (const message of messages) {
      const newParentId = results.length > 0 ? results[results.length - 1].id : parentId;
      const appChatMessage = await LlamaMessage.fromChatCompletionMessage(message, newParentId);
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
        role: this.role,
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

    throw new Error("toRecord: Message must have content or function call");
  }
}

function makeArgs(args: string): any {
  try {
    return JSON.parse(args);
  } catch (err) {
    // console.error("makeArgs: could not parse args as JSON");
    // commented out because this is expected behavior, backend needs to fix this.
    // the args always starts with "undefined"
  }

  if (!args.startsWith("{")) {
    // remove all the text before the first {
    const firstBraceIndex = args.indexOf("{");
    const newArgs = args.substring(firstBraceIndex);
    try {
      return JSON.parse(newArgs);
    } catch (err) {
      console.error("makeArgs: could not parse args by removing text before first {");
    }
  }

  const json = fixJSON(args);
  if (json) {
    return json;
  }

  console.error("makeArgs: could not fix JSON");
  return {};
}