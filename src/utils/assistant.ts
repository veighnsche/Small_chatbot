import { JSONSchema7 as JSONSchema } from "json-schema";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources/chat";
import { ChatMessage } from "../types/chat";
import ChatCompletionCreateParams = OpenAI.ChatCompletionCreateParams;


export const removeDefaultParameters = (parameters: Record<string, any>): Record<string, any> => {
  const newParameters: Record<string, any> = {};

  Object.keys(parameters).forEach((key) => {
    if (key !== "content" && key !== "callback") {
      newParameters[key] = parameters[key];
    }
  });

  return newParameters;
};

export const toChatCompletionFunctionCall = (message: ChatMessage): ChatCompletionMessage.FunctionCall => {
  const json = JSON.parse(message.function_call!.arguments);

  if (message.content) {
    json.content = message.content;
  }
  if (message.function_call!.callback) {
    json.callback = message.function_call!.callback;
  }

  return ({
    name: message.function_call!.name,
    arguments: JSON.stringify(json),
  });
};

export const functionCallMetadataProperties: Record<string, unknown> = {
  content: <JSONSchema>{
    type: "string",
    description: "From the assistants perspective, what is the purpose of this function call? (eg. Adding squats to your [exercise list/workout plan])",
  },
  callback: <JSONSchema>{
    type: "string",
    description: "What to do with the result of the function call. (eg. If the exercise is already in the database then edit it, otherwise add it to the database)",
  },
};

export const functionCallInfosWithDefaultParameters = (functionDefinitions: ChatCompletionCreateParams.Function[]): ChatCompletionCreateParams.Function[] => functionDefinitions.map((functionCallInfo) => {
  // Merge the original properties with the metadata properties
  const mergedProperties = {
    ...functionCallMetadataProperties,
    ...functionCallInfo.parameters.properties as {},
  };

  // Merge the original required properties with the metadata properties
  const mergedRequired = [
    "content",
    ...functionCallInfo.parameters.required as [],
  ];

  // Return the updated function call info with the merged properties
  return {
    ...functionCallInfo,
    parameters: {
      ...functionCallInfo.parameters,
      properties: mergedProperties,
      required: mergedRequired,
    },
  };
});
