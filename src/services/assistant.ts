import { JSONSchema7 } from "json-schema";
import { OpenAI } from "openai";
import { Chat, ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";
import { AppChatMessage } from "../models/chatMessage";
import { OPEN_AI_API_KEY } from "./environmentVariables";
import ChatCompletionCreateParams = Chat.ChatCompletionCreateParams;

const openai = () => new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

export async function* callAssistantStream(chatMessages: AppChatMessage[]): AsyncGenerator<ChatCompletionChunk.Choice.Delta> {
  const messages: ChatCompletionMessage[] = AppChatMessage.toChatCompletionMessages(chatMessages);

  const completionStreamResult = await openai().chat.completions.create({
    messages,
    model: "gpt-3.5-turbo-0613", // todo: make this configurable
    // functions: functionCallInfosWithDefaultParameters([]),
    stream: true,
  });

  if (typeof completionStreamResult[Symbol.asyncIterator] === "function") {
    for await (const chunk of completionStreamResult) {
      yield chunk.choices[0].delta;
    }
  } else {
    throw new Error("The completion stream result is not iterable.");
  }
}


export const callNamingAssistant = async (chatMessages: AppChatMessage[]): Promise<string> => {
  const messages: ChatCompletionMessage[] = AppChatMessage.toChatCompletionMessages(chatMessages);

  const completion = await openai().chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a title generator. Your goal is to generate a title for the following conversation.",
      },
      ...messages,
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 25,
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

  console.log(message.function_call)

  const args = JSON.parse(message.function_call.arguments);
  if (!args.title) {
    throw new Error("No title was returned from the naming assistant.");
  }

  return args.title;
};
