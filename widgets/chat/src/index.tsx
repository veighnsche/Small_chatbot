import { User } from "firebase/auth";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import Main from "./Main";
import { LlamaTreeProvider } from "./providers/LlamaTreeProvider";
import { decodeMessage } from "./services/crypto";
import { eventBus } from "./services/eventBus";
import { LlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { LlamaMessage } from "./types/LlamaMessage.ts";

export interface LlamaTreeProps {
  user: User;
  customCssUrl?: string;
  onFunctionCall?: (functionName: string, args: any[]) => void;
  onAssistantMessage?: (message: LlamaMessage) => void;
}

class ChatWidgetElement extends HTMLElement {
  private root?: ShadowRoot;
  private reactRoot?: ReactDOM.Root;
  private styleLink?: HTMLLinkElement;

  private url?: string;

  private subs: (() => void)[] = [];

  connectedCallback() {
    this.initializeRoot();
  }

  setUrl(url: string) {
    this.url = url;
    this.appendStyleSheet(url);
  }

  async setProps(props: LlamaTreeProps) {
    this.validateInitialization();
    this.setCustomCssUrl(props.customCssUrl);

    this.subscribeToEvents(props);
    await this.configureAndRender(props);
  }

  sendMessage(message: string) {
    eventBus.emit("user-message", message);
  }

  sendChatParams(params: LlamaChatParams) {
    eventBus.emit("chat-params", params);
  }

  disconnectedCallback() {
    this.unmountComponent();
  }

  private initializeRoot() {
    this.root = this.attachShadow({ mode: "open" });
    this.reactRoot = ReactDOM.createRoot(this.root);
  }

  private appendStyleSheet(url: string) {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = `${url}/style.css`;
    this.root?.appendChild(styleLink);

    this.styleLink = styleLink;
  }

  private setCustomCssUrl(customCssUrl?: string) {
    if (customCssUrl) {
      this.styleLink!.href = customCssUrl;
    }
  }

  private validateInitialization() {
    if (!this.root || !this.reactRoot || !this.url) {
      throw new Error("ChatWidgetElement is not fully initialized.");
    }
  }

  private subscribeToEvents(props: LlamaTreeProps) {
    if (props.onFunctionCall) {
      this.subs.push(eventBus.on("function-call", ({ functionName, args }) =>
        props.onFunctionCall?.(functionName, args),
      ));
    }

    if (props.onAssistantMessage) {
      this.subs.push(eventBus.on("assistant-message", props.onAssistantMessage));
    }
  }

  private async configureAndRender(props: LlamaTreeProps) {
    const token = await props.user.getIdToken();
    const firebaseConfig = await this.fetchChatConfig(token, props);
    this.renderChatWidget(props, firebaseConfig);
  }

  private async fetchChatConfig(token: string, props: LlamaTreeProps) {
    const response = await fetch(`${this.url}/api/v1/chat/config`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      },
    });
    const data = await response.text();
    return decodeMessage(props.user.uid, data);
  }

  private renderChatWidget(props: LlamaTreeProps, firebaseConfig: any) {
    this.reactRoot!.render(
      <StrictMode>
        <LlamaTreeProvider url={this.url!} firebaseConfig={firebaseConfig} user={props.user}>
          <Main/>
        </LlamaTreeProvider>
      </StrictMode>,
    );
  }

  private unmountComponent() {
    this.reactRoot?.unmount();
    this.subs.forEach((unsub) => unsub());
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
