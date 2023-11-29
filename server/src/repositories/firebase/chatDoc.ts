import * as admin from "firebase-admin";
import { LlamaMessage } from "../../models/chatMessage";
import { getDatabase } from "../../services/firebase";

export class ChatDocumentRepository {
  private db: admin.firestore.Firestore;
  private chatDoc: admin.firestore.DocumentReference;
  private messagesCol: admin.firestore.CollectionReference;

  constructor(user_id: string, conversation_id: string) {
    this.db = getDatabase();

    this.chatDoc = this.db
      .collection("assistantChat")
      .doc(user_id)
      .collection("chats")
      .doc(conversation_id);

    this.messagesCol = this.chatDoc.collection("messages");
  }

  async addMessage(message: LlamaMessage): Promise<void> {
    try {
      await this.messagesCol.doc(message.id).set(message.toRecord());
      await this.chatDoc.update({ updated: new Date() });
    } catch (error) {
      console.trace("Error adding message", { message, error });
      throw new Error(`Error adding message: ${error}`);
    }
  }

  async addMessages(messages: LlamaMessage[]): Promise<void> {
    const batch = this.db.batch();

    messages.forEach((message) => {
      batch.set(this.messagesCol.doc(message.id), message.toRecord());
    });

    await batch.commit();
    await this.chatDoc.update({ updated: new Date() });
  }

  async deleteChat(): Promise<void> {
    await this.chatDoc.delete();
  }

  async editTitle(title: string): Promise<void> {
    await this.chatDoc.update({ title });
  }
}
