import { ChatCompletionChunk } from "openai/resources/chat";
import { AppChatMessage } from "../models/chatMessage";
import { callAssistantStream, callChatTitleAssistant } from "../services/assistant";
import { AuthMiddleware } from "../types/auth";
import { getLastId } from "../utils/messages";
import { combineChatDeltasIntoSingleMsg } from "../utils/stream";

const streamAssistantResponse: AuthMiddleware = async (_, res, next) => {
  const messages = res.locals.messages;

  const deltas: ChatCompletionChunk.Choice.Delta[] = [];
  for await (const delta of callAssistantStream(messages)) {
    deltas.push(delta);
    res.write(`data: ${JSON.stringify(delta)}\n\n`);
  }

  const combinedAssistantMessage = combineChatDeltasIntoSingleMsg(deltas);
  const assistantMessage = await AppChatMessage.fromChatCompletionMessage(combinedAssistantMessage, getLastId(messages));

  await res.locals.chatDocRepo.addMessage(assistantMessage);

  res.locals.messages = [...messages, assistantMessage];

  next();
};

const generateTitle: AuthMiddleware = async (req, res, next) => {
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