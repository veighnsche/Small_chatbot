import {
  LlamaCopyToClipboardProps,
  useLlamaCopyToClipboard,
} from "./useLlamaCopyToClipboard.ts";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import { Tooltip } from "../../utils/Tooltip/Tooltip.tsx";
import Copy from "../../../icons/copy.svg";

export const CopyToClipboard = (props: LlamaCopyToClipboardProps) => {
  const { copyToClipboard } = useLlamaCopyToClipboard(props);

  return (
    <Tooltip content="Copied!" onClick={copyToClipboard}>
      <IconButton>
        <img src={Copy} alt="copy icon"/>
      </IconButton>
    </Tooltip>
  );
};