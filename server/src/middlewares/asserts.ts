import { assertArray } from "../asserts/array";
import { assertModel } from "../asserts/assistant";
import { assertAppChatMessage, assertChatCompletionMessage } from "../asserts/message";
import { AuthMiddleware, ReqBody } from "../types/auth";
import { NewMessagesBody, ThreadBody, AssistantParamsBody } from "../types/bodies";

/**
 * Asserts that req.user.uid is a string.
 */
const userUid: AuthMiddleware = (req, res, next) => {
  if (!req.user?.uid) {
    return res.status(400).send("req.user.uid: Required.");
  }
  next();
};

/**
 * Asserts that req.body.newMessages is an array of ChatCompletionMessages.
 */
const newMessages: AuthMiddleware = (req: ReqBody<NewMessagesBody>, res, next) => {
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

/**
 * Asserts that req.body.messages is an array of AppChatMessages.
 */
const thread: AuthMiddleware = (req: ReqBody<ThreadBody>, res, next) => {
  try {
    assertArray(req.body.thread);
  } catch (err) {
    return res.status(400).send(`req.body.prevMessages: ${(err as Error).message}`);
  }

  for (const message of req.body.thread) {
    try {
      assertAppChatMessage(message);
    } catch (err) {
      return res.status(400).send(`req.body.prevMessages: ${(err as Error).message}`);
    }
  }
  next();
};

/**
 * Asserts that req.body.editChatTitle is a string.
 */
const assistantParams: AuthMiddleware = (req: ReqBody<AssistantParamsBody>, res, next) => {
  try {
    assertModel(req.body.assistantParams.model);
  } catch (err) {
    return res.status(400).send(`req.body.assistantParams.model: ${(err as Error).message}`);
  }
  next();
}

/**
 * Asserts that req.body.editChatTitle is a string.
 */
const editChatTitle: AuthMiddleware = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).send("req.body.title: Required.");
  }
  next();
}

/**
 * Asserts that req.params.chatId is a string.
 */
const chatId: AuthMiddleware = (req, res, next) => {
  if (!req.params.chatId) {
    return res.status(400).send("req.params.chatId: Required.");
  }
  next();
};

/**
 * Asserts that req.params.sseId is a string.
 */
const sseId: AuthMiddleware = (req, res, next) => {
  if (!req.params.sseId) {
    return res.status(400).send("req.params.sseId: Required.");
  }
  next();
};

export default {
  body: {
    newMessages,
    thread,
    assistantParams,
    editChatTitle,
  },
  params: {
    chatId,
    sseId,
  },
  auth: {
    userUid,
  },
};