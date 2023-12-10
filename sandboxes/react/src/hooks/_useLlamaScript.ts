import { useEffect } from "react";

interface _UseLlamaScriptParams {
  scriptUrl: string;
  initializeLlamaTree: (retries?: number) => void;
}

export const _useLlamaScript = ({ scriptUrl, initializeLlamaTree }: _UseLlamaScriptParams) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${scriptUrl}/module`;
    script.id = "llama-tree-script";
    script.type = "module";
    script.async = true;

    // Optional: Add an onLoad event listener
    script.onload = () => {
      initializeLlamaTree();
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};