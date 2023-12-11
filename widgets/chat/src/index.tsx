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
import { generateUnique_id } from "./utils/uid.ts";

export interface LlamaTreeProps {
  user: User;
  customCssUrl?: string;
}

class ChatWidgetElement extends HTMLElement {
  private root?: ShadowRoot;
  private reactRoot?: ReactDOM.Root;
  private styleLink?: HTMLLinkElement;

  private url?: string;
  private user?: User;

  async connectedCallback() {
    this.root = this.attachShadow({ mode: "open" });
    this.reactRoot = ReactDOM.createRoot(this.root);
    const url = this.getAttribute("url");
    if (url) {
      await this.setUrl(url);
    }
  }

  test() {
    console.log("test");
  }

  async setUrl(url: string) {
    this.url = url;
    this.appendStyleSheet(url);
    await this.renderWidget();
  }

  async setUser(user: User) {
    try {
      this.user = user;
    } catch (e) {
      console.trace("failed to set user");
      console.error(e);
    }

    try {
      await this.renderWidget();
    } catch (e) {
      console.trace("failed to render widget");
      console.error(e);
    }
  }

  async setCustomCssUrl(url: string) {
    this.styleLink!.href = url;
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

  setChat_id(chat_id: string) {
    llamaEventBus.emit("chat-id", chat_id);
    return this;
  }

  async sendLlamaMessage(message: string, params?: Partial<LlamaChatParams>): Promise<LlamaMessage> {
    const assistant_uid = generateUnique_id();
    llamaEventBus.emit("user-message", { message, params, assistant_uid });
    return llamaEventBus.onceAsync("assistant_uid: " + assistant_uid);
  }

  onLlamaReady(callback: () => void): () => void {
    console.log("on llama ready")
    return llamaEventBus.on("llama-chat-initialized", callback);
  }

  onFunctionCall(callback: (functionCall: ChatCompletionMessage.FunctionCall) => void): () => void {
    return llamaEventBus.on("function-call", callback);
  }

  onFunctionArgumentsStream(functionName: string, callback: (args: Record<string, any>) => void): () => void {
    return llamaEventBus.on(`stream-arguments: ${functionName}`, callback);
  }

  onLlamaAction(callback: (action: LlamaActions) => void): () => void {
    return llamaEventBus.on("llama-action", callback);
  }

  disconnectedCallback() {
    this.unmountComponent();
  }

  private appendStyleSheet(url: string) {
    this.styleLink = document.createElement("link");
    this.styleLink.rel = "stylesheet";
    this.styleLink.href = `${url}/style.css`;
    this.root?.appendChild(this.styleLink);
  }

  /**
   *
   * @returns a promise of the element to be rendered
   */
  private async renderWidget(): Promise<void> {
    if (!this.root || !this.reactRoot || !this.url || !this.user) {
      return;
    }

    const token = await this.user.getIdToken();
    const firebaseConfig = await this.fetchChatConfig(token, this.user.uid);
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

    await auth.updateCurrentUser(this.user);
  }

  private async fetchChatConfig(token: string, uid: string) {
    const response = await fetch(`${this.url}/api/v1/chat/config`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      },
    });
    const data = await response.text();
    return decodeMessage(uid, data);
  }

  private unmountComponent() {
    this.reactRoot?.unmount();
  }
}

window.customElements.define("llama-tree-chat-widget", ChatWidgetElement);
