import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget, { LlamaTreeProps } from "./components/ChatWidget";
import { eventBus } from "./services/EventBus";

class ChatWidgetElement extends HTMLElement {
  private readonly root: ShadowRoot;
  private reactRoot: ReactDOM.Root | null = null;
  private props: LlamaTreeProps | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.updateWidget = this.updateWidget.bind(this);
  }

  setProps(props: LlamaTreeProps) {
    this.props = props;
    this.updateWidget();
  }

  sendMessage(message: string) {
    eventBus.emit('message', message);
  }

  private updateWidget() {
    if (!this.props) return;

    if (!this.reactRoot) {
      this.reactRoot = ReactDOM.createRoot(this.root);
    }

    this.reactRoot.render(
      <React.StrictMode>
        <ChatWidget {...this.props} />
      </React.StrictMode>,
    );
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
