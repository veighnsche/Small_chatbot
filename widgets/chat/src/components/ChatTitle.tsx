import styled from "styled-components";
import { useLlamaChatTitle } from "../hooks/components/useLlamaChatTitle";

const TitleContainer = styled.div`
  grid-area: title;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-bottom: 1px solid #888;
  border-top-right-radius: 16px;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
`;

export const ChatTitle = () => {
  const { title } = useLlamaChatTitle();

  return (
    <TitleContainer>
      <Title>{title}</Title>
    </TitleContainer>
  );
};
