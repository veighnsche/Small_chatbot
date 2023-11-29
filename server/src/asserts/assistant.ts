import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";

export function assertModel(model: ChatCompletionCreateParamsBase["model"]): asserts model is ChatCompletionCreateParamsBase["model"] {
  if (!model) {
    console.trace("Missing model");
    throw new Error("Missing model");
  }
  if (model.length === 0) {
    console.trace("Model is empty");
    throw new Error("Model is empty");
  }
}