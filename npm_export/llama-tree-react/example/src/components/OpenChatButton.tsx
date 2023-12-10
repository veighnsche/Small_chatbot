import * as React from "react";
import { useLlamaTree } from "../../../src";

export const OpenChatButton = () => {
  const { setChatView } = useLlamaTree();

  return (
    <button onClick={() => {
      setChatView({
        isHistoryDrawerOpen: true,
        isLarge: true,
        isOpen: true,
      });
    }}>Open Chat</button>
  );
};