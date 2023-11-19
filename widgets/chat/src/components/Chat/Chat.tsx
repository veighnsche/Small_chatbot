import { useLlamaSelector } from "../../stores/llamaStore.ts";
import { UseLlamaChat } from "./useLlamaChat.ts";
import { ContentBubble } from "../ContentBubble/ContentBubble.tsx";
import "./Chat.css";

export const Chat = () => {
  const { thread, chatContainerRef } = UseLlamaChat();
  const error = useLlamaSelector((state) => state.llamaChat.error);

  if (thread.length === 0) {
    return (
      <div className="empty-chat-container">
        <p className="empty-state-message">
          The Assistant can make mistakes;<br/> it's just a machine generating language.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {thread.map((msg) => (
        <ContentBubble key={msg.id} {...msg} />
      ))}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
