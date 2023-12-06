import React, { createContext, useCallback, useContext, useRef, useState } from "react";

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
  const [llamaTree, setLlamaTree] = useState<IChatWidgetElement | null>(null);
  const llamaQueue = useRef<LlamaQueueAction[]>([]);

  const runQueue = useCallback(async (llamaTree: IChatWidgetElement) => {
    console.log("runQueue", llamaQueue);
    for await (const { method, args } of llamaQueue.current) {
      if (typeof llamaTree[method] === "function") {
        try {
          await (llamaTree[method] as Function)(...args);
        } catch (e) {
          console.trace("failed to call a possible method: " + e);
        }
      }
    }

    llamaQueue.current = [];
  }, []);

  async function initializeLlamaTree(retries = 10) {
    const llamaTreeCheck: IChatWidgetElement | null = document.querySelector("llama-tree-chat-widget");
    if (!llamaTreeCheck) {
      if (retries <= 0) {
        console.error("LlamaTree not found");
        return;
      }

      setTimeout(() => {
        initializeLlamaTree(retries - 1);
      }, 500);

      return;
    }

    console.log("LlamaTree found");

    setLlamaTree(llamaTreeCheck);

    await runQueue(llamaTreeCheck);

    llamaTreeCheck.onLlamaReady(() => {
      console.log("LlamaTree ready");
      if (onInitialize) {
        onInitialize(llamaTreeCheck);
      }
    });
  }

  useLlamaScript({
    scriptUrl: url,
    initializeLlamaTree,
  });

  return (
    <LlamaTreeContext.Provider value={{
      llamaTree,
      llamaQueue,
    }}>
      {children}
    </LlamaTreeContext.Provider>
  );
};