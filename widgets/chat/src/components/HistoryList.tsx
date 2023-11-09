import *as React from "react";
import styled from "styled-components";
import { useLlamaHistoryList } from "../hooks/components/useLlamaHistoryList";
import { HistoryItem } from "./HistoryItem";

const HistoryListWrapper = styled.div`
  grid-area: history;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* To handle scrolling if there are many history items */
  border-right: 1px solid #888; /* Optional: Add a divider between history and chat */
  border-top-left-radius: 14px;
`;

export const HistoryList = () => {
  const {
    history,
    selectedChatId,
  } = useLlamaHistoryList();

  return (
    <HistoryListWrapper>
      {history.map((chat) => (
        <HistoryItem key={chat.id} {...chat} selected={selectedChatId(chat.id)}/>
      ))}
    </HistoryListWrapper>
  );
};
