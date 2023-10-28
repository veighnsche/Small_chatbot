import { ChatCompletionMessage } from "openai/src/resources/chat/completions";
import { assertChatCompletionMessage } from "../asserts/message";
import { AuthMiddleware, AuthRequest } from "../types/auth";

export interface CreateChatBody {
  messages: ChatCompletionMessage[],
}

export const assertBody: Record<string, AuthMiddleware> = {
  createChat: (req: AuthRequest<CreateChatBody>, res, next) => {
    if (!req.body.messages) {
      return res.status(400).send("Missing messages");
    }
    if (!Array.isArray(req.body.messages)) {
      return res.status(400).send("Messages must be an array");
    }
    if (req.body.messages.length === 0) {
      return res.status(400).send("Messages must not be empty");
    }
    for (const message of req.body.messages) {
      try {
        assertChatCompletionMessage(message);
      } catch (err) {
        return res.status(400).send((err as Error).message);
      }
    }
    next();
  },
};
