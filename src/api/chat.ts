import express from "express";
import { mw } from "../middlewares";

const router = express.Router();

router.use(mw.asserts.auth.userUid);

router.post(
  "/",
  mw.asserts.body.newMessages,
  mw.initialize.messages,
  mw.initialize.sse,
  mw.try(mw.chat.create),
  mw.initialize.chatDocRepo,
  mw.try(mw.chat.messages.add),
  mw.try(mw.assistant.default.stream),
  mw.try(mw.assistant.forTitle.call),
  mw.finalize.sse,
);

router.post(
  "/:chatId",
  mw.asserts.params.chatId,
  mw.asserts.body.messages,
  mw.asserts.body.newMessages,
  mw.initialize.messages,
  mw.initialize.sse,
  mw.initialize.chatDocRepo,
  mw.try(mw.chat.messages.add),
  mw.try(mw.assistant.default.stream),
  mw.finalize.sse,
);

export default router;

