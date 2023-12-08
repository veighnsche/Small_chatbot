import React, { createContext, useCallback, useRef } from "react";
import { useLlamaScript } from "../../private/hooks/useLlamaScript";
import { LlamaTreeContextType } from "../../private/types/context";
import { LlamaQueueAction } from "../../private/types/llamaQueue";
import { IChatWidgetElement } from "../types/IChatWidgetElement";
import { LlamaTreeProviderProps } from "../types/llamaTypes";

export const LlamaTreeContext = createContext<LlamaTreeContextType>({} as LlamaTreeContextType);

export const LlamaTreeProvider = ({ children, url, onInitialize }: LlamaTreeProviderProps) => {
  const llamaTree = useRef<IChatWidgetElement | null>(null);
  const llamaQueue = useRef<LlamaQueueAction[]>([]);

  const invokeAction = useCallback(async ({ method, args }: LlamaQueueAction) => {
    console.log("invokeAction", method);
    if (llamaTree.current && typeof llamaTree.current[method] === "function") {
      try {
        await (llamaTree.current[method] as Function)(...args);
      } catch (e) {
        console.trace("failed to call a possible method: " + e);
      }
    }
  }, [llamaTree.current]);

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
      for await (const action of llamaQueue.current) {
        if (action.method === "setUser") {
          continue;
        }
        await invokeAction(action);
      }
      if (onInitialize) {
        onInitialize(llamaTree.current!);
      }
    });

    const setUserAction = llamaQueue.current.find((action) => action.method === "setUser");
    if (!setUserAction) {
      throw new Error("setUser should not be called before llama tree is initialized");
    }
    await invokeAction(setUserAction);
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
