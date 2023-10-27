import { ChatCompletionRole } from "openai/src/resources/chat/completions";
import { getDatabase } from "../services/firebase";
import { ChatMessage } from "../types/chat";

interface BaseMessageParams {
  userUid: string;
  chatId?: string;
  content?: string;
  role?: ChatCompletionRole;
  functionName?: string;
  functionArgs?: Record<string, any>;
  functionCallback?: string;
}

const db = getDatabase();  // Initialize Firebase Firestore database

const getUserRef = (userUid: string) => db.collection("assistantConversation").doc(userUid);

const getConversationRef = (userUid: string, chatId: string) => getUserRef(userUid).collection("conversations").doc(chatId);

export const newChat = async ({ userUid, content }: BaseMessageParams, systemContent?: string): Promise<{
  chatId: string;
  chatMessage: ChatMessage;
}> => {
  // Step 1: Create a new conversation document in the Firestore database under the user's 'conversations' collection.
  const conversationRef = await getUserRef(userUid).collection("conversations").add({
    name: "New Chat",
    updated: new Date().toISOString(),
  });

  // Step 2: Generate a unique message ID based on the current timestamp.
  const messageId = new Date().toISOString();

  // Step 3: If a system message is provided, create a new message document with "-system" appended to the ID.
  if (systemContent) {
    const systemChatMessage: ChatMessage = {
      role: "system",
      content: systemContent,
    };
    await conversationRef.collection("messages").doc(messageId).set(systemChatMessage);
  }

  // Step 4: Create a new message document for the user's message.
  const userChatMessage: ChatMessage = {
    role: "user",
    content: content!,
  };
  await conversationRef.collection("messages").doc(messageId).set(userChatMessage);

  // Step 5: Return the ID of the newly created conversation and the user message.
  return {
    chatId: conversationRef.id,
    chatMessage: userChatMessage,
  };
};

export const addMessage = async ({
  chatId,
  content,
  functionName,
  functionArgs,
  role,
  userUid,
}: BaseMessageParams): Promise<ChatMessage> => {

  // Step 1: Validate the parameters
  if (!userUid || !chatId) {
    throw new Error(`Invalid parameters provided. userUid: ${userUid}, chatId: ${chatId}`);
  }

  // Step 2: Get a reference to the conversation
  const conversationRef = getUserRef(userUid).collection("conversations").doc(chatId);

  // Step 3: Create the new message
  const chatMessage: ChatMessage = {
    role: role ?? "user",
    content: content ?? null,
  };

  // Step 4: If it's an assistant's message with a function call, add those details
  if (role === "assistant" && functionName && functionArgs) {
    chatMessage.function_call = {
      name: functionName,
      arguments: JSON.stringify(functionArgs),
    };
  }

  // Step 5: Save the new message to Firestore with timestamp as ID
  const messageId = new Date().toISOString();
  await conversationRef.collection("messages").doc(messageId).set(chatMessage);

  // Step 6: Update the 'updated' timestamp of the chat conversation
  await conversationRef.update({
    updated: messageId,
  });

  return chatMessage;
};

export const fetchAllMessages = async (userUid: string, chatId: string): Promise<ChatMessage[]> => {

  // Step 1: Validate the parameters
  if (!userUid || !chatId) {
    throw new Error(`Invalid parameters provided. userUid: ${userUid}, chatId: ${chatId}`);
  }

  // Step 2: Get a reference to the conversation's messages collection
  const messagesRef = getUserRef(userUid).collection("conversations").doc(chatId).collection("messages");

  // Step 3: Fetch all messages
  const snapshot = await messagesRef.get();

  // Step 4: Return an empty array if no messages exist, else map the data to an array
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => doc.data() as ChatMessage);
};

export const fetchChatHistory = async (userUid: string): Promise<Array<{chatId: string, name: string, updated: string}>> => {

  // Step 1: Validate the user UID
  if (!userUid) {
    throw new Error(`Invalid user UID provided: ${userUid}`);
  }

  // Step 2: Get a reference to the user's conversations collection
  const conversationsRef = getUserRef(userUid).collection("conversations");

  // Step 3: Fetch all conversations
  const snapshot = await conversationsRef.get();

  // Step 4: Return an empty array if no conversations exist, else map the data to an array
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    chatId: doc.id,
    name: doc.data().name,
    updated: doc.data().updated,
  }));
};

export const deleteChatHistory = async (userUid: string): Promise<void> => {

  // Step 1: Validate the user UID
  if (!userUid) {
    throw new Error(`Invalid user UID provided: ${userUid}`);
  }

  // Step 2: Get a reference to the user's conversations collection
  const conversationsRef = getUserRef(userUid).collection("conversations");

  // Step 3: Fetch all conversation references
  const snapshot = await conversationsRef.get();

  // Step 4: If no conversations exist, simply return
  if (snapshot.empty) {
    return;
  }

  // Step 5: Batch delete all conversations and associated messages
  const db = getDatabase();
  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    // Delete the conversation document
    batch.delete(doc.ref);

    // Optionally, if you want to delete all messages under each conversation
    // (might require additional logic if there are too many messages for a single batch)
    // const messagesRef = doc.ref.collection("messages");
    // messagesRef.get().then(messageSnapshot => {
    //   messageSnapshot.docs.forEach(message => {
    //     batch.delete(message.ref);
    //   });
    // });
  });

  // Commit the batch delete
  await batch.commit();
};

export const updateChatName = async (userUid: string, chatId: string, name: string): Promise<void> => {

  // Step 1: Validate the user UID and chat ID
  if (!userUid || !chatId) {
    throw new Error(`Invalid parameters provided. userUid: ${userUid}, chatId: ${chatId}`);
  }

  // Step 2: Get a reference to the specific conversation document
  const conversationRef = getUserRef(userUid).collection("conversations").doc(chatId);

  // Step 3: Update the conversation's name
  await conversationRef.update({ name });
};

export const getChatName = async (userUid: string, chatId: string): Promise<string> => {

  // Step 1: Validate the user UID and chat ID
  if (!userUid || !chatId) {
    throw new Error(`Invalid parameters provided. userUid: ${userUid}, chatId: ${chatId}`);
  }

  // Step 2: Get a reference to the specific conversation document
  const conversationRef = getUserRef(userUid).collection("conversations").doc(chatId);

  // Step 3: Fetch the conversation document
  const doc = await conversationRef.get();

  // Step 4: If the document doesn't exist, throw an error
  if (!doc.exists) {
    throw new Error(`Chat with ID ${chatId} not found for user ${userUid}`);
  }

  // Step 5: Return the conversation's name
  return doc.data()?.name || '';
};
