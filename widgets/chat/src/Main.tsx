import { useEffect } from "react";
import { NewChat } from "./components/buttons/NewChat/NewChat.tsx";
import { Chat } from "./components/Chat/Chat.tsx";
import { ChatTitle } from "./components/ChatTitle/ChatTitle.tsx";
import { HistoryList } from "./components/HistoryList/HistoryList.tsx";
import { Input } from "./components/Input/Input.tsx";
import "./Main.css";
import "./reset.css";
import { eventBus } from "./services/eventBus";
import { useLlamaDispatch } from "./stores/llamaStore.ts";
import { llamaSseAddMessage } from "./thunks/llamaSseAddMessage.ts";

interface MainProps {
  onFunctionCall?: (functionName: string, args: any[]) => void;
}

const Main = ({}: MainProps) => {
  const dispatch = useLlamaDispatch();

  const addMessage = (message: string) => {
    dispatch(llamaSseAddMessage({
      newMessages: [{
        role: "user",
        content: message,
      }],
    }));
  };

  useEffect(() => {
    eventBus.on("message", addMessage);

    return () => {
      eventBus.off("message", addMessage);
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
