import express from "express";
import mw from "../middlewares";

const router = express.Router();

router.use(mw.auth.firebase.protect);
router.use(mw.asserts.auth.userUid);

router.get(
  "/config",
  mw.config.sendEncodedConfig,
);

router.post(
  "/",
  mw.asserts.body.newMessages,
  mw.asserts.body.assistantParams,
  mw.sse.initialize,
  mw.messages.initialize,
  mw.try(mw.chat.create),
  mw.repositories.firestore.chatDoc.initialize,
  mw.try(mw.chat.messages.add),
  mw.try(mw.assistant.default.stream),
  mw.try(mw.assistant.forTitle.call),
  mw.sse.finalize,
);

router.post(
  "/:chatId",
  mw.asserts.params.chatId,
  mw.asserts.body.thread,
  mw.asserts.body.newMessages,
  mw.asserts.body.assistantParams,
  mw.sse.initialize,
  mw.messages.initialize,
  mw.repositories.firestore.chatDoc.initialize,
  mw.try(mw.chat.messages.add),
  mw.try(mw.assistant.default.stream),
  mw.sse.finalize,
);

router.post(
  "/:chatId/regenerate",
  mw.asserts.params.chatId,
  mw.asserts.body.thread,
  mw.asserts.body.assistantParams,
  mw.sse.initialize,
  mw.messages.initialize,
  mw.repositories.firestore.chatDoc.initialize,
  mw.try(mw.assistant.default.stream),
  mw.sse.finalize,
);

router.post(
  "/:chatId/title",
  mw.asserts.params.chatId,
  mw.asserts.body.editChatTitle,
  mw.repositories.firestore.chatDoc.initialize,
  mw.try(mw.chat.title.edit),
  mw[204],
);

router.delete(
  "/",
  mw.repositories.firestore.chatCol.initialize,
  mw.try(mw.chat.delete.all),
  mw[204],
);

router.delete(
  "/stop/:sseId",
  mw.asserts.params.sseId,
  mw.sse.stop,
  mw[204],
)

router.delete(
  "/:chatId",
  mw.auth.firebase.protect,
  mw.asserts.params.chatId,
  mw.repositories.firestore.chatDoc.initialize,
  mw.try(mw.chat.delete.chat),
  mw[204],
);

export default router;

