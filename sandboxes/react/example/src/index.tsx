import * as React from "react";
import { createRoot } from "react-dom/client";
import { LlamaTreeProvider } from "../../src";
import { ControlContainer } from "./components/ControlContainer";
import { SetterOfThings } from "./components/SetterOfThings";
import "./firebase";

const App = () => {
  return (
    <LlamaTreeProvider url={"http://localhost:3001"} onInitialize={(llamaTree) => {
      llamaTree.setChatView({
        isHistoryDrawerOpen: true,
        isLarge: true,
        isOpen: true,
      });
    }}>
      <ControlContainer/>
      <SetterOfThings/>
    </LlamaTreeProvider>
  );
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("no root");
}

createRoot(root).render(<App/>);
