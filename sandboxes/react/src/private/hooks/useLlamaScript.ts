import { useEffect } from "react";

interface UseLlamaScriptParams {
  scriptUrl: string;
  initializeLlamaTree: (retries: number) => void;
}

export const useLlamaScript = ({ scriptUrl, initializeLlamaTree }: UseLlamaScriptParams) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${scriptUrl}/module`;
    script.id = "llama-tree-script";
    script.type = "module";
    script.async = true;

    // Optional: Add an onLoad event listener
    script.onload = () => {
      initializeLlamaTree(10);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};