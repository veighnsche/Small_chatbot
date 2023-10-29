import OpenAI from "openai";
import { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";
import ChatCompletionRole = OpenAI.ChatCompletionRole;

export function combineChatDeltasIntoSingleMsg(deltas: ChatCompletionChunk.Choice.Delta[]): ChatCompletionMessage {
  const role = findLastRole(deltas);
  const functionCallName: string | undefined = findFunctionCallName(deltas);

  if (!functionCallName) {
    return {
      role,
      content: deltas.reduce((acc, delta) => {
        if (!delta.content) {
          return acc;
        }
        return acc + delta.content;
      }, ""),
    };
  }

  if (functionCallName) {
    return {
      role,
      content: null,
      function_call: {
        name: functionCallName,
        arguments: deltas.reduce((acc, delta) => {
          if (!delta.function_call) {
            return acc;
          }
          return acc + delta.function_call.arguments;
        }, ""),
      },
    };
  }

  throw new Error("combineDeltasIntoSingleMessage: Invalid delta");
}

function findLastRole(deltas: ChatCompletionChunk.Choice.Delta[]): ChatCompletionRole {
  const lastRole = deltas.reduce<ChatCompletionRole>((acc, delta) => delta.role || acc, "assistant");

  if (!lastRole) {
    throw new Error("findLastRole: Invalid delta");
  }

  return lastRole;
}

function findFunctionCallName(deltas: ChatCompletionChunk.Choice.Delta[]): string | undefined {
  return deltas.reduce<string | undefined>((acc, delta) => {
    if (delta.function_call?.name) {
      return delta.function_call.name;
    }

    return acc;
  }, undefined);
}