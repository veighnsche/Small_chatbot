import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { llamaEventBus } from "../services/llamaEventBus.ts";
import { LlamaChat } from "../types/LlamaChat";
import { LlamaLoadedSystemMessage } from "../types/LlamaLoadedSystemMessage.ts";
import { LlamaMessage } from "../types/LlamaMessage";
import { addIters, getLastMessage_id, makeChildrensMap, traverseToLastMessage_id } from "../utils/messages";
import { generateUnique_id } from "../utils/uid.ts";


export type LlamaChatAction = ReturnType<typeof llamaChatSlice.actions[keyof typeof llamaChatSlice.actions]>

export interface LlamaChatState {
  sse_id?: string;
  currentChat_id?: LlamaChat["id"];
  loadedSystemMessages: LlamaLoadedSystemMessage[];
  messages: LlamaMessage[];
  childrensMap: Record<LlamaMessage["id"], LlamaMessage["id"][]>;
  itersMap: Record<LlamaMessage["id"], number>; // the number represents the idx of the child message
  lastMessage_id: LlamaMessage["id"];
  error?: string;
  isStreaming: boolean;
}

const initialState: LlamaChatState = {
  sse_id: undefined,
  currentChat_id: undefined,
  loadedSystemMessages: [],
  messages: [],
  childrensMap: {},
  itersMap: {},
  lastMessage_id: "-1",
  error: undefined,
  isStreaming: false,
};

const llamaChatSlice = createSlice({
  name: "llamaChat",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ messages: LlamaMessage[] }>) => {
      state.error = undefined;
      state.messages = addIters(action.payload.messages);
      llamaEventBus.emit("terminate-stream");
      state.childrensMap = makeChildrensMap(state.messages);
      state.lastMessage_id = getLastMessage_id(state.messages, state.isStreaming);
    },


    setSse_id: (state, action: PayloadAction<{ sse_id: string }>) => {
      state.sse_id = action.payload.sse_id;
    },

    clearSse_id: (state) => {
      state.sse_id = undefined;
    },

    setCurrentChat_id: (state, action: PayloadAction<{ chat_id: string }>) => {
      state.loadedSystemMessages = [];
      state.messages = [];
      state.itersMap = {};
      state.currentChat_id = action.payload.chat_id;
    },

    setLastMessage_id: (state, action: PayloadAction<{ message_id: string }>) => {
      state.lastMessage_id = action.payload.message_id;
    },

    setIter: (state, action: PayloadAction<{
      parent_id: string,
      iter: number
    }>) => {
      state.itersMap[action.payload.parent_id] = action.payload.iter;
      state.lastMessage_id = traverseToLastMessage_id(state.childrensMap, state.itersMap, action.payload.parent_id); // DEPRECATED: New approach is to place this in the LlamaThreadMemoizer
    },

    loadSystemMessages: (state, action: PayloadAction<{ messages: Omit<LlamaLoadedSystemMessage, "id">[] }>) => {
      state.loadedSystemMessages = [
        ...state.loadedSystemMessages,
        ...action.payload.messages.map(message => ({
          id: `system-${generateUnique_id()}`,
          ...message,
        })),
      ];
    },

    removeSystemMessages: (state, action: PayloadAction<{ ids: string[] }>) => {
      // what is more performant? splice or filter?
      // answer: splice is more performant
      state.loadedSystemMessages = state.loadedSystemMessages.filter((message) => !action.payload.ids.includes(message.id));
    },

    emptyLoadedSystemMessages: (state) => {
      state.loadedSystemMessages = [];
    },

    reset: () => {
      return initialState;
    },

    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("llamaChat/addMessage/pending", (state) => {
        state.isStreaming = true;
      })
      .addCase("llamaChat/addMessage/fulfilled", (state) => {
        state.isStreaming = false;
      })
      .addCase("llamaChat/addMessage/rejected", (state) => {
        state.isStreaming = false;
      })
      .addCase("llamaChat/regenerate/pending", (state) => {
        state.isStreaming = true;
      })
      .addCase("llamaChat/regenerate/fulfilled", (state) => {
        state.isStreaming = false;
      })
      .addCase("llamaChat/regenerate/rejected", (state) => {
        state.isStreaming = false;
      })
      .addCase("llamaChat/editMessage/pending", (state) => {
        state.isStreaming = true;
      })
      .addCase("llamaChat/editMessage/fulfilled", (state) => {
        state.isStreaming = false;
      })
      .addCase("llamaChat/editMessage/rejected", (state) => {
        state.isStreaming = false;
      });
  },
});

export const {
  setMessages,
  setCurrentChat_id,
  setSse_id,
  clearSse_id,
  setLastMessage_id,
  setIter,
  loadSystemMessages,
  removeSystemMessages,
  emptyLoadedSystemMessages,
  reset,
  setError,
} = llamaChatSlice.actions;

export default llamaChatSlice.reducer;