import "./NewChat.css";
import { useLlamaNewChat } from "./useLlamaNewChat.ts";

export const NewChat = () => {
  const { handleNewChat } = useLlamaNewChat();

  return (
    <button className={`new-chat-button`} onClick={handleNewChat}>
      + New Chat
    </button>
  );
};
