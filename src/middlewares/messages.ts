import { AuthMiddleware, AuthRequest } from "../types/auth";
import { MessagesBody } from "../types/bodies";

const initializeMessages: AuthMiddleware = (req: AuthRequest<Partial<MessagesBody>>, res, next) => {
  res.locals.messages = req.body.messages || [];
  next();
};

export default {
  initialize: initializeMessages,
}