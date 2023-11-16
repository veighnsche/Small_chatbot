import { useLlamaDispatch } from "../../stores/llamaStore.ts";
import { llamaSseAddMessage } from "../../thunks/llamaSseAddMessage.ts";
import { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from "react";

export const useLlamaInput = () => {
  const dispatch = useLlamaDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const inputOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const reset = () => {
    setInputValue("");
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto before setting the scrollHeight
      const newHeight = textAreaRef.current.scrollHeight > 150 ? 150 : textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleInputOnKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = async e => {
    // if shift + enter, add a new line
    if (e.shiftKey && e.key === "Enter") {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      await handleSend();
    }
  };

  const handleSend = async () => {
    if (!inputValue) {
      return;
    }
    reset();
    await dispatch(llamaSseAddMessage({
      newMessages: [{
        content: inputValue,
        role: "user",
      }],
    }));
  };

  return {
    inputValue,
    inputOnChange,
    handleInputOnKeyPress,
    handleSend,
    textAreaRef,
  };
}