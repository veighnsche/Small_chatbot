import { ChatCompletionChunk } from "openai/resources/chat";
import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";
import { LlamaMessage } from "../models/chatMessage";
import { callAssistantStream, callChatTitleAssistant } from "../services/assistant";
import { AuthMiddleware, ReqBody, ResLocals } from "../types/auth";
import { AssistantParamsBody } from "../types/bodies";
import { ChatDocLocals, SseLocals, ThreadLocals } from "../types/locals";
import { withDefaultParameters } from "../utils/assistant";
import { getLastId } from "../utils/messages";
import { combineChatDeltasIntoSingleMsg, createEventData } from "../utils/stream";

/**
 * Streams the assistant's response to the client.
 */
const streamAssistantResponse: AuthMiddleware = async (req: ReqBody<AssistantParamsBody>, res: ResLocals<ThreadLocals & ChatDocLocals & SseLocals>, next) => {
  if (!res.locals.thread || !res.locals.chatDocRepo || !res.locals.sse) {
    console.log(res.locals);
    throw new Error("The messages, chatDocRepo and sse id must be initialized before calling the assistant.");
  }

  const messages = res.locals.thread;
  const functions = req.body.assistantParams.functions;

  const assistantParams: ChatCompletionCreateParamsBase = {
    ...req.body.assistantParams,
    messages: LlamaMessage.toChatCompletionMessagesParam(messages),
    functions: functions ? withDefaultParameters(functions) : undefined,
  };

  res.write(`event: START\ndata: ${createEventData("assistant: start", { status: "start", name: "assistant" })}\n\n`);

  const deltas: ChatCompletionChunk.Choice.Delta[] = [];
  try {
    for await (const { delta, finish_reason } of callAssistantStream(assistantParams, res.locals.sse.id)) {
      if (!finish_reason) {
        deltas.push(delta);
        res.write(`data: ${JSON.stringify(delta)}\n\n`);
      } else {
        res.write(`event: STOP\ndata: ${createEventData("assistant: stop", {
          name: "assistant",
          status: "finish",
          finish_reason,
        })}\n\n`);
      }
    }
  } catch (err) {
    next(err);
    res.write(`event: ERROR\ndata: ${createEventData("assistant: error", {
      name: "assistant",
      status: "finish",
      finish_reason: "error",
    })}\n\n`);
    return;
  }

  const combinedAssistantMessage = combineChatDeltasIntoSingleMsg(deltas);
  const assistantMessage = await LlamaMessage.fromChatCompletionMessage(combinedAssistantMessage, getLastId(messages));

  await res.locals.chatDocRepo.addMessage(assistantMessage);
  res.locals.thread.push(assistantMessage);

  next();
};

/**
 * Generates a new title for the chat.
 */
const generateTitle: AuthMiddleware = async (_, res: ResLocals<ThreadLocals & ChatDocLocals>, next) => {
  if (!res.locals.thread || !res.locals.chatDocRepo) {
    throw new Error("The messages and chatDocRepo must be initialized before calling the assistant.");
  }

  const messages = res.locals.thread;

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