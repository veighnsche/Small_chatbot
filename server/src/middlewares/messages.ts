import { LlamaMessage } from "../models/chatMessage";
import { AuthMiddleware, ReqBody, ResLocals } from "../types/auth";
import { ThreadBody } from "../types/bodies";
import { ThreadLocals } from "../types/locals";

/**
 * Initializes res.locals.messages to req.body.messages or an empty array.
 */
const initializeMessages: AuthMiddleware = (
  req: ReqBody<Partial<ThreadBody>>,
  res: ResLocals<ThreadLocals>,
  next,
) => {
  const messages = req.body.thread || [];
  res.locals.thread = LlamaMessage.fromRecords(messages);
  next();
};

export default {
  initialize: initializeMessages,
}