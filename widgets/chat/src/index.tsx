import { User } from "firebase/auth";
import { ChatCompletionMessage } from "openai/resources/chat/completions";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import Main from "./Main";
import { LlamaTreeProvider } from "./providers/LlamaTreeProvider";
import "./reset.css";
import { decodeMessage } from "./services/crypto";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { LlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { LlamaChatViewSliceState } from "./slices/llamaChatViewSlice.ts";
import { LlamaActions } from "./stores/llamaStore.ts";


export interface LlamaTreeProps {
  user: User;
  customCssUrl?: string;
  onLlamaAction?: (action: LlamaActions) => void;
  onFunctionCall?: (functionCall: ChatCompletionMessage.FunctionCall) => void;
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
    llamaEventBus.emit("user-message", message);
  }

  sendChatParams(params: LlamaChatParams) {
    llamaEventBus.emit("chat-params", params);
  }

  sendChatView(view: LlamaChatViewSliceState) {
    llamaEventBus.emit("chat-view", view);
  }

  sendChatId(chatId: string) {
    llamaEventBus.emit("chat-id", chatId);
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
      const functionCallSub = llamaEventBus.on("function-call", (functionCall) =>
        props.onFunctionCall?.(functionCall),
      );
      this.subs.push(functionCallSub);
    }

    if (props.onLlamaAction) {
      const llamaActionSub = llamaEventBus.on("llama-action", (action) =>
        props.onLlamaAction?.(action),
      );
      this.subs.push(llamaActionSub);
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
