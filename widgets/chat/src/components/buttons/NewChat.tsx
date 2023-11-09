import * as React from "react";
import styled from "styled-components";
import { useLlamaNewChat } from "../../hooks/components/buttons/useLlamaNewChat";

const StyledButton = styled.button`
  grid-area: new;
  width: 100%;
  height: calc(4rem + 2px); /* 2px for border */
  border: none;
  background-color: #007bff; /* You can adjust this color */
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;

  border-bottom-left-radius: 14px;

  &:hover {
    background-color: #0056b3; /* Darker shade for hover effect */
  }

  &:focus {
    outline: none;
  }
`;

export const NewChat = () => {
  const { handleNewChat } = useLlamaNewChat();

  return (
    <StyledButton onClick={handleNewChat}>
      + New Chat
    </StyledButton>
  );
};
