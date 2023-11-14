import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
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
import { configureLlamaStore, LlamaActions } from "./stores/llamaStore.ts";
import { LlamaLoadedSystemMessage } from "./types/LlamaLoadedSystemMessage.ts";
import { configureWretch } from "./utils/fetch.ts";


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

  loadSystemMessage(systemMessage: LlamaLoadedSystemMessage) {
    llamaEventBus.emit("load-system-message", systemMessage);
  }

  removeLoadedSystemMessage(id: string) {
    llamaEventBus.emit("remove-system-message", id);
  }

  sendMessage(message: string) {
    llamaEventBus.emit("user-message", message);
  }

  setChatParams(params: LlamaChatParams) {
    llamaEventBus.emit("chat-params", params);
  }

  setChatView(view: Partial<LlamaChatViewSliceState>) {
    llamaEventBus.emit("chat-view", view);
  }

  setChatId(chatId: string) {
    llamaEventBus.emit("chat-id", chatId);
  }

  onFunctionCall(callback: (functionCall: ChatCompletionMessage.FunctionCall) => void): () => void {
    return llamaEventBus.on("function-call", callback);
  }

  onLlamaAction(callback: (action: LlamaActions) => void): () => void {
    return llamaEventBus.on("llama-action", callback);
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
      this.subs.push(llamaEventBus.on("function-call", props.onFunctionCall));
    }

    if (props.onLlamaAction) {
      this.subs.push(llamaEventBus.on("llama-action", props.onLlamaAction));
    }
  }

  private async configureAndRender(props: LlamaTreeProps) {
    const token = await props.user.getIdToken();
    const firebaseConfig = await this.fetchChatConfig(token, props);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.onAuthStateChanged((user) => {
      if (user) {
        const db = getFirestore(app);
        const llamaStore = configureLlamaStore({
          wretch: configureWretch({ url: this.url!, user }),
          userDocRef: doc(db, "assistantChat", user.uid),
          user,
        });
        this.renderChatWidget(llamaStore);
      }
    });

    await auth.updateCurrentUser(props.user);
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

  private renderChatWidget(llamaStore: ReturnType<typeof configureLlamaStore>) {
    this.reactRoot!.render(
      <StrictMode>
        <LlamaTreeProvider llamaStore={llamaStore}>
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
