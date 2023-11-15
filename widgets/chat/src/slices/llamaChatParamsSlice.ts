import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { JSONSchema7 as JSONSchema } from "json-schema";

export type LlamaChatParams = Omit<ChatCompletionCreateParamsNonStreaming, "messages" | "n" | "functions"> & {
  functions?: {
    name: string;
    description?: string;
    parameters: JSONSchema;
  }[];
};

export type LlamaChatParamsAction = ReturnType<typeof llamaChatParamsSlice.actions[keyof typeof llamaChatParamsSlice.actions]>

const initialState: LlamaChatParams = {
  model: "gpt-3.5-turbo-0613",
};

const llamaChatParamsSlice = createSlice({
  name: "llamaChatParams",
  initialState,
  reducers: {
    editLlamaChatParams: (state, action: PayloadAction<Partial<LlamaChatParams>>) => {
      Object.assign(state, action.payload);
      return state;
    },
  },
});

export const { editLlamaChatParams } = llamaChatParamsSlice.actions;

export default llamaChatParamsSlice.reducer;