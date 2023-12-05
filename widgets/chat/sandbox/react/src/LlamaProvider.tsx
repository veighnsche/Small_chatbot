import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Helmet } from "react-helmet";

import { IChatWidgetElement } from "./llamaTypes";

interface LlamaTreeProviderProps {
  children: ReactNode;
  url: string;
  onInitialize?: (llamaTree: IChatWidgetElement) => void;
}

type LlamaQueueActions = Array<{
  method: keyof IChatWidgetElement;
  args: any[]
}>;

interface LlamaTreeContextType {
  llamaTree: IChatWidgetElement | null;
  llamaQueue: LlamaQueueActions;
  setLlamaQueue: Dispatch<SetStateAction<LlamaQueueActions>>;
}

const LlamaTreeContext = createContext<LlamaTreeContextType>({
  llamaTree: null,
  llamaQueue: [],
  setLlamaQueue: () => void 0,
});

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree, setLlamaQueue } = useContext(LlamaTreeContext);

  // Function to queue actions
  const queueAction = (methodName: keyof IChatWidgetElement, args: any[]) => {
    setLlamaQueue((prevQueue: LlamaQueueActions) => [...prevQueue, { method: methodName, args }]);
  };

  const placeInQueue = (methodName: keyof IChatWidgetElement, args: any[], index: number) => {
    setLlamaQueue((prevQueue: LlamaQueueActions) => {
      if (index > prevQueue.length) {
        return [...prevQueue, { method: methodName, args }];
      }

      const newQueue = [...prevQueue];
      newQueue.splice(index, 0, { method: methodName, args });
      return newQueue;
    });
  };

  // Create a proxy that intercepts method calls
  const llamaTreeProxy = useMemo(() => {
    return new Proxy({} as IChatWidgetElement, {
      get(_, prop: keyof IChatWidgetElement) {
        return (...args: any[]) => {
          if (prop === "setUser") {
            placeInQueue(prop, args, 0);
          } else {
            queueAction(prop, args);
          }
        };
      },
    }) as IChatWidgetElement;
  }, []);

  return llamaTree || llamaTreeProxy;
};


export const LlamaTreeProvider = ({ children, url, onInitialize }: LlamaTreeProviderProps) => {
  const [llamaTree, setLlamaTree] = useState<IChatWidgetElement | null>(null);
  const [llamaQueue, setLlamaQueue] = useState<LlamaQueueActions>([]);

  useEffect(() => {
    // Initialize LlamaTree when the component mounts
    if (!url) {
      return;
    }

    initializeLlamaTree();
  }, []);

  function initializeLlamaTree(retries = 10) {
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
  }

  async function runQueue() {
    if (!llamaTree) {
      return;
    }

    for await (const { method, args } of llamaQueue) {
      const possibleMethod = llamaTree[method];
      if (typeof possibleMethod === "function") {
        await (possibleMethod as Function)(...args);
      }
    }

    setLlamaQueue([]);

    if (onInitialize) {
      onInitialize(llamaTree);
    }
  }

  useEffect(() => {
    runQueue().catch(console.error);
  }, [llamaTree]);

  return (
    <>
      <Helmet>
        <script type="module" src={`${url}/module`}/>
      </Helmet>
      <LlamaTreeContext.Provider value={{
        llamaTree,
        llamaQueue,
        setLlamaQueue,
      }}>
        {children}
      </LlamaTreeContext.Provider>
    </>
  );
};