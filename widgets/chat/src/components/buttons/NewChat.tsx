import { useLlamaNewChat } from "../../hooks/components/buttons/useLlamaNewChat";
import "../../styles/buttons/NewChat.css";

export const NewChat = () => {
  const { handleNewChat } = useLlamaNewChat();

  return (
    <button className="new-chat-button" onClick={handleNewChat}>
      + New Chat
    </button>
  );
};
