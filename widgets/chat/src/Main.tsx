import { useEffect, useState } from "react";
import OpenChatIcon from "./assets/chat-open.svg";
import { NewChat } from "./components/buttons/NewChat/NewChat.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { ChatHeader } from "./components/ChatHeader/ChatHeader.tsx";
import { HistoryList } from "./components/HistoryList/HistoryList.tsx";
import { Input } from "./components/Input/Input.tsx";
import { IconButton } from "./components/utils/IconButton/IconButton.tsx";
import "./Main.css";
import "./reset.css";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { editLlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { toggleChatView } from "./slices/llamaChatViewSlice.ts";
import { useLlamaDispatch, useLlamaSelector } from "./stores/llamaStore.ts";
import { llamaSseAddMessage } from "./thunks/llamaSseAddMessage.ts";

const Main = () => {
  const dispatch = useLlamaDispatch();

  const addMessage = (message: string) => {
    dispatch(llamaSseAddMessage({
      newMessages: [{
        role: "user",
        content: message,
      }],
    }));
  };

  const editChatParams = (params: any) => {
    dispatch(editLlamaChatParams(params));
  };

  useEffect(() => {
    const subs = [
      llamaEventBus.on("user-message", addMessage),
      llamaEventBus.on("chat-params", editChatParams),
    ];

    return () => {
      subs.forEach((unsub) => unsub());
    };
  }, []);

  const isLarge = useLlamaSelector((state) => state.llamaChatView.isLarge);
  const isHistoryDrawerOpen = useLlamaSelector((state) => state.llamaChatView.isHistoryDrawerOpen);
  const [renderDrawer, setRenderDrawer] = useState(isHistoryDrawerOpen);

  useEffect(() => {
    const ANIMATION_DURATION = 300;

    if (isHistoryDrawerOpen) {
      setRenderDrawer(true);
    } else {
      setTimeout(() => setRenderDrawer(false), ANIMATION_DURATION);
    }
  }, [isHistoryDrawerOpen]);

  const historyClass = isHistoryDrawerOpen ? "" : "history-drawer-closed";
  const largeClass = isLarge ? "large" : "";

  const isOpen = useLlamaSelector((state) => state.llamaChatView.isOpen);
  if (!isOpen) {
    return (
      <IconButton className="open-chat-button" onClick={() => dispatch(toggleChatView())}>
        <img width={32} height={32} src={OpenChatIcon} alt="Open Chat"/>
      </IconButton>
    );
  }

  return (
    <div className={`box-container ${historyClass} ${largeClass}`}>
      {renderDrawer && <HistoryList/>}
      {renderDrawer && <NewChat/>}
      <ChatHeader/>
      <Chat/>
      <Input/>
    </div>
  );
};

export default Main;
