import { useLlamaHistoryList } from "../hooks/components/useLlamaHistoryList";
import { HistoryItem } from "./HistoryItem";
import "../styles/HistoryList.css";

export const HistoryList = () => {
  const {
    history,
    selectedChatId,
  } = useLlamaHistoryList();

  return (
    <div className="history-list-wrapper">
      {history.map((chat) => (
        <HistoryItem key={chat.id} {...chat} selected={selectedChatId(chat.id)}/>
      ))}
    </div>
  );
};
