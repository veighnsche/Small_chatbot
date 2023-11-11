import { useEffect } from "react";
import { NewChat } from "./components/buttons/NewChat/NewChat.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { ChatTitle } from "./components/ChatTitle/ChatTitle.tsx";
import { HistoryList } from "./components/HistoryList/HistoryList.tsx";
import { Input } from "./components/Input/Input.tsx";
import "./Main.css";
import "./reset.css";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { editLlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { useLlamaDispatch } from "./stores/llamaStore.ts";
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
      llamaEventBus.on("chat-params", editChatParams)
    ];

    return () => {
      subs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <div className="box-container">
      <HistoryList/>
      <NewChat/>
      <ChatTitle/>
      <Chat/>
      <Input/>
    </div>
  );
};

export default Main;
