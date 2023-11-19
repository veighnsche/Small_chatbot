import CloseChatIcon from "../../assets/chat-close.svg";
import NewChatIcon from "../../assets/chat-new.svg";
import EnlargeIcon from "../../assets/enlarge.svg";
import CloseHistoryIcon from "../../assets/history-close.svg";
import OpenHistoryIcon from "../../assets/history-open.svg";
import ShrinkIcon from "../../assets/shrink.svg";
import { reset } from "../../slices/llamaChatSlice.ts";
import { toggleChatView, toggleHistoryDrawer, toggleSize } from "../../slices/llamaChatViewSlice";
import { useLlamaDispatch, useLlamaSelector } from "../../stores/llamaStore";
import { IconButton } from "../utils/IconButton/IconButton";
import "./ChatHeader.css";

export const ChatHeader = () => {
  const dispatch = useLlamaDispatch();
  const { isHistoryDrawerOpen, isLarge } = useLlamaSelector(state => state.llamaChatView);

  const historyTitle = isHistoryDrawerOpen ? "Close History" : "Open History";
  const resizeTitle = isLarge ? "Shrink" : "Enlarge";

  return (
    <div className="header-container">
      <div className="header-actions">
        <IconButton onClick={() => dispatch(toggleHistoryDrawer())} title={historyTitle}>
          <img src={isHistoryDrawerOpen ? CloseHistoryIcon : OpenHistoryIcon} alt={`${historyTitle} icon`} />
        </IconButton>
        {!isHistoryDrawerOpen && (
          <IconButton onClick={() => dispatch(reset())} title="New Chat">
            <img src={NewChatIcon} alt="New Chat icon" />
          </IconButton>
        )}
      </div>
      <div className="header-actions">
        <IconButton onClick={() => dispatch(toggleSize())} title={resizeTitle}>
          <img src={isLarge ? ShrinkIcon : EnlargeIcon} alt={`${resizeTitle} icon`} />
        </IconButton>
        <IconButton onClick={() => dispatch(toggleChatView())} title="Minimize Chat">
          <img src={CloseChatIcon} alt="Minimize Chat icon" />
        </IconButton>
      </div>
    </div>
  );
};
