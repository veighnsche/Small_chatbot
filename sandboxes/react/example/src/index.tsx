import * as React from "react";
import * as ReactDOM from "react-dom";
import { LlamaTreeProvider } from "../../src";
import { ControlContainer } from "./components/ControlContainer";
import "./firebase";

const App = () => {
  return (
    <LlamaTreeProvider url={"http://localhost:3001"}>
      <ControlContainer/>
    </LlamaTreeProvider>
  );
};

ReactDOM.render(<App/>, document.getElementById("root"));
