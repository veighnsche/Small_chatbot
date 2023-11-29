import { LlamaMessage } from "../../models/chatMessage";
import { ChatCollectionRepository } from "../../repositories/firebase/chatCol";
import { ChatDocumentRepository } from "../../repositories/firebase/chatDoc";

export interface ThreadLocals {
  thread: LlamaMessage[],
}

export interface ChatDocLocals {
  chatDocRepo: ChatDocumentRepository;
}

export interface ChatColLocals {
  chatColRepo: ChatCollectionRepository,
}

export interface Chat_idLocals {
  chat_id: string,
}

export interface SseLocals {
  sse: {
    id: string,
    initialized: boolean,
    finalized: boolean,
  };
}