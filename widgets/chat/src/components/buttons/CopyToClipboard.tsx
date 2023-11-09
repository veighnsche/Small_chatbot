import * as React from "react";
import {
  LlamaCopyToClipboardProps,
  useLlamaCopyToClipboard,
} from "../../hooks/components/buttons/useLlamaCopyToClipboard";
import { IconButton } from "../utils/IconButton";
import { Tooltip } from "../utils/Tooltip";

export const CopyToClipboard = (props: LlamaCopyToClipboardProps) => {
  const { copyToClipboard } = useLlamaCopyToClipboard(props);

  return (
    <Tooltip content="Copied!" onClick={copyToClipboard}>
      <IconButton>
        <img src="http://localhost:3001/icons/copy.svg" alt="copy icon"/>
      </IconButton>
    </Tooltip>
  );
};