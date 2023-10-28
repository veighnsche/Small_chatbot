import express, { Response } from "express";
import { ChatCompletionChunk } from "openai/resources/chat";
import { ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { AppChatMessage } from "../models/chatMessage";
import { ChatColRepo } from "../repositories/chatCol";
import { ChatDocRepo } from "../repositories/chatDoc";
import { assertBody, CreateChatBody } from "../services/assertBody";
import { callAssistantStream, callNamingAssistant } from "../services/assistant";
import { AuthRequest } from "../types/auth";
import { IAppChatMessage } from "../types/chat";
import { getLastId } from "../utils/messages";
import { setupSSE } from "../utils/sse";
import { combineDeltasIntoSingleMessage } from "../utils/stream";

const router = express.Router();

router.use((req: AuthRequest, res, next) => {
  if (!req.user?.uid) {
    return res.status(401).send("UID not found.");
  }
  next();
});


router.post(
  "/",
  assertBody.createChat,
  setupSSE,
  async (req: AuthRequest<CreateChatBody>, res) => {
    try {
      const chatColRepo = new ChatColRepo(req.user!.uid);
      const chatId = await chatColRepo.newChat("New chat");
      res.write(`data: ${JSON.stringify({ chatId })}\n\n`);
      await handleChatCompletion(req, res, chatId);
    } catch (err) {
      await handleErrorStream(res, err as Error);
    }
  });

router.post("/:chatId", setupSSE, async (req: AuthRequest<{
  prevMessages: IAppChatMessage[],
  messages: ChatCompletionMessage[]
}>, res) => {
  try {
    await handleChatCompletion(req, res, req.params.chatId);
  } catch (err) {
    await handleErrorStream(res, err as Error);
  }
});

export default router;

async function handleChatCompletion(req: AuthRequest<{
  prevMessages?: IAppChatMessage[],
  messages: ChatCompletionMessage[],
}>, res: Response, chatId: string) {
  const userUid = req.user!.uid;
  const chatDocRepo = new ChatDocRepo(userUid, chatId);
  const prevMessagesRecords = req.body.prevMessages || [];
  const prevMessages = AppChatMessage.fromRecords(prevMessagesRecords);

  const parentId = prevMessages.length > 0 ? getLastId(prevMessages) : "-1";

  const newMessages = await AppChatMessage.fromChatCompletionMessages(req.body.messages, parentId);
  await chatDocRepo.addMessages(newMessages);

  const deltas: ChatCompletionChunk.Choice.Delta[] = [];
  for await (const delta of callAssistantStream([...prevMessages, ...newMessages])) {
    deltas.push(delta);
    res.write(`data: ${JSON.stringify(delta)}\n\n`);
  }

  const combinedAssistantMessage = combineDeltasIntoSingleMessage(deltas);
  const newAssistantMessage = await AppChatMessage.fromChatCompletionMessage(combinedAssistantMessage, getLastId([...prevMessages, ...newMessages]));
  await chatDocRepo.addMessage(newAssistantMessage);

  if (!prevMessagesRecords.length) {
    const newTitle = await callNamingAssistant([...newMessages, newAssistantMessage]);
    await chatDocRepo.editTitle(newTitle);
  }

  res.end();
}

async function handleErrorStream(res: Response, err: Error) {
  console.trace(err);
  res.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);

  res.end();
}