import type { JSONSchema7 as JSONSchema } from "json-schema";
import type { FromSchema } from "json-schema-to-ts";
import type { ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/chat";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import type { ReactNode } from "react";
import type { IChatWidgetElement } from "./IChatWidgetElement";

export interface LlamaTreeProviderProps {
  children: ReactNode;
  url: string;
  onInitialize?: (llamaTree: IChatWidgetElement) => void;
}

export interface LlamaLoadedSystemMessage {
  title: string;
  content: string;
}

export interface LlamaChatViewSliceState {
  isOpen: boolean;
  isLarge: boolean;
  isHistoryDrawerOpen: boolean;
}

export interface LlamaMessage extends ChatCompletionMessageParam {
  id: string;
  parent_id: string;
}

export interface LlamaChatParams extends Omit<ChatCompletionCreateParamsBase, "messages" | "functions" | "model"> {
  model?: ChatCompletionCreateParamsBase["model"];
  functions?: LlamaFunction[];
}

export interface LlamaFunction {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](https://platform.openai.com/docs/guides/gpt/function-calling) for
   * examples, and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * To describe a function that accepts no parameters, provide the value
   * `{"type": "object", "properties": {}}`.
   */
  parameters: JSONSchema;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description?: string;
}

export interface LlamaFunctionCall<ArgumentsType = Record<string, any>> extends Omit<ChatCompletionMessage.FunctionCall, "arguments"> {
  arguments: ArgumentsType;
}

export interface LlamaActions {
  type: string;
  payload: Record<string, any>;
}

export type LlamaFunctionsToFunctionCall<LlamaFunctionDefinition extends LlamaFunction> = FromSchema<LlamaFunctionDefinition["parameters"]>