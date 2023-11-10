import { useLlamaContentBubble } from "../hooks/components/useLlamaContentBubble";
import { LlamaMessage } from "../types/LlamaMessage";
import { CopyToClipboard } from "./buttons/CopyToClipboard";
import { InputEdit } from "./InputEdit";
import { Iterator } from "./Iterator";
import { IconButton } from "./utils/IconButton";
import '../styles/ContentBubble.css';

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
      <Iterator parent_id={parent_id} iter={iter}/>
      <div className="content-bubble-wrapper">
        <img
          className="role-icon"
          src={`http://localhost:3001/icons/user.svg`}
          alt={`user icon`}
        />
        <div className="content-text">
          {isEditing ? (
            <InputEdit
              content={content || ""}
              parent_id={parent_id}
              onCancel={onCancelEdit}
            />
          ) : <p>{content}</p>}
        </div>
        <div className="actions">
          {!isEditing ? (
            <IconButton onClick={onStartEdit}>
              <img src="http://localhost:3001/icons/edit.svg" alt="edit icon"/>
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
      <Iterator parent_id={parent_id} iter={iter}/>
      <div className="content-bubble-wrapper">
        <img
          className="role-icon"
          src={`http://localhost:3001/icons/assistant.svg`}
          alt={`assistant icon`}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div className="content-text">
            <p>{content}</p>
          </div>
          <div className="function-call-wrapper">
            <h1 className="function-name">{function_call?.name}</h1>
            <p className="function-arguments">{function_call?.arguments}</p>
          </div>
        </div>
        <div className="actions">
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
      <Iterator parent_id={parent_id} iter={iter}/>
      <div className="content-bubble-wrapper">
        <img
          className="role-icon"
          src={`http://localhost:3001/icons/assistant.svg`}
          alt={`assistant icon`}
        />
        <div className="content-text">
          <p>{content}</p>
        </div>
        <div className="actions">
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
        <img
          className="role-icon"
          src={`http://localhost:3001/icons/system.svg`}
          alt={`system icon`}
        />
        <div className="content-text">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};
