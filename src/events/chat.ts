import express from "express";
import { ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { addMessage, newChat } from "../repositories/chat";
import { callAssistant, callNamingAssistant } from "../services/assistant";
import { AuthRequest } from "../types/auth";
import { ChatMessage } from "../types/chat";
import { jsonToYaml } from "../utils/json";

const router = express.Router();

router.post("/", async (req: AuthRequest<{
  chatId?: string,
  message: string,
  messages: ChatMessage[],
  systemContent?: string
}>, res) => {
  const userUid = req.user?.uid;

  if (!userUid) {
    return res.status(400).send("UID not found.");
  }

  const { chatId, message: content, messages, systemContent: systemContentJson } = req.body;

  const systemContent = systemContentJson ? jsonToYaml(systemContentJson) : undefined;
  const systemDataMessage: ChatMessage | undefined = systemContent ? {
    role: "system",
    content: systemContent,
  } : undefined;

  const combinedMessages = [...messages, ...(systemDataMessage ? [systemDataMessage] : [])];

  try {
    if (!chatId) {
      const { chatId: newChatId, chatMessage } = await newChat({ userUid, content }, systemContent);
      res.status(200).json({ chatId: newChatId });
      const assistantMessage: ChatCompletionMessage = await callAssistant(userUid, newChatId, [...messages, chatMessage]);
      await callNamingAssistant(userUid, newChatId, content, assistantMessage);
    } else {
      const chatMessage = await addMessage({ userUid, chatId, content });
      res.status(204).send();
      await callAssistant(userUid, chatId, [...combinedMessages, chatMessage]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

export default router;
