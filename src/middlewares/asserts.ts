import { assertArray } from "../asserts/array";
import { assertAppChatMessage, assertChatCompletionMessage } from "../asserts/message";
import { AuthMiddleware, AuthRequest } from "../types/auth";
import { NewMessagesBody, MessagesBody } from "../types/bodies";

const userUid: AuthMiddleware = (req, res, next) => {
  if (!req.user?.uid) {
    return res.status(400).send("req.user.uid: Required.");
  }
  next();
};

const newMessages: AuthMiddleware = (req: AuthRequest<NewMessagesBody>, res, next) => {
  try {
    assertArray(req.body.newMessages);
  } catch (err) {
    return res.status(400).send(`req.body.messages: ${(err as Error).message}`);
  }

  for (const message of req.body.newMessages) {
    try {
      assertChatCompletionMessage(message);
    } catch (err) {
      return res.status(400).send(`req.body.messages: ${(err as Error).message}`);
    }
  }
  next();
};

const messages: AuthMiddleware = (req: AuthRequest<MessagesBody>, res, next) => {
  try {
    assertArray(req.body.messages);
  } catch (err) {
    return res.status(400).send(`req.body.prevMessages: ${(err as Error).message}`);
  }

  for (const message of req.body.messages) {
    try {
      assertAppChatMessage(message);
    } catch (err) {
      return res.status(400).send(`req.body.prevMessages: ${(err as Error).message}`);
    }
  }
  next();
};

const chatId: AuthMiddleware = (req, res, next) => {
  if (!req.params.chatId) {
    return res.status(400).send("req.params.chatId: Required.");
  }
  next();
};

export default {
  body: {
    newMessages,
    messages,
  },
  params: {
    chatId,
  },
  auth: {
    userUid,
  },
};