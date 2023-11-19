import { useState } from "react";
import AssistantIcon from "../../assets/assistant.svg";
import ContentHideIcon from "../../assets/content-hide.svg";
import ContentShowIcon from "../../assets/content-show.svg";
import CrossIcon from "../../assets/cross.svg";
import Edit from "../../assets/edit.svg";
import FunctionCallIcon from "../../assets/function-call.svg";
import SystemIcon from "../../assets/system.svg";
import UserIcon from "../../assets/user.svg";
import { removeSystemMessage } from "../../slices/llamaChatSlice.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
import { LlamaMessage } from "../../types/LlamaMessage.ts";
import { SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE } from "../../utils/messages.ts";
import { CopyToClipboard } from "../buttons/CopyToClipboard/CopyToClipboard.tsx";
import { Regenerate } from "../buttons/Regenerate/Regenerate.tsx";
import { InputEdit } from "../InputEdit/InputEdit.tsx";
import { Iterator } from "../Iterator/Iterator.tsx";
import { IconButton } from "../utils/IconButton/IconButton.tsx";
import "./ContentBubble.css";
import { useLlamaContentBubble } from "./useLlamaContentBubble.ts";

export const ContentBubble = (message: LlamaMessage) => {
  const { role } = message;

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

const User = ({ content, parent_id, iter }: LlamaMessage) => {
  const { isEditing, onStartEdit, onCancelEdit } = useLlamaContentBubble.user();

  return (
    <div className="content-bubble-container user">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img className="role-icon" src={UserIcon} alt={`user icon`} />
          <span>You</span>
        </div>
        <div className="content-text">
          {isEditing ? (
            <InputEdit content={content || ""} parent_id={parent_id} onCancel={onCancelEdit} />
          ) : (
            <p>{content}</p>
          )}
        </div>
        <div className="content-actions">
          <Iterator parent_id={parent_id} iter={iter} />
          {!isEditing ? (
            <IconButton className="on-user-hover" onClick={onStartEdit} title={"Edit"}>
              <img src={Edit} alt="edit icon" />
            </IconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FunctionCall = ({ content, function_call, ...rest }: LlamaMessage) => {
  return (
    <>
      <System
        {...{
          content: `${function_call?.name}${SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE}${function_call?.arguments}`,
          function_call,
          ...rest,
        }}
      />
      <Assistant {...{ content, ...rest }} />
    </>
  );
};

const Assistant = ({ content, id, parent_id, iter }: LlamaMessage) => {
  const isLastAssistantMessage = useLlamaSelector((state) => {
    return state.llamaChat.lastMessageId === id;
  });
  return (
    <div className="content-bubble-container assistant">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img className="role-icon" src={AssistantIcon} alt={`assistant icon`} />
          <span>Assistant</span>
        </div>
        <div className="content-text">
          <p>{content}</p>
        </div>
        <div className="content-actions">
          <Iterator parent_id={parent_id} iter={iter} />
          <CopyToClipboard content={content || ""} />
          {isLastAssistantMessage ? <Regenerate /> : null}
        </div>
      </div>
    </div>
  );
};

const System = ({ content: systemContent, function_call, id }: LlamaMessage) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useLlamaDispatch();

  const toggleContent = () => {
    setIsVisible(!isVisible);
  };

  const [title, content] = systemContent!.split(SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE);

  return (
    <div className={`content-bubble-container system ${function_call ? "function-call" : ""}`}>
      <div className="content-bubble-wrapper">
        <div className="content-header system">
          <img
            className="role-icon"
            src={function_call ? FunctionCallIcon : SystemIcon}
            alt="system icon"
          />
          <span>{title}</span>
          <IconButton onClick={toggleContent} title={isVisible ? "Hide Content" : "Show Content"}>
            <img
              src={isVisible ? ContentHideIcon : ContentShowIcon}
              alt={`${isVisible ? "Hide Content" : "Show Content"} icon`}
            />
          </IconButton>
          {id.startsWith("system-") ? (
            <IconButton
              onClick={() => dispatch(removeSystemMessage({ id }))}
              title="Clear A Loaded System Message"
            >
              <img src={CrossIcon} alt="Clear A Loaded System Message icon" />
            </IconButton>
          ) : null}
        </div>
        <div className={`content-text system ${isVisible ? "visible" : "hidden"}`}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};
