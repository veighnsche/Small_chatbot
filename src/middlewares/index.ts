import { AuthMiddleware } from "../types/auth";
import asserts from "./asserts";
import assistant from "./assistant";
import chat from "./chat";
import error from "./error";
import messages from "./messages";
import repositories from "./repositories";
import sse from "./sse";



export const mw = {
  asserts,
  try: error,
  messages,
  repositories,
  sse,
  chat,
  assistant,
  204: ((_, res) => {
    return res.status(204).send();
  }) as AuthMiddleware,
};