import { LlamaAsserts } from "../decorators/api";
import { LlamaMessage } from "../models/chatMessage";
import { ClientMessagesBody, EditChatTitleBody } from "../types/api/bodies";
import { ChatColLocals, ChatDocLocals, ChatIdLocals, ThreadLocals } from "../types/api/locals";
import { LlamaReq, LlamaRes } from "../types/api/middleware";
import { getLastId } from "../utils/messages";

class ChatMiddleware {
  @LlamaAsserts("chatColRepo")
  static async createChat(_: LlamaReq, res: LlamaRes<ChatColLocals & ChatIdLocals>): Promise<void> {
    const chatId = await res.locals.chatColRepo.newChat("New chat");
    res.write(`data: ${JSON.stringify({ chatId })}\n\n`);
    res.locals.chatId = chatId;
  }

  @LlamaAsserts("clientMessages", "thread", "chatDocRepo")
  static async addMessages(req: LlamaReq<ClientMessagesBody>, res: LlamaRes<ThreadLocals & ChatDocLocals>): Promise<void> {
    const newMessages = await LlamaMessage.fromChatCompletionMessages(
      req.body.clientMessages,
      getLastId(res.locals.thread),
    );

    await res.locals.chatDocRepo.addMessages(newMessages);
    res.locals.thread.push(...newMessages);
  }

  @LlamaAsserts("chatColRepo")
  static async deleteAllChats(_: LlamaReq, res: LlamaRes<ChatColLocals>): Promise<void> {
    await res.locals.chatColRepo.deleteAllChats();
  }

  @LlamaAsserts("chatDocRepo")
  static async deleteChat(_: LlamaReq, res: LlamaRes<ChatDocLocals>): Promise<void> {
    await res.locals.chatDocRepo.deleteChat();
  }

  @LlamaAsserts("title", "chatDocRepo")
  static async editChatTitle(req: LlamaReq<EditChatTitleBody>, res: LlamaRes<ChatDocLocals>): Promise<void> {
    await res.locals.chatDocRepo.editTitle(req.body.title);
  }
}

export default {
  create: ChatMiddleware.createChat,
  title: {
    edit: ChatMiddleware.editChatTitle,
  },
  clientMessages: {
    add: ChatMiddleware.addMessages,
  },
  delete: {
    all: ChatMiddleware.deleteAllChats,
    chat: ChatMiddleware.deleteChat,
  },
};