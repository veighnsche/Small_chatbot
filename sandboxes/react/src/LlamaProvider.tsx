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

import { IChatWidgetElement } from "./llamaTypes";

interface LlamaTreeProviderProps {
  children: ReactNode;
  url: string;
  onInitialize?: (llamaTree: IChatWidgetElement) => void;
}

interface LlamaQueueAction {
  method: keyof IChatWidgetElement;
  args: any[];
}

interface LlamaTreeContextType {
  llamaTree: IChatWidgetElement | null;
  llamaQueue: LlamaQueueAction[];
  setLlamaQueue: Dispatch<SetStateAction<LlamaQueueAction[]>>;
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
    setLlamaQueue((prevQueue: LlamaQueueAction[]) => [...prevQueue, { method: methodName, args }]);
  };

  const placeInQueue = (methodName: keyof IChatWidgetElement, args: any[], index: number) => {
    setLlamaQueue((prevQueue: LlamaQueueAction[]) => {
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
  const [llamaQueue, setLlamaQueue] = useState<LlamaQueueAction[]>([]);

  function initializeLlamaTree(retries = 10) {
    const llamaTreeCheck: IChatWidgetElement | null = document.querySelector("llama-tree-chat-widget");
    if (!llamaTreeCheck) {
      console.error("LlamaTree not found");
      if (retries <= 0) {
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

  async function runQueue(llamaTree: IChatWidgetElement) {
    for await (const { method, args } of llamaQueue) {
      const possibleMethod = llamaTree[method];
      if (typeof possibleMethod === "function") {
        try {
          console.log(possibleMethod)
          console.log("calling a possible method: " + method, args)
          await (possibleMethod as Function)(...args);
        } catch (e) {
          console.trace("failed to call a possible method: " + e);
        }
      }
    }

    setLlamaQueue([]);

    if (onInitialize) {
      onInitialize(llamaTree);
    }
  }

  useEffect(() => {
    if (llamaTree) {
      runQueue(llamaTree).catch(console.error)
    }
  }, [llamaTree]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${url}/module`; // Replace `${url}/module` with your script URL
    script.type = "module";
    script.async = true;

    // Optional: Add an onLoad event listener
    script.onload = () => {
      console.log("Script loaded!");
      initializeLlamaTree(10); // Call your function after the script is loaded
    };

    // Append the script to the document head
    document.head.appendChild(script);

    // Optional: Clean up function to remove the script when the component unmounts
    return () => {
      document.head.removeChild(document.head.lastChild!);
    };
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <LlamaTreeContext.Provider value={{
      llamaTree,
      llamaQueue,
      setLlamaQueue,
    }}>
      {children}
    </LlamaTreeContext.Provider>
  );
};