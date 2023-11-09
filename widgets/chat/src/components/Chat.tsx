import * as React from "react";
import styled from "styled-components";
import { UseLlamaChat } from "../hooks/components/useLlamaChat";
import { ContentBubble } from "./ContentBubble";

const ChatContainer = styled.div`
  grid-area: chat;
  overflow-y: auto;
  max-height: 100%;
  width: 100%;
`;

const EmptyChatContainer = styled(ChatContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-style: italic;
`;

const EmptyStateMessage = styled.p`
  width: 33%;
  text-align: center;
  padding: 1rem;
  border: 1px solid #888;
  background-color: #f5f5f5;
`;

export const Chat = () => {
  const { thread, chatContainerRef } = UseLlamaChat();

  if (thread.length === 0) {
    return (
      <EmptyChatContainer>
        <EmptyStateMessage>
          The Assistant can make mistakes, it's just mechanical numbers that generates language
        </EmptyStateMessage>
      </EmptyChatContainer>
    );
  }

  return (
    <ChatContainer ref={chatContainerRef}>
      {thread.map((msg) =>
        <ContentBubble key={msg.id} {...msg} />,
      )}
    </ChatContainer>
  );
};
