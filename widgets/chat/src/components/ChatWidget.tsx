import { FirebaseOptions } from "firebase/app";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { eventBus } from "../services/EventBus";

export interface LlamaTreeProps {
  url: string;
  firebaseConfig: FirebaseOptions;
  user: User;
  onFunctionCall?: (functionName: string, args: any[]) => void;
}

interface Message {
  id: number;
  user: string;
  text: string;
}

const ChatWidget: React.FC<LlamaTreeProps> = ({ url, firebaseConfig, user, onFunctionCall }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: "User1", text: "Hello, how are you?" },
    { id: 2, user: "User2", text: "I am good, thanks! How about you?" },
    { id: 3, user: "User1", text: "Great to hear that. I am fine as well!" },
    { id: 4, user: "User2", text: "What are you up to today?" },
  ]);

  const addMessage = (message: string) => {
    setMessages((messages) => {
      const newMessage: Message = {
        id: messages.length + 1,
        user: messages.length % 2 === 0 ? "User1" : "User2",
        text: message,
      };

      return [...messages, newMessage];
    });

    onFunctionCall && onFunctionCall("sendMessage", [message]);
  };

  useEffect(() => {
    const awaitUserToken = async () => {
      const token = await user.getIdToken();
      console.log(token);
    };

    awaitUserToken();
  }, [user]);

  useEffect(() => {
    eventBus.on("message", addMessage);

    return () => {
      eventBus.off("message", addMessage);
    };
  }, []);

  return (
    <div style={{ width: "300px", height: "400px", border: "1px solid black", padding: "10px", overflow: "auto" }}>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {messages.map((message) => (
          <li key={message.id} style={{ marginBottom: "10px", border: "1px solid #ddd", padding: "5px" }}>
            <strong>{message.user}:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatWidget;
