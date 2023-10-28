import { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";

export function combineDeltasIntoSingleMessage(deltas: ChatCompletionChunk.Choice.Delta[]): ChatCompletionMessage {
  let combinedContent = "";
  let combinedFunctionCalls: ChatCompletionMessage.FunctionCall[] = [];
  let role: ChatCompletionMessage["role"] | undefined;

  deltas.forEach(delta => {
    if (delta.content) {
      combinedContent += delta.content;
    }

    if (delta.function_call) {
      combinedFunctionCalls.push({
        name: delta.function_call.name || "",
        arguments: delta.function_call.arguments || "",
      });
    }

    if (delta.role) {
      role = delta.role;
    }
  });

  const finalMessage: ChatCompletionMessage = {
    content: combinedContent || null,
    role: role || "system", // Defaulting to 'system', you can adjust based on your system's design.
  };

  if (combinedFunctionCalls.length > 0) {
    // Assuming you want the latest function call if there are multiple.
    finalMessage.function_call = combinedFunctionCalls[combinedFunctionCalls.length - 1];
  }

  return finalMessage;
}
