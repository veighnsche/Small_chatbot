import { AppChatMessage } from "../models/chatMessage";
import { AuthMiddleware, AuthRequest, AuthResponse } from "../types/auth";
import { MessagesBody } from "../types/bodies";

/**
 * Initializes res.locals.messages to req.body.messages or an empty array.
 */
const initializeMessages: AuthMiddleware = (req: AuthRequest<Partial<MessagesBody>>, res: AuthResponse<{
  messages?: AppChatMessage[],
}>, next) => {
  const messages = req.body.messages || [];
  res.locals.messages = AppChatMessage.fromRecords(messages);
  next();
};

export default {
  initialize: initializeMessages,
}