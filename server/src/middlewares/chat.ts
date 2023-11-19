import { LlamaMessage } from "../models/chatMessage";
import { ChatCollectionRepository } from "../repositories/firebase/chatCol";
import { AuthMiddleware, ReqBody, ResLocals } from "../types/auth";
import { EditChatTitleBody, NewMessagesBody } from "../types/bodies";
import { ChatColLocals, ChatDocLocals, ChatIdLocals, ThreadLocals } from "../types/locals";
import { getLastId } from "../utils/messages";

/**
 * Creates a new chat.
 */
const create: AuthMiddleware = async (req, res: ResLocals<ChatIdLocals>, next) => {
  const chatColRepo = new ChatCollectionRepository(req.user!.uid);
  const chatId = await chatColRepo.newChat("New chat");
  res.write(`data: ${JSON.stringify({ chatId })}\n\n`);
  res.locals.chatId = chatId;
  next();
};

/**
 * Adds messages to the chat.
 */
const addMessages: AuthMiddleware = async (req: ReqBody<NewMessagesBody>, res: ResLocals<ThreadLocals & ChatDocLocals>, next) => {
  if (!res.locals.thread || !res.locals.chatDocRepo) {
    next(new Error("The messages and chatDocRepo must be initialized before calling the assistant."));
  }

  const prevMessages = res.locals.thread;
  const newMessages = await LlamaMessage.fromChatCompletionMessages(req.body.newMessages, getLastId(prevMessages));
  try {
    await res.locals.chatDocRepo.addMessages(newMessages);
    res.locals.thread.push(...newMessages);
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes all chats.
 */
const deleteAllChats: AuthMiddleware = async (_, res: ResLocals<ChatColLocals>, next) => {
  if (!res.locals.chatColRepo) {
    next(new Error("The chatColRepo must be initialized before deleting all chats."));
  }

  await res.locals.chatColRepo.deleteAllChats();
  next();
};

/**
 * Deletes the chat.
 */
const deleteChat: AuthMiddleware = async (_, res: ResLocals<ChatDocLocals>, next) => {
  if (!res.locals.chatDocRepo) {
    next(new Error("The chatDocRepo must be initialized before deleting a chat."));
  }

  await res.locals.chatDocRepo.deleteChat();
  next();
};

/**
 * Edits the chat's title.
 */
const editTitle: AuthMiddleware = async (req: ReqBody<EditChatTitleBody>, res: ResLocals<ChatDocLocals>, next) => {
  if (!res.locals.chatDocRepo) {
    next(new Error("The chatDocRepo must be initialized before deleting a chat."));
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