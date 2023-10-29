import * as admin from "firebase-admin";
import { AppChatMessage } from "../../models/chatMessage";
import { getDatabase } from "../../services/firebase";

export class ChatDocumentRepository {
  private db: admin.firestore.Firestore;
  private chatDoc: admin.firestore.DocumentReference;
  private messagesCol: admin.firestore.CollectionReference;

  constructor(userId: string, conversationId: string) {
    this.db = getDatabase();

    this.chatDoc = this.db
      .collection("assistantChat")
      .doc(userId)
      .collection("chats")
      .doc(conversationId);

    this.messagesCol = this.chatDoc.collection("messages");
  }

  async addMessage(message: AppChatMessage): Promise<void> {
    await this.messagesCol.doc(message.id).set(message.toRecord());
    await this.chatDoc.update({ updated: new Date() });
  }

  async addMessages(messages: AppChatMessage[]): Promise<void> {
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
