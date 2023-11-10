import { UseLlamaChat } from "../hooks/components/useLlamaChat";
import { ContentBubble } from "./ContentBubble";
import "../styles/Chat.css";

export const Chat = () => {
  const { thread, chatContainerRef } = UseLlamaChat();

  if (thread.length === 0) {
    return (
      <div className="empty-chat-container">
        <p className="empty-state-message">
          The Assistant can make mistakes, it's just mechanical numbers that generates language
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {thread.map((msg) => (
        <ContentBubble key={msg.id} {...msg} />
      ))}
    </div>
  );
};
