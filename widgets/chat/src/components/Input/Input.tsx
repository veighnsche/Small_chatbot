import MessageSendIcon from "../../assets/message-send.svg";
import StopIcon from "../../assets/stop.svg";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
import { llamaSseStop } from "../../thunks/llamaSseStop.ts";
import { IconButton } from "../utils/IconButton/IconButton.tsx";
import "./Input.css";
import { useLlamaInput } from "./useLlamaInput.ts";

export const Input = () => {
  const {
    inputValue,
    inputOnChange,
    handleInputOnKeyPress,
    handleSend,
    textAreaRef,
  } = useLlamaInput();

  const dispatch = useLlamaDispatch();
  const sseId = useLlamaSelector((state) => state.llamaChat.sseId);
  const isStreaming = !!sseId;

  return (
    <div className="input-container">
      <div className="chat-input-wrapper">
        <textarea
          className="chat-input"
          ref={textAreaRef}
          rows={1}
          placeholder="Type a message..."
          value={inputValue}
          onChange={inputOnChange}
          onKeyDown={handleInputOnKeyPress}
        />
        <div className="icon-button-container">
          {isStreaming ? (
            <IconButton circle onClick={() => dispatch(llamaSseStop({ sseId }))} title={"Stop Streaming"}>
              <img src={StopIcon} alt={"Stop Streaming icon"} />
            </IconButton>
          ) : (
            <IconButton circle onClick={handleSend} title={"Send"}>
              <img src={MessageSendIcon} alt={"Send icon"} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};
