import { useLlamaHistoryList } from "./useLlamaHistoryList.ts";
import { HistoryItem } from "../HistoryItem/HistoryItem.tsx";
import "./HistoryList.css";

export const HistoryList = () => {
  const {
    history,
    selectedChat_id,
  } = useLlamaHistoryList();

  return (
    <div className="history-list-wrapper">
      {history.map((chat) => (
        <HistoryItem key={chat.id} {...chat} selected={selectedChat_id(chat.id)} />
      ))}
    </div>
  );
};
