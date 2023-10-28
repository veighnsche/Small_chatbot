import { AppChatMessage } from "../models/chatMessage";
import { ChatCollectionRepository } from "../repositories/chatCol";
import { AuthMiddleware, AuthRequest } from "../types/auth";
import { NewMessagesBody } from "../types/bodies";
import { getLastId } from "../utils/messages";

const create: AuthMiddleware = async (req, res, next) => {
  const chatColRepo = new ChatCollectionRepository(req.user!.uid);
  res.locals.chatId = await chatColRepo.newChat("New chat");
  next();
};

const addMessages: AuthMiddleware = async (req: AuthRequest<NewMessagesBody>, res, next) => {
  const prevMessages = res.locals.messages;
  const newMessages = await AppChatMessage.fromChatCompletionMessages(req.body.newMessages, getLastId(prevMessages));
  await res.locals.chatDocRepo.addMessages(newMessages);
  res.locals.messages.push(newMessages)
  next();
}

export default {
  create,
  messages: {
    add: addMessages,
  }
};