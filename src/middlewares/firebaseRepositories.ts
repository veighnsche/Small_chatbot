import { ChatCollectionRepository } from "../repositories/firebase/chatCol";
import { ChatDocumentRepository } from "../repositories/firebase/chatDoc";
import { AuthMiddleware, AuthResponse } from "../types/auth";

/**
 * Initializes res.locals.chatDocRepo to a ChatDocumentRepository instance.
 */
const initializeChatDoc: AuthMiddleware = (req, res: AuthResponse<{
  chatId?: string,
  chatDocRepo?: ChatDocumentRepository,
}>, next) => {
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
const initializeChatCol: AuthMiddleware = (req, res: AuthResponse<{
  chatColRepo?: ChatCollectionRepository,
}>, next) => {
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