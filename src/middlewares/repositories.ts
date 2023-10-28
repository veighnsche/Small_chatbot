import { ChatDocumentRepository } from "../repositories/chatDoc";
import { AuthMiddleware } from "../types/auth";

const initializeChatDoc: AuthMiddleware = (req, res, next) => {
  const userUid = req.user!.uid;
  const chatId = res.locals.chatId || req.params.chatId;

  if (!chatId) {
    next(new Error("Chat ID has not been found to initialize chat doc"));
  }

  res.locals.chatDocRepo = new ChatDocumentRepository(userUid, chatId);
  next();
};

export default {
  chatDoc: {
    initialize: initializeChatDoc,
  }
}