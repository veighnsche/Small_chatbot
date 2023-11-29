import { useEffect, useState } from "react";
import OpenChatIcon from "./assets/chat-open.svg";
import { NewChat } from "./components/buttons/NewChat/NewChat.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { ChatHeader } from "./components/ChatHeader/ChatHeader.tsx";
import { HistoryList } from "./components/HistoryList/HistoryList.tsx";
import { Input } from "./components/Input/Input.tsx";
import { IconButton } from "./components/utils/IconButton/IconButton.tsx";
import "./Main.css";
import { useLlamaStreamingWrite } from "./providers/LlamaStreamingProvider.tsx";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { editLlamaChatParams, LlamaChatParams, updateLlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { emptyLoadedSystemMessages, loadSystemMessages, removeSystemMessages } from "./slices/llamaChatSlice.ts";
import { editChatView, LlamaChatViewSliceState, toggleChatView } from "./slices/llamaChatViewSlice.ts";
import { useLlamaDispatch, useLlamaSelector } from "./stores/llamaStore.ts";
import { llamaOnMessagesSnapshot } from "./thunks/llamaOnMessagesSnapshot.ts";
import { llamaSseAddMessage } from "./thunks/llamaSseAddMessage.ts";
import { LlamaLoadedSystemMessage } from "./types/LlamaLoadedSystemMessage.ts";

const Main = () => {
  const dispatch = useLlamaDispatch();
  const llamaStreamContext = useLlamaStreamingWrite()

  const handleLoadSystemMessages = (messages: Omit<LlamaLoadedSystemMessage, "id">[]) => {
    dispatch(loadSystemMessages({ messages }));
  };

  const handleRemoveLoadedSystemMessages = (ids: string[]) => {
    dispatch(removeSystemMessages({ ids }));
  };

  const handleEmptyLoadedSystemMessages = () => {
    dispatch(emptyLoadedSystemMessages());
  };

  const handleAddMessage = ({ message, params, assistant_uid }: { message: string, params?: Partial<LlamaChatParams>, assistant_uid: string }) => {
    dispatch(llamaSseAddMessage({
      clientMessages: [{
        role: "user",
        content: message,
      }],
      params,
      assistant_uid,
      llamaStreamContext,
    }));
  };

  const handleEditChatParams = (params: Partial<LlamaChatParams> | ((params: LlamaChatParams) => Partial<LlamaChatParams>)) => {
    if (typeof params === "function") {
      dispatch(updateLlamaChatParams(params));
    } else {
      dispatch(editLlamaChatParams(params));
    }
  };

  const handleEditChatView = (view: Partial<LlamaChatViewSliceState>) => {
    dispatch(editChatView(view));
  };

  const handleSetCurrentChat_id = (chat_id: string) => {
    dispatch(llamaOnMessagesSnapshot({ chat_id }));
  };

  useEffect(() => {
    const subs = [
      llamaEventBus.on("load-system-messages", handleLoadSystemMessages),
      llamaEventBus.on("remove-system-messages", handleRemoveLoadedSystemMessages),
      llamaEventBus.on("empty-system-messages", handleEmptyLoadedSystemMessages),
      llamaEventBus.on("user-message", handleAddMessage),
      llamaEventBus.on("chat-params", handleEditChatParams),
      llamaEventBus.on("chat-view", handleEditChatView),
      llamaEventBus.on("chat-id", handleSetCurrentChat_id),
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
    } else if (!isHistoryDrawerOpen && renderDrawer) {
      setTimeout(() => setRenderDrawer(false), ANIMATION_DURATION);
    }
  }, [isHistoryDrawerOpen]);

  const historyClass = isHistoryDrawerOpen ? "" : "history-drawer-closed";
  const largeClass = isLarge ? "large" : "";

  const isOpen = useLlamaSelector((state) => state.llamaChatView.isOpen);

  return (
    <>
      <IconButton
        style={{ display: isOpen ? "none" : "flex" }}
        className="open-chat-button"
        onClick={() => dispatch(toggleChatView())}
      >
        <img width={32} height={32} src={OpenChatIcon} alt="Open Chat" />
      </IconButton>
      <div
        style={{ display: isOpen ? "grid" : "none" }}
        className={`box-container ${historyClass} ${largeClass}`}
      >
        {renderDrawer && <HistoryList />}
        {renderDrawer && <NewChat />}
        <ChatHeader />
        <Chat />
        <Input />
      </div>
    </>

  );
};

export default Main;
