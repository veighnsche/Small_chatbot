import { useEffect, useState } from "react";
import { NewChat } from "./components/buttons/NewChat/NewChat.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { ChatHeader } from "./components/ChatHeader/ChatHeader.tsx";
import { HistoryList } from "./components/HistoryList/HistoryList.tsx";
import { Input } from "./components/Input/Input.tsx";
import "./Main.css";
import "./reset.css";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { editLlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
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

  const historyDrawerState = useLlamaSelector((state) => state.llamaChatView.isHistoryDrawerOpen);
  const [renderDrawer, setRenderDrawer] = useState(historyDrawerState);

  useEffect(() => {
    const ANIMATION_DURATION = 300;

    if (historyDrawerState) {
      setRenderDrawer(true);
    } else {
      setTimeout(() => setRenderDrawer(false), ANIMATION_DURATION);
    }
  }, [historyDrawerState]);

  return (
    <div className={`box-container ${historyDrawerState ? "" : "history-drawer-closed"}`}>
      {renderDrawer && <HistoryList/>}
      {renderDrawer && <NewChat/>}
      <ChatHeader/>
      <Chat/>
      <Input/>
    </div>
  );
};

export default Main;
