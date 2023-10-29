import { AppChatMessage } from "../models/chatMessage";
import { ChatCollectionRepository } from "../repositories/firebase/chatCol";
import { ChatDocumentRepository } from "../repositories/firebase/chatDoc";
import { AuthMiddleware, AuthRequest, AuthResponse } from "../types/auth";
import { EditChatTitleBody, NewMessagesBody } from "../types/bodies";
import { getLastId } from "../utils/messages";

/**
 * Creates a new chat.
 */
const create: AuthMiddleware = async (req, res: AuthResponse<{
  chatId?: string,
}>, next) => {
  const chatColRepo = new ChatCollectionRepository(req.user!.uid);
  res.locals.chatId = await chatColRepo.newChat("New chat");
  next();
};

/**
 * Adds messages to the chat.
 */
const addMessages: AuthMiddleware = async (req: AuthRequest<NewMessagesBody>, res: AuthResponse<{
  messages?: AppChatMessage[],
  chatDocRepo?: ChatDocumentRepository,
}>, next) => {
  if (!res.locals.messages || !res.locals.chatDocRepo) {
    throw new Error("The messages and chatDocRepo must be initialized before calling the assistant.");
  }

  const prevMessages = res.locals.messages;
  const newMessages = await AppChatMessage.fromChatCompletionMessages(req.body.newMessages, getLastId(prevMessages));
  await res.locals.chatDocRepo.addMessages(newMessages);
  res.locals.messages.push(...newMessages);
  next();
};

/**
 * Deletes all chats.
 */
const deleteAllChats: AuthMiddleware = async (_, res: AuthResponse<{
  chatColRepo?: ChatCollectionRepository,
}>, next) => {
  if (!res.locals.chatColRepo) {
    throw new Error("The chatColRepo must be initialized before deleting all chats.");
  }

  await res.locals.chatColRepo.deleteAllChats();
  next();
};

/**
 * Deletes the chat.
 */
const deleteChat: AuthMiddleware = async (_, res: AuthResponse<{
  chatDocRepo?: ChatDocumentRepository,
}>, next) => {
  if (!res.locals.chatDocRepo) {
    throw new Error("The chatDocRepo must be initialized before deleting a chat.");
  }

  await res.locals.chatDocRepo.deleteChat();
  next();
};

/**
 * Edits the chat's title.
 */
const editTitle: AuthMiddleware = async (req: AuthRequest<EditChatTitleBody>, res: AuthResponse<{
  chatDocRepo?: ChatDocumentRepository,
}>, next) => {
  if (!res.locals.chatDocRepo) {
    throw new Error("The chatDocRepo must be initialized before deleting a chat.");
  }

  await res.locals.chatDocRepo.editTitle(req.body.title);
  next();
};

export default {
  create,
  title: {
    edit: editTitle,
  },
  messages: {
    add: addMessages,
  },
  delete: {
    all: deleteAllChats,
    chat: deleteChat,
  },
};