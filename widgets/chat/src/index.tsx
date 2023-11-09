import { User } from "firebase/auth";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
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

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
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

          const reactRoot = ReactDOM.createRoot(this.root);

          reactRoot.render(
            <React.StrictMode>
              <LlamaTreeProvider url={props.url} firebaseConfig={firebaseConfig} user={props.user}>
                <Main onFunctionCall={props.onFunctionCall}/>
              </LlamaTreeProvider>
            </React.StrictMode>,
          );
        });
    });
  }

  sendMessage(message: string) {
    eventBus.emit("message", message);
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
