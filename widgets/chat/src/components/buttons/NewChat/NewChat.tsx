import { useLlamaNewChat } from "./useLlamaNewChat.ts";
import "./NewChat.css";

export const NewChat = () => {
  const { handleNewChat } = useLlamaNewChat();

  return (
    <button className="new-chat-button" onClick={handleNewChat}>
      + New Chat
    </button>
  );
};
