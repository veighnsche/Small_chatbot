import * as admin from "firebase-admin";
import { getDatabase } from "../../services/firebase";
import { LlamaChat } from "../../types/chat";

export class ChatCollectionRepository {
  private db: admin.firestore.Firestore;
  private chatCol: admin.firestore.CollectionReference;

  constructor(userId: string) {
    this.db = getDatabase();

    this.chatCol = this.db
      .collection("assistantChat")
      .doc(userId)
      .collection("chats");
  }

  async newChat(title: string): Promise<string> {
    const conversation: LlamaChat = {
      title,
      updated: new Date(),
    };

    try {
      const chatRef = await this.chatCol.add(conversation);
      return chatRef.id;
    } catch (error) {
      throw new Error(`Error creating chat: ${error}`);
    }
  }

  async deleteAllChats(): Promise<void> {
    const snapshot = await this.chatCol.get();
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}