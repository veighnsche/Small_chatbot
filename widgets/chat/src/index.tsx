import { User } from "firebase/auth";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";
import Main from "./Main";
import { LlamaTreeProvider } from "./providers/LlamaTreeProvider";
import { decodeMessage } from "./services/crypto";
import { eventBus } from "./services/eventBus";

export interface LlamaTreeProps {
  url: string;
  user: User;
  onFunctionCall?: (functionName: string, args: any[]) => void;
}

class ChatWidgetElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private readonly container: HTMLDivElement;
  private readonly reactRoot: ReactDOM.Root;


  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.container = document.createElement("div");
    this.reactRoot = ReactDOM.createRoot(this.container);
    this.root.appendChild(this.container);
  }

  setProps(props: LlamaTreeProps) {
    props.user.getIdToken().then((token) => {
      fetch(`${props.url}/api/v1/chat/config`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      })
        .then(response => response.text())
        .then(data => {
          const firebaseConfig = decodeMessage(props.user.uid, data);

          this.reactRoot.render(
            <React.StrictMode>
              <StyleSheetManager target={this.container}>
                <LlamaTreeProvider url={props.url} firebaseConfig={firebaseConfig} user={props.user}>
                  <Main onFunctionCall={props.onFunctionCall}/>
                </LlamaTreeProvider>
              </StyleSheetManager>
            </React.StrictMode>,
          );
        });
    });
  }

  sendMessage(message: string) {
    eventBus.emit("message", message);
  }

  disconnectedCallback() {
    this.reactRoot.unmount();
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
