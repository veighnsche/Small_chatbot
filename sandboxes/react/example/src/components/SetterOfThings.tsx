import { useEffect } from "react";
import { useLlamaTree } from "../../../src";

export const SetterOfThings = () => {
  const { loadSystemMessage } = useLlamaTree();
  useEffect(() => {
    loadSystemMessage({
      content: "Hello, world!",
      title: "info",
    })
  }, []);

  return null;
}