import { PayloadAction } from "@reduxjs/toolkit";
import { llamaEventBus } from "../../services/llamaEventBus.ts";
import { setMessages } from "../../slices/llamaChatSlice";
import { LlamaMessage } from "../../types/LlamaMessage";
import { getTypeName } from "../../utils/actions";
import { simpleDeepCompare } from "../../utils/objects.ts";
import { LlamaMiddleware } from "../llamaStore";

export const functionCallEmitterMiddleware: LlamaMiddleware = (store) => (next) => (action: PayloadAction<{
  messages: LlamaMessage[]
}>) => {
  if (action.type !== getTypeName(setMessages)) {
    return next(action);
  }

  const currentState = store.getState();
  const currentMessages = currentState.llamaChat.messages;
  if (!currentMessages.length) {
    return next(action);
  }

  const newMessages = action.payload.messages;
  const lastNewMessage = newMessages[newMessages.length - 1];
  if (!lastNewMessage || lastNewMessage.role !== "assistant" || !lastNewMessage.function_call) {
    return next(action);
  }

  const lastCurrentMessage = currentMessages[currentMessages.length - 1];
  if (!simpleDeepCompare(lastNewMessage, lastCurrentMessage)) {
    llamaEventBus.emit("function-call", lastNewMessage.function_call);
  }

  return next(action);
};
