import * as React from "react";
import { useEffect } from "react";
import { NewChat } from "./components/buttons/NewChat";
import { Chat } from "./components/Chat";
import { ChatTitle } from "./components/ChatTitle";
import { HistoryList } from "./components/HistoryList";
import { Input } from "./components/Input";
import { eventBus } from "./services/eventBus";
import "./Main.css"

interface MainProps {
  onFunctionCall?: (functionName: string, args: any[]) => void;
}

const Main = ({ onFunctionCall }: MainProps) => {

  useEffect(() => {
    eventBus.on("message", (m) => onFunctionCall?.("message", [m]));

    return () => {
      eventBus.off("message", (m) => onFunctionCall?.("message", [m]));
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
