import { ChatCompletionChunk } from "openai/resources/chat";
import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";
import { AppChatMessage } from "../models/chatMessage";
import type { ChatDocumentRepository } from "../repositories/firebase/chatDoc";
import { callAssistantStream, callChatTitleAssistant } from "../services/assistant";
import { AuthMiddleware, AuthRequest, AuthResponse } from "../types/auth";
import { AssistantParamsBody } from "../types/bodies";
import { withDefaultParameters } from "../utils/assistant";
import { getLastId } from "../utils/messages";
import { combineChatDeltasIntoSingleMsg } from "../utils/stream";

/**
 * Streams the assistant's response to the client.
 */
const streamAssistantResponse: AuthMiddleware = async (req: AuthRequest<AssistantParamsBody>, res: AuthResponse<{
  messages?: AppChatMessage[],
  chatDocRepo?: ChatDocumentRepository
}>, next) => {
  if (!res.locals.messages || !res.locals.chatDocRepo) {
    throw new Error("The messages and chatDocRepo must be initialized before calling the assistant.");
  }

  const messages = res.locals.messages;
  const functions = req.body.assistantParams.functions;

  const assistantParams: ChatCompletionCreateParamsBase = {
    ...req.body.assistantParams,
    messages: AppChatMessage.toChatCompletionMessagesParam(messages),
    functions: functions ? withDefaultParameters(functions) : undefined,
  };

  res.write(`event: start\ndata: ${JSON.stringify({ name: "assistant" })}\n\n`);

  const deltas: ChatCompletionChunk.Choice.Delta[] = [];
  try {
    for await (const { delta, finish_reason } of callAssistantStream(assistantParams)) {
      if (!finish_reason) {
        deltas.push(delta);
        res.write(`data: ${JSON.stringify(delta)}\n\n`);
      } else {
        res.write(`event: finish\ndata: ${JSON.stringify({ name: "assistant", finish_reason })}\n\n`);
      }
    }
  } catch (err) {
    next(err);
    return;
  }

  const combinedAssistantMessage = combineChatDeltasIntoSingleMsg(deltas);
  const assistantMessage = await AppChatMessage.fromChatCompletionMessage(combinedAssistantMessage, getLastId(messages));

  await res.locals.chatDocRepo.addMessage(assistantMessage);
  res.locals.messages.push(assistantMessage);

  next();
};

/**
 * Generates a new title for the chat.
 */
const generateTitle: AuthMiddleware = async (_, res: AuthResponse<{
  messages?: AppChatMessage[],
  chatDocRepo?: ChatDocumentRepository
}>, next) => {
  if (!res.locals.messages || !res.locals.chatDocRepo) {
    throw new Error("The messages and chatDocRepo must be initialized before calling the assistant.");
  }

  const messages = res.locals.messages;

  const newTitle = await callChatTitleAssistant(messages);
  await res.locals.chatDocRepo.editTitle(newTitle);

  next();
};

export default {
  default: {
    stream: streamAssistantResponse,
  },
  forTitle: {
    call: generateTitle,
  },
};