import { useLlamaHistoryList } from "./useLlamaHistoryList.ts";
import { HistoryItem } from "../HistoryItem/HistoryItem.tsx";
import "./HistoryList.css";

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
