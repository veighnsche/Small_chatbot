import React, { createContext, useEffect, useRef, useState } from "react";
import { _useLlamaScript } from "../hooks/_useLlamaScript";
import { _useLlamaTreeInvoker } from "../hooks/_useLlamaTreeProxy";
import { _LlamaQueueAction } from "../types/_LlamaQueue";
import { _LlamaTreeContextType } from "../types/_LlamaTreeContextType";
import { IChatWidgetElement } from "../types/IChatWidgetElement";
import { LlamaTreeProviderProps } from "../types/llamaTypes";

export const LlamaTreeContext = createContext<_LlamaTreeContextType>({} as _LlamaTreeContextType);

export const LlamaTreeProvider = ({ children, url, onInitialize }: LlamaTreeProviderProps) => {
  const [llamaTree, setLlamaTree] = useState<IChatWidgetElement | null>(null);
  const llamaQueue = useRef<_LlamaQueueAction[]>([]);
  const invokeAction = _useLlamaTreeInvoker(llamaTree);

  async function initializeLlamaTree(retries = 10) {
    const llamaTreeElement: IChatWidgetElement | null = document.querySelector("llama-tree-chat-widget");
    setLlamaTree(llamaTreeElement);

    if (!llamaTreeElement) {
      if (retries <= 0) {
        console.error("LlamaTree not found");
        return;
      }

      setTimeout(() => {
        initializeLlamaTree(retries - 1);
      }, 500);

      return;
    }
  }

  useEffect(() => {
    if (llamaTree) {
      llamaTree.onLlamaReady(async () => {
        for await (const action of llamaQueue.current) {
          if (action.method === "setUser") {
            continue;
          }
          await invokeAction(action);
        }
        if (onInitialize) {
          onInitialize(llamaTree!);
        }
      });

      const setUserAction = llamaQueue.current.find((action) => action.method === "setUser");
      if (!setUserAction) {
        throw new Error("setUser should not be called before llama tree is initialized");
      }

      invokeAction(setUserAction).catch(console.trace);
    }
  }, [llamaTree]);

  _useLlamaScript({
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
