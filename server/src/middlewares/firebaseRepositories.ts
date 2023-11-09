import { ChatCollectionRepository } from "../repositories/firebase/chatCol";
import { ChatDocumentRepository } from "../repositories/firebase/chatDoc";
import { AuthMiddleware, ResLocals } from "../types/auth";
import { ChatColLocals, ChatDocLocals, ChatIdLocals } from "../types/locals";

/**
 * Initializes res.locals.chatDocRepo to a ChatDocumentRepository instance.
 */
const initializeChatDoc: AuthMiddleware = (req, res: ResLocals<ChatIdLocals & ChatDocLocals>, next) => {
  const userUid = req.user!.uid;
  const chatId = res.locals.chatId || req.params.chatId;

  if (!chatId) {
    next(new Error("Chat ID has not been found to initialize chat doc"));
  }

  res.locals.chatDocRepo = new ChatDocumentRepository(userUid, chatId);
  next();
};

/**
 * Initializes res.locals.chatColRepo to a ChatCollectionRepository instance.
 */
const initializeChatCol: AuthMiddleware = (req, res: ResLocals<ChatColLocals>, next) => {
  const userUid = req.user!.uid;
  res.locals.chatColRepo = new ChatCollectionRepository(userUid);
  next();
}

export default {
  chatDoc: {
    initialize: initializeChatDoc,
  },
  chatCol: {
    initialize: initializeChatCol,
  }
}