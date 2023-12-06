import { useContext, useMemo } from "react";
import { LlamaTreeContext } from "../LlamaProvider";
import { IChatWidgetElement } from "../llamaTypes";

export const useLlamaProxy = () => {
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
    return new Proxy({} as IChatWidgetElement, {
      get(_, prop: keyof IChatWidgetElement) {
        return (...args: any[]) => {
          if (prop === "setUser") {
            queueAction(prop, args, 0);
          } else {
            queueAction(prop, args);
          }
        };
      },
    }) as IChatWidgetElement;
  }, []);
};