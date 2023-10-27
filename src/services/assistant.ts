import { OpenAI } from "openai";
import { ChatCompletionMessage } from "openai/resources/chat";
import { addMessage, updateChatName } from "../repositories/chat";
import { ChatMessage } from "../types/chat";
import {
  functionCallInfosWithDefaultParameters,
  removeDefaultParameters,
  toChatCompletionFunctionCall,
} from "../utils/assistant";

const openai = () => new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const callAssistant = async (userUid: string, chatId: string, ChatMessages: ChatMessage[]): Promise<ChatCompletionMessage> => {
  const messages: ChatCompletionMessage[] = [
    ...ChatMessages.map((message) => {
      if (message.function_call) {
        return ({
          role: message.role,
          content: null,
          function_call: toChatCompletionFunctionCall(message),
        });
      }

      return ({
        role: message.role,
        content: message.content,
      });
    }),
  ];

  const completion = await openai().chat.completions.create({
    messages,
    model: "gpt-3.5-turbo-0613", // todo: make this configurable
    functions: functionCallInfosWithDefaultParameters([]),
  });

  if (completion.choices[0].message.content) {
    await addMessage({
      userUid: userUid,
      chatId: chatId,
      content: completion.choices[0].message.content,
      role: "assistant",
    });
  } else if (completion.choices[0].message.function_call) {
    const functionCall = completion.choices[0].message.function_call;

    const args = JSON.parse(functionCall.arguments);

    await addMessage({
      userUid: userUid,
      chatId: chatId,
      content: args.content,
      role: "assistant",
      functionName: functionCall.name,
      functionArgs: removeDefaultParameters(args),
    });
  }

  return completion.choices[0].message;
};

export const callNamingAssistant = async (userUid: string, chatId: string, content: string, assistantMessage: ChatCompletionMessage) => {
  const completion = await openai().chat.completions.create({
    messages: [
      { role: "user", content },
      assistantMessage,
      {
        role: "user",
        content: "We're on a limited token budget. Transform our conversation into three short words.",
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 10,
  });

  if (completion.choices[0].message.content) {
    await updateChatName(userUid, chatId, completion.choices[0].message.content);
  }
};
