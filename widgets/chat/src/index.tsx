import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import { ChatCompletionMessage } from "openai/resources/chat/completions";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import Main from "./Main";
import { LlamaStreamingProvider } from "./providers/LlamaStreamingProvider.tsx";
import { LlamaTreeProvider } from "./providers/LlamaTreeProvider";
import "./reset.css";
import { decodeMessage } from "./services/crypto";
import { llamaEventBus } from "./services/llamaEventBus.ts";
import { LlamaChatParams } from "./slices/llamaChatParamsSlice.ts";
import { LlamaChatViewSliceState } from "./slices/llamaChatViewSlice.ts";
import { configureLlamaStore, LlamaActions } from "./stores/llamaStore.ts";
import { LlamaLoadedSystemMessage } from "./types/LlamaLoadedSystemMessage.ts";
import { LlamaMessage } from "./types/LlamaMessage.ts";
import { configureWretch } from "./utils/fetch.ts";
import { generateUniqueID } from "./utils/uid.ts";

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
    this.applyCustomCss(props.customCssUrl);
    this.subscribeToEvents(props);
    await this.renderWidget(props);
  }

  loadSystemMessage(systemMessage: LlamaLoadedSystemMessage) {
    llamaEventBus.emit("load-system-messages", [systemMessage]);
    return this;
  }

  removeLoadedSystemMessage(id: string) {
    llamaEventBus.emit("remove-system-messages", [id]);
    return this;
  }

  loadSystemMessages(systemMessages: LlamaLoadedSystemMessage[]) {
    llamaEventBus.emit("load-system-messages", systemMessages);
    return this;
  }

  removeLoadedSystemMessages(ids: string[]) {
    llamaEventBus.emit("remove-system-messages", ids);
    return this;
  }

  emptyLoadedSystemMessages() {
    llamaEventBus.emit("empty-system-messages");
    return this;
  }

  setChatParams(params: LlamaChatParams | ((params: LlamaChatParams) => Partial<LlamaChatParams>)) {
    llamaEventBus.emit("chat-params", params);
    return this;
  }

  setChatView(view: Partial<LlamaChatViewSliceState>) {
    llamaEventBus.emit("chat-view", view);
    return this;
  }

  setChatId(chatId: string) {
    llamaEventBus.emit("chat-id", chatId);
    return this;
  }

  async sendLlamaMessage(message: string, params?: Partial<LlamaChatParams>): Promise<LlamaMessage> {
    const assistantUid = generateUniqueID();
    llamaEventBus.emit("user-message", { message, params, assistantUid });
    return llamaEventBus.onceAsync("assistant_uid: " + assistantUid);
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
    this.styleLink = document.createElement("link");
    this.styleLink.rel = "stylesheet";
    this.styleLink.href = `${url}/style.css`;
    this.root?.appendChild(this.styleLink);
  }

  private applyCustomCss(customCssUrl?: string) {
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
      this.subs.push(this.onFunctionCall(props.onFunctionCall));
    }

    if (props.onLlamaAction) {
      this.subs.push(this.onLlamaAction(props.onLlamaAction));
    }
  }

  private async renderWidget(props: LlamaTreeProps) {
    const token = await props.user.getIdToken();
    const firebaseConfig = await this.fetchChatConfig(token, props);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getFirestore(app);
        const llamaStore = configureLlamaStore({
          wretch: configureWretch({ url: this.url!, user }),
          userDocRef: doc(db, "assistantChat", user.uid),
          user,
        });

        this.reactRoot!.render(
          <StrictMode>
            <LlamaStreamingProvider>
              <LlamaTreeProvider llamaStore={llamaStore}>
                <Main/>
              </LlamaTreeProvider>
            </LlamaStreamingProvider>
          </StrictMode>,
        );
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

  private unmountComponent() {
    this.reactRoot?.unmount();
    this.subs.forEach((unsub) => unsub());
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
