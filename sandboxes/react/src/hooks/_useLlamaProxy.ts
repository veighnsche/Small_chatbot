import { useContext, useMemo } from "react";
import { LlamaTreeContext } from "../providers/LlamaProvider";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const _useLlamaProxy = () => {
  const { llamaQueue } = useContext(LlamaTreeContext);

  const queueAction = (methodName: keyof IChatWidgetElement, args: any[], index?: number) => {
    if (!index) {
      llamaQueue.current.push({ method: methodName, args });
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