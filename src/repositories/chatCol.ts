import * as admin from "firebase-admin";
import { getDatabase } from "../services/firebase";
import { AppChat } from "../types/chat";

export class ChatColRepo {
  private db: admin.firestore.Firestore;
  private chatCol: admin.firestore.CollectionReference;

  constructor(userId: string) {
    this.db = getDatabase();

    this.chatCol = this.db
      .collection("assistantChat")
      .doc("users")
      .collection(userId);
  }

  async newChat(title: string): Promise<string> {
    const conversation: AppChat = {
      title,
      updated: new Date(),
    };

    try {
      const chatRef = await this.chatCol.add(conversation);
      return chatRef.id;
    } catch (error) {
      throw new Error(`Error creating chat: ${error}`)
    }
  }

  async fetchChatHistory(): Promise<AppChat[]> {
    const snapshot = await this.chatCol.orderBy("updated", "desc").get();
    return snapshot.docs.map(doc => doc.data() as AppChat);
  }

  async deleteAllChats(): Promise<void> {
    const snapshot = await this.chatCol.get();
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }

  async editCustomInstructions(custom_instructions: string): Promise<void> {
    await this.chatCol.doc("custom_instructions").update({ custom_instructions });
  }

}