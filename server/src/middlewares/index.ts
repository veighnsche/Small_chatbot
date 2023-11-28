import { LlamaMiddleware } from "../types/api/middleware";
import assistant from "./assistant";
import chat from "./chat";
import firebaseAuth from "./firebaseAuth";
import log from "./logging";
import sse from "./sse";
import config from "./config";

export default {
  auth: {
    firebase: firebaseAuth,
  },
  log,
  sse,
  chat,
  assistant,
  config,
  200: (data: any) => <LlamaMiddleware>((_, res) => res.status(200).send(data)),
  204: <LlamaMiddleware>((_, res) => res.status(204).send()),
};