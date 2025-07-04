import mw from "../middlewares";
import { llamaRouter } from "../services/router";

const router = llamaRouter();

router.use(mw.auth.firebase.protect);

router.get(
  "/config",
  mw.config.sendEncodedConfig,
);

router.postSse(
  "/",
  mw.chat.create,
  mw.chat.clientMessages.add,
  mw.assistant.default.stream,
  mw.assistant.forTitle.call,
);

router.postSse(
  "/:chat_id",
  mw.chat.clientMessages.add,
  mw.assistant.default.stream,
);

router.postSse(
  "/:chat_id/regenerate",
  mw.assistant.default.stream,
);

router.post(
  "/:chat_id/title",
  mw.chat.title.edit,
  mw[204],
);

router.delete(
  "/",
  mw.chat.delete.all,
  mw[204],
);

router.delete(
  "/stop/:sse_id",
  mw.sse.stop,
  mw[204],
);

router.delete(
  "/:chat_id",
  mw.chat.delete.chat,
  mw[204],
);

export default router;

