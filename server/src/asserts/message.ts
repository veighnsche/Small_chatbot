import { ChatCompletionMessage } from "openai/resources/chat";

export function assertChatCompletionMessage(obj: any): asserts obj is ChatCompletionMessage {
  if (!obj) {
    console.trace("Missing object");
    throw new Error("Object is null or undefined");
  }

  const hasValidContent = (typeof obj.content === "string" || obj.content === null);
  if (!hasValidContent) {
    console.trace("Object has invalid content");
    throw new Error("Object has invalid content");
  }

  const validRoles = ["system", "user", "assistant", "function"];
  const hasValidRole = validRoles.includes(obj.role);
  if (!hasValidRole) {
    console.trace("Object has invalid role");
    throw new Error("Object has invalid role");
  }

  if (obj.function_call) {
    const hasValidFunctionCall = (
      typeof obj.function_call.arguments === "string" &&
      typeof obj.function_call.name === "string"
    );
    if (!hasValidFunctionCall) {
      console.trace("Object has invalid function call");
      throw new Error("Object has invalid function call");
    }
  }
}