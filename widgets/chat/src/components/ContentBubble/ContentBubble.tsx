import AssistantIcon from "../../assets/assistant.svg";
import Edit from "../../assets/edit.svg";
import SystemIcon from "../../assets/system.svg";
import UserIcon from "../../assets/user.svg";
import { LlamaMessage } from "../../types/LlamaMessage.ts";
import { CopyToClipboard } from "../buttons/CopyToClipboard/CopyToClipboard.tsx";
import { InputEdit } from "../InputEdit/InputEdit.tsx";
import { Iterator } from "../Iterator/Iterator.tsx";
import { IconButton } from "../utils/IconButton/IconButton.tsx";
import "./ContentBubble.css";
import { useLlamaContentBubble } from "./useLlamaContentBubble.ts";

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
    <div className="content-bubble-container user">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img
            className="role-icon"
            src={UserIcon}
            alt={`user icon`}
          />
          <span>You</span>
        </div>
        <div className="content-text">
          {isEditing ? (
            <InputEdit
              content={content || ""}
              parent_id={parent_id}
              onCancel={onCancelEdit}
            />
          ) : <p>{content}</p>}
        </div>
        <div className="content-actions">
          <Iterator parent_id={parent_id} iter={iter}/>
          {!isEditing ? (
            <IconButton className="on-user-hover" onClick={onStartEdit} title={"Edit"}>
              <img src={Edit} alt="edit icon"/>
            </IconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FunctionCall = ({
  content,
  function_call,
  parent_id,
  iter,
}: LlamaMessage) => {
  return (
    <div className="content-bubble-container assistant">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img
            className="role-icon"
            src={AssistantIcon}
            alt={`assistant icon`}
          />
          <span>Assistant</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div className="content-text">
            <p>{content}</p>
          </div>
          <div className="function-call-wrapper">
            <h1 className="function-name">{function_call?.name}</h1>
            <p className="function-arguments">{function_call?.arguments}</p>
          </div>
        </div>
        <div className="content-actions">
          <Iterator parent_id={parent_id} iter={iter}/>
          <CopyToClipboard content={content || ""}/>
        </div>
      </div>
    </div>
  );
};

const Assistant = ({
  content,
  parent_id,
  iter,
}: LlamaMessage) => {
  return (
    <div className="content-bubble-container assistant">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img
            className="role-icon"
            src={AssistantIcon}
            alt={`assistant icon`}
          />
          <span>Assistant</span>
        </div>
        <div className="content-text">
          <p>{content}</p>
        </div>
        <div className="content-actions">
          <Iterator parent_id={parent_id} iter={iter}/>
          <CopyToClipboard content={content || ""}/>
        </div>
      </div>
    </div>
  );
};

const System = ({ content }: LlamaMessage) => {
  return (
    <div className="content-bubble-container system">
      <div className="content-bubble-wrapper">
        <div className="content-header">
          <img
            className="role-icon"
            src={SystemIcon}
            alt={`system icon`}
          />
          <span>System</span>
        </div>
        <div className="content-text">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};
