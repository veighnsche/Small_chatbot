import { ChatCompletionMessage } from "openai/resources/chat";
import { ILlamaMessage } from "../types/chat";

export function assertChatCompletionMessage(obj: any): asserts obj is ChatCompletionMessage {
  if (!obj) throw new Error("Object is null or undefined");

  const hasValidContent = (typeof obj.content === 'string' || obj.content === null);
  if (!hasValidContent) throw new Error("Object has invalid content");

  const validRoles = ['system', 'user', 'assistant', 'function'];
  const hasValidRole = validRoles.includes(obj.role);
  if (!hasValidRole) throw new Error("Object has invalid role");

  if (obj.function_call) {
    const hasValidFunctionCall = (
      typeof obj.function_call.arguments === 'string' &&
      typeof obj.function_call.name === 'string'
    );
    if (!hasValidFunctionCall) throw new Error("Object has invalid function call");
  }
}

export function assertAppChatMessage(obj: any): asserts obj is ILlamaMessage {
  if (!obj) throw new Error("Object is null or undefined");

  const hasValidId = typeof obj.id === 'string';
  if (!hasValidId) throw new Error("Object has invalid id");

  const hasValidParentId = typeof obj.parent_id === 'string';
  if (!hasValidParentId) throw new Error("Object has invalid parent_id");

  assertChatCompletionMessage(obj);
}
