import {
  LlamaCopyToClipboardProps,
  useLlamaCopyToClipboard,
} from "./useLlamaCopyToClipboard.ts";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import { Tooltip } from "../../utils/Tooltip/Tooltip.tsx";

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