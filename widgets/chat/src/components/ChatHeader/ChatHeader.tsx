import { toggleChatHistory, toggleChatSize, toggleChatView } from "../../slices/llamaChatViewSlice.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore.ts";
// import { useLlamaChatHeader } from "./useLlamaChatHeader.ts";
import "./ChatHeader.css";
import { IconButton } from "../utils/IconButton/IconButton.tsx";
import OpenHistoryIcon from "../../assets/history-open.svg";
import CloseHistoryIcon from "../../assets/history-close.svg";
import EnlargeIcon from "../../assets/enlarge.svg";
import ShrinkIcon from "../../assets/shrink.svg";
import CloseChatIcon from "../../assets/chat-close.svg";

export const ChatHeader = () => {
  const dispatch = useLlamaDispatch();
  // const { title } = useLlamaChatHeader();
  const { isHistoryOpen, isLarge } = useLlamaSelector((state) => state.llamaChatView);

  const HistoryIcon = isHistoryOpen ? CloseHistoryIcon : OpenHistoryIcon;
  const ResizeIcon = isLarge ? ShrinkIcon : EnlargeIcon;

  const historyString = isHistoryOpen ? "Close History" : "Open History";
  const resizeString = isLarge ? "Shrink" : "Enlarge";

  return (
    <div className="title-container">
      <div className="left-actions">
        <IconButton onClick={() => dispatch(toggleChatHistory())} title={historyString}>
          <img src={HistoryIcon} alt={historyString}/>
        </IconButton>
      </div>
      {/*<h3 className="title">{title}</h3>*/}
      <div className="right-actions">
        <IconButton onClick={() => dispatch(toggleChatSize())} title={resizeString}>
          <img src={ResizeIcon} alt={resizeString}/>
        </IconButton>
        <IconButton onClick={() => dispatch(toggleChatView())} title="Minimize Chat">
          <img src={CloseChatIcon} alt="Minimize Chat"/>
        </IconButton>
      </div>
    </div>
  );
};
