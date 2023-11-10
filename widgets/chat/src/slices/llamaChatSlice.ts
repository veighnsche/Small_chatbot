import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LlamaChat } from "../types/LlamaChat";
import { LlamaMessage } from "../types/LlamaMessage";
import { addIters, makeChildrensMap, traverseToLastMessageId } from "../utils/messages";

export type LlamaChatAction = ReturnType<typeof llamaChatSlice.actions[keyof typeof llamaChatSlice.actions]>

export interface LlamaChatState {
  currentChatId?: LlamaChat["id"];
  messages: LlamaMessage[];
  childrensMap: Record<LlamaMessage["id"], LlamaMessage["id"][]>; // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
  itersMap: Record<LlamaMessage["id"], number>; // the number represents the idx of the child message
  lastMessageId: LlamaMessage["id"]; // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
  assistantStream: LlamaMessage | undefined;
}

const initialState: LlamaChatState = {
  currentChatId: undefined,
  messages: [],
  childrensMap: {}, // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
  itersMap: {},
  lastMessageId: "-1", // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
  assistantStream: undefined,
};


const llamaChatSlice = createSlice({
  name: "llamaChat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ messages: LlamaMessage[] }>) => {
      state.assistantStream = undefined;
      state.messages = addIters(action.payload.messages);
      state.childrensMap = makeChildrensMap(state.messages);
      if (state.messages.length > 0) {
        state.lastMessageId = state.messages[state.messages.length - 1].id;
      }
    },

    setCurrentChatId: (state, action: PayloadAction<{ chatId: string }>) => {
      state.itersMap = {};
      state.currentChatId = action.payload.chatId;
    },

    setLastMessageId: (state, action: PayloadAction<{ messageId: string }>) => {
      state.lastMessageId = action.payload.messageId;
    },

    setIter: (state, action: PayloadAction<{
      parent_id: string,
      iter: number
    }>) => {
      state.itersMap[action.payload.parent_id] = action.payload.iter;
      state.lastMessageId = traverseToLastMessageId(state.childrensMap, state.itersMap, action.payload.parent_id); // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
    },

    startAssistantStream: (state, action: PayloadAction<{ role: LlamaMessage["role"] }>) => {
      state.assistantStream = {
        id: "stream",
        parent_id: "-1",
        role: action.payload.role,
        content: "",
        iter: {
          current: 1,
          total: 1,
        },
      };
    },

    appendAssistantStreamContent: (state, action: PayloadAction<{ content: string }>) => {
      if (state.assistantStream) {
        state.assistantStream.content += action.payload.content;
      }
    },

    startAssistantStreamFunctionCall: (state, action: PayloadAction<{ name: string }>) => {
      if (state.assistantStream) {
        state.assistantStream.function_call = {
          name: action.payload.name,
          arguments: "",
        };
      }
    },

    appendAssistantStreamFunctionCallArguments: (state, action: PayloadAction<{ arguments: string }>) => {
      if (state.assistantStream && state.assistantStream.function_call) {
        state.assistantStream.function_call.arguments += action.payload.arguments;
      }
    },

    reset: () => {
      return initialState;
    },
  },
});

export const {
  setMessages,
  setCurrentChatId,
  setLastMessageId,
  setIter,
  reset,
  startAssistantStream,
  appendAssistantStreamContent,
  startAssistantStreamFunctionCall,
  appendAssistantStreamFunctionCallArguments,
} = llamaChatSlice.actions;

export default llamaChatSlice.reducer;