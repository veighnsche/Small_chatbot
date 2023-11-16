import { useState } from "react";
import { Manager, Popper, Reference } from "react-popper";
import Copy from "../../../assets/copy.svg";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import "./CopyToClipboard.css";
import { LlamaCopyToClipboardProps, useLlamaCopyToClipboard } from "./useLlamaCopyToClipboard.ts";

export const CopyToClipboard = (props: LlamaCopyToClipboardProps) => {
  const { copyToClipboard } = useLlamaCopyToClipboard(props);
  const [isPopperVisible, setPopperVisible] = useState(false);

  const handleCopyClick = async () => {
    await copyToClipboard();
    setPopperVisible(true);
    setTimeout(() => {
      setPopperVisible(false);
    }, 2500); // Adjust this duration based on your animation duration
  };


  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <IconButton onClick={handleCopyClick} title={"Copy to Clipboard"} type="button" ref={ref}>
            <img src={Copy} alt="copy icon"/>
          </IconButton>
        )}
      </Reference>
      {isPopperVisible && (
        <Popper placement={"right"}>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className="popper-enter"
            >
              Copied!
              <div ref={arrowProps.ref} style={arrowProps.style}/>
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
};
