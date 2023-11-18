import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LlamaChat } from "../types/LlamaChat";
import { LlamaLoadedSystemMessage } from "../types/LlamaLoadedSystemMessage.ts";
import { LlamaMessage } from "../types/LlamaMessage";
import { addIters, makeChildrensMap, traverseToLastMessageId } from "../utils/messages";

export type LlamaChatAction = ReturnType<typeof llamaChatSlice.actions[keyof typeof llamaChatSlice.actions]>

export interface LlamaChatState {
  sseId?: string;
  currentChatId?: LlamaChat["id"];
  loadedSystemMessages: LlamaLoadedSystemMessage[];
  messages: LlamaMessage[];
  childrensMap: Record<LlamaMessage["id"], LlamaMessage["id"][]>;
  itersMap: Record<LlamaMessage["id"], number>; // the number represents the idx of the child message
  lastMessageId: LlamaMessage["id"];
  assistantStream: LlamaMessage | undefined;
  error?: string;
}

const initialState: LlamaChatState = {
  sseId: undefined,
  currentChatId: undefined,
  loadedSystemMessages: [],
  messages: [],
  childrensMap: {},
  itersMap: {},
  lastMessageId: "-1",
  assistantStream: undefined,
  error: undefined,
};

const llamaChatSlice = createSlice({
  name: "llamaChat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ messages: LlamaMessage[] }>) => {
      state.error = undefined;
      state.assistantStream = undefined;
      state.messages = addIters(action.payload.messages);
      state.childrensMap = makeChildrensMap(state.messages);

      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage) {
        state.lastMessageId = lastMessage.id;
      }
    },

    setSseId: (state, action: PayloadAction<{ sseId?: string }>) => {
      state.sseId = action.payload.sseId;
    },

    setCurrentChatId: (state, action: PayloadAction<{ chatId: string }>) => {
      state.messages = [];
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

    loadSystemMessage: (state, action: PayloadAction<{ message: Omit<LlamaLoadedSystemMessage, "id"> }>) => {
      state.loadedSystemMessages.push({
        id: `system-${Date.now().toString() + "." + Math.random().toString().slice(2)}`,
        ...action.payload.message,
      });
    },

    removeSystemMessage: (state, action: PayloadAction<{ id: string }>) => {
      // what is more performant? splice or filter?
      // answer: splice is more performant
      const index = state.loadedSystemMessages.findIndex((message) => message.id === action.payload.id);
      if (index !== -1) {
        state.loadedSystemMessages.splice(index, 1);
      }
    },

    emptyLoadedSystemMessages: (state) => {
      state.loadedSystemMessages = [];
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

    startAssistantStreamFunctionCall: (state, action: PayloadAction<{ name: string }>) => {
      if (state.assistantStream) {
        state.assistantStream.function_call = {
          name: action.payload.name,
          arguments: "",
        };
      }
    },

    appendAssistantStreamContent: (state, action: PayloadAction<{ content: string }>) => {
      if (state.assistantStream) {
        state.assistantStream.content += action.payload.content;
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

    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.assistantStream = undefined;
      state.error = action.payload.error;
    }
  },
});

export const {
  setMessages,
  setCurrentChatId,
  setSseId,
  setLastMessageId,
  setIter,
  loadSystemMessage,
  removeSystemMessage,
  emptyLoadedSystemMessages,
  startAssistantStream,
  appendAssistantStreamContent,
  startAssistantStreamFunctionCall,
  appendAssistantStreamFunctionCallArguments,
  reset,
  setError,
} = llamaChatSlice.actions;

export default llamaChatSlice.reducer;