import { useCallback, useContext, useMemo } from "react";
import { LlamaTreeContext } from "../providers/LlamaProvider";
import { _LlamaQueueAction } from "../types/_LlamaQueue";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const _useLlamaTreeProxy = () => {
  const { llamaQueue } = useContext(LlamaTreeContext);

  const queueAction = (methodName: keyof IChatWidgetElement, args: any[], index?: number) => {
    if (!index) {
      llamaQueue.current.push({  method: methodName, args });
    } else {
      llamaQueue.current.splice(index, 0, { method: methodName, args });
    }
  };

  // make a proxy that queues up actions until the llamaTree is loaded
  return useMemo(() => {
    let proxy: IChatWidgetElement;
    const { proxy: createdProxy } = Proxy.revocable({} as IChatWidgetElement, {
      get(_, prop: keyof IChatWidgetElement) {
        return (...args: any[]) => {
          // if prop start with "on" then it's an event handler and should not be queued
          if (prop.startsWith("on")) {
            return proxy;
          }
          if (prop === "setUser") {
            queueAction(prop, args, 0);
          } else {
            queueAction(prop, args);
          }
          return proxy;
        };
      },
    });
    proxy = createdProxy as IChatWidgetElement;
    return proxy;
  }, []);
};

export const _useLlamaTreeInvoker = (llamaTree: IChatWidgetElement | null) => {
  return useCallback(async ({ method, args }: _LlamaQueueAction) => {
    if (llamaTree && typeof llamaTree[method] === "function") {
      try {
        console.log("invokeAction", method);
        await (llamaTree[method] as Function)(...args);
      } catch (e) {
        console.trace("failed to call a possible method: " + e);
      }
    }
  }, [llamaTree]);
};