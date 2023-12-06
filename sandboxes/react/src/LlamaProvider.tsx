import React, { createContext, useCallback, useContext, useRef } from "react";

import { IChatWidgetElement, LlamaQueueAction, LlamaTreeContextType, LlamaTreeProviderProps } from "./llamaTypes";
import { useLlamaProxy } from "./services/useLlamaProxy";
import { useLlamaScript } from "./services/useLlamaScript";

export const LlamaTreeContext = createContext<LlamaTreeContextType>({} as LlamaTreeContextType);

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree } = useContext(LlamaTreeContext);
  const llamaTreeProxy = useLlamaProxy();

  return llamaTree || llamaTreeProxy;
};

export const LlamaTreeProvider = ({ children, url, onInitialize }: LlamaTreeProviderProps) => {
  const llamaTree = useRef<IChatWidgetElement | null>(null);
  const llamaQueue = useRef<LlamaQueueAction[]>([]);

  const runQueue = useCallback(async (llamaTreeElement: IChatWidgetElement) => {
    console.log("runQueue", llamaQueue);
    for await (const { method, args } of llamaQueue.current) {
      if (typeof llamaTreeElement[method] === "function" && method !== "setUser") {
        try {
          await (llamaTreeElement[method] as Function)(...args);
        } catch (e) {
          console.trace("failed to call a possible method: " + e);
        }
      }
    }

    llamaQueue.current = [];
  }, []);

  const runQueueSetUser = useCallback(async (llamaTreeElement: IChatWidgetElement) => {
    console.log("runQueueSetUser", llamaQueue);
    for await (const { method, args } of llamaQueue.current) {
      if (typeof llamaTreeElement[method] === "function" && method === "setUser") {
        try {
          await (llamaTreeElement[method] as Function)(...args);
        } catch (e) {
          console.trace("failed to call a possible method: " + e);
        }
      }
    }

    llamaQueue.current = [];
  }, []);

  async function initializeLlamaTree(retries = 10) {
    llamaTree.current = document.querySelector("llama-tree-chat-widget");
    if (!llamaTree.current) {
      if (retries <= 0) {
        console.error("LlamaTree not found");
        return;
      }

      setTimeout(() => {
        initializeLlamaTree(retries - 1);
      }, 500);

      return;
    }

    llamaTree.current.onLlamaReady(async () => {
      if (onInitialize) {
        await runQueue(llamaTree.current!);
        onInitialize(llamaTree.current!);
      }
    });

    await runQueueSetUser(llamaTree.current);
  }

  useLlamaScript({
    scriptUrl: url,
    initializeLlamaTree,
  });

  return (
    <LlamaTreeContext.Provider value={{
      llamaTree: llamaTree.current,
      llamaQueue,
    }}>
      {children}
    </LlamaTreeContext.Provider>
  );
};
