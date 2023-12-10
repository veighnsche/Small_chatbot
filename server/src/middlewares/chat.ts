import { LlamaGuard } from "../decorators/LlamaGuard";
import { LlamaMessage } from "../models/chatMessage";
import { ClientMessagesBody, EditChatTitleBody } from "../types/api/bodies";
import { Chat_idLocals, ChatColLocals, ChatDocLocals, ThreadLocals } from "../types/api/locals";
import { LlamaReq, LlamaRes } from "../types/api/middleware";
import { getLast_id } from "../utils/messages";

class ChatMiddleware {
  @LlamaGuard("chatColRepo")
  static async createChat(_: LlamaReq, res: LlamaRes<ChatColLocals & Chat_idLocals>): Promise<void> {
    const chat_id = await res.locals.chatColRepo.newChat("New chat");
    res.write(`data: ${JSON.stringify({ chat_id })}\n\n`);
    res.locals.chat_id = chat_id;
  }

  @LlamaGuard("clientMessages", "thread", "chatDocRepo")
  static async addMessages(req: LlamaReq<ClientMessagesBody>, res: LlamaRes<ThreadLocals & ChatDocLocals>): Promise<void> {
    const newMessages = await LlamaMessage.fromChatCompletionMessages(
      req.body.clientMessages,
      getLast_id(res.locals.thread),
    );

    await res.locals.chatDocRepo.addMessages(newMessages);
    res.locals.thread.push(...newMessages);
  }

  @LlamaGuard("chatColRepo")
  static async deleteAllChats(_: LlamaReq, res: LlamaRes<ChatColLocals>): Promise<void> {
    await res.locals.chatColRepo.deleteAllChats();
  }

  @LlamaGuard("chatDocRepo")
  static async deleteChat(_: LlamaReq, res: LlamaRes<ChatDocLocals>): Promise<void> {
    await res.locals.chatDocRepo.deleteChat();
  }

  @LlamaGuard("title", "chatDocRepo")
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