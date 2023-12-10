import * as React from "react";
import { useLlamaTree } from "../../../src";

export const SendMessageButton = () => {
  const { sendLlamaMessage } = useLlamaTree();
  return (
    <div>
      <button
        onClick={async () => {
          await sendLlamaMessage("Improve the introduction");
        }}
      >
        Send Message
      </button>
    </div>
  );
};