import { JSONSchema7 } from "json-schema";
import { OpenAI } from "openai";
import { Chat, ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";
import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";
import { LlamaMessage } from "../models/chatMessage";
import { OPEN_AI_API_KEY } from "./environmentVariables";
import ChatCompletionCreateParams = Chat.ChatCompletionCreateParams;

const openai = () => new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

export async function* callAssistantStream(assistantParams: ChatCompletionCreateParamsBase): AsyncGenerator<ChatCompletionChunk.Choice> {
  const completionStreamResult = await openai().chat.completions.create({
    ...assistantParams,
    stream: true,
  });

  if (typeof completionStreamResult[Symbol.asyncIterator] === "function") {
    for await (const chunk of completionStreamResult) {
      yield chunk.choices[0];
    }
  } else {
    throw new Error("The completion stream result is not iterable.");
  }
}


export const callChatTitleAssistant = async (chatMessages: LlamaMessage[]): Promise<string> => {
  const messages: ChatCompletionMessage[] = LlamaMessage.toChatCompletionMessagesParam(chatMessages);

  const completion = await openai().chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a title generator. Your goal is to generate a title for the following conversation.",
      },
      ...messages,
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 50,
    function_call: { name: "set_title" },
    functions: [
      {
        name: "set_title",
        description: "Set a 3 worded title of the conversation.",
        parameters: <JSONSchema7>{
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The title of the conversation.",
            },
          },
          required: [
            "title",
          ],
        } as ChatCompletionCreateParams.Function["parameters"],
      },
    ],
  });

  const message = completion.choices[0].message;
  if (!message.function_call) {
    throw new Error("No function call was returned from the naming assistant.");
  }

  const args = JSON.parse(message.function_call.arguments);
  if (!args.title) {
    throw new Error("No title was returned from the naming assistant.");
  }

  return args.title;
};
