import styled, { css } from "styled-components";
import { useLlamaContentBubble } from "../hooks/components/useLlamaContentBubble";
import { LlamaMessage } from "../types/LlamaMessage";
import { CopyToClipboard } from "./buttons/CopyToClipboard";
import { InputEdit } from "./InputEdit";
import { Iterator } from "./Iterator";
import { IconButton } from "./utils/IconButton";

const ContentBubbleContainer = styled.div<{ $role: "user" | "assistant" | "system" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.8rem 1rem 2rem 1rem;

  ${({ $role }) => {
    switch ($role) {
      case "user":
        return css`
          background-color: transparent;

          ${Actions} {
            opacity: 0;
          }

          &:hover ${Actions} {
            opacity: 1;
          }
        `;
      case "assistant":
        return css`
          background-color: #f5f5f5;
        `;
      case "system":
        return css`
          background-color: #888;
          border: 1px solid lightgrey;
          margin: 0.5rem;
        `;
      default:
        return;
    }
  }}
`;

const ContentBubbleWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const ContentText = styled.div`
  flex: 1;
  font-size: 1rem;
  margin-right: 0.5rem;
  margin-top: 0.1rem;
  white-space: pre-wrap;
`;

const FunctionCallWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background-color: #e6e6e6;
  border-radius: 8px;
  margin: 0.5rem 0;
`;

const FunctionName = styled.h1` // Using span for inline display
  font-weight: bold;
  color: #333;
  margin-right: 0.5rem;
`;

const FunctionArguments = styled.p` // Using span for inline display
  font-family: 'Courier New', Courier, monospace;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  margin-left: 0.5rem;
  white-space: pre-wrap;
`;


const RoleIcon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
`;

const Actions = styled.div<{ $userHover?: boolean }>`
  position: relative;
  height: 2rem;
  min-width: 2rem;

  img {
    width: 1.2rem;
    height: 1.2rem;
    opacity: 0.5;
  }
`;

export const ContentBubble = (message: LlamaMessage) => {
  const {
    role,
  } = message;

  switch (role) {
    case "user":
      return User(message);
    case "assistant":
      if (message.function_call) {
        return FunctionCall(message);
      }
      return Assistant(message);
    case "system":
      return System(message);
    default:
      return null;
  }
};


const User = ({
  content,
  parent_id,
  iter,
}: LlamaMessage) => {
  const {
    isEditing,
    onStartEdit,
    onCancelEdit,
  } = useLlamaContentBubble.user();

  return (
    <ContentBubbleContainer $role="user">
      <Iterator parent_id={parent_id} iter={iter}/>
      <ContentBubbleWrapper>
        <RoleIcon
          src={`http://localhost:3001/icons/user.svg`}
          alt={`user icon`}
        />
        <ContentText>
          {isEditing ? (
            <InputEdit
              content={content || ""}
              parent_id={parent_id}
              onCancel={onCancelEdit}
            />
          ) : <p>{content}</p>}
        </ContentText>
        <Actions $userHover>
          {!isEditing ? (
            <IconButton onClick={onStartEdit}>
              <img src="http://localhost:3001/icons/edit.svg" alt="edit icon"/>
            </IconButton>
          ) : null}
        </Actions>
      </ContentBubbleWrapper>
    </ContentBubbleContainer>
  );
};

const FunctionCall = ({
  content,
  function_call,
  parent_id,
  iter,
}: LlamaMessage) => {
  return (
    <ContentBubbleContainer $role="assistant">
      <Iterator parent_id={parent_id} iter={iter}/>
      <ContentBubbleWrapper>
        <RoleIcon
          src={`http://localhost:3001/icons/assistant.svg`}
          alt={`assistant icon`}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <ContentText>
            <p>{content}</p>
          </ContentText>
          <FunctionCallWrapper>
            <FunctionName>{function_call?.name}</FunctionName>
            <FunctionArguments>{function_call?.arguments}</FunctionArguments>
          </FunctionCallWrapper>
        </div>
        <Actions>
          <CopyToClipboard content={content || ""}/>
        </Actions>
      </ContentBubbleWrapper>
    </ContentBubbleContainer>
  );
};

const Assistant = ({
  content,
  parent_id,
  iter,
}: LlamaMessage) => {
  return (
    <ContentBubbleContainer $role="assistant">
      <Iterator parent_id={parent_id} iter={iter}/>
      <ContentBubbleWrapper>
        <RoleIcon
          src={`http://localhost:3001/icons/assistant.svg`}
          alt={`assistant icon`}
        />
        <ContentText>
          <p>{content}</p>
        </ContentText>
        <Actions>
          <CopyToClipboard content={content || ""}/>
        </Actions>
      </ContentBubbleWrapper>
    </ContentBubbleContainer>
  );
};

const System = ({ content }: LlamaMessage) => {
  return (
    <ContentBubbleContainer $role="system">
      <ContentBubbleWrapper>
        <RoleIcon
          src={`http://localhost:3001/icons/system.svg`}
          alt={`system icon`}
        />
        <ContentText>
          <p>{content}</p>
        </ContentText>
      </ContentBubbleWrapper>
    </ContentBubbleContainer>
  );
};